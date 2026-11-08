const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const { requirePostOwner, validatePostContent } = require('./post-rules');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const SECURE_COOKIE = process.env.NODE_ENV === 'production';
const DB_FILE = process.env.DB_FILE || path.join(ROOT, 'database', 'student-network.sqlite');
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
const db = new DatabaseSync(DB_FILE);
db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
db.exec(fs.readFileSync(path.join(ROOT, 'database', 'schema.sql'), 'utf8'));

const q = (sql, ...args) => db.prepare(sql).all(...args);
const one = (sql, ...args) => db.prepare(sql).get(...args);
const run = (sql, ...args) => db.prepare(sql).run(...args);
const safeUser = (u) => ({ user_id: u.user_id, full_name: u.full_name, email: u.email, major: u.major, faculty: u.faculty, bio: u.bio, role: u.role, created_at: u.created_at });
const digest = (token) => crypto.createHash('sha256').update(token).digest('hex');
const cookie = (res, value, maxAge) => res.setHeader('Set-Cookie', `sid=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${SECURE_COOKIE ? '; Secure' : ''}`);
const json = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };

function fail(status, message) { const e = new Error(message); e.status = status; throw e; }
function parseCookies(header = '') { return Object.fromEntries(header.split(';').map(v => v.trim().split('=').map(decodeURIComponent)).filter(v => v.length === 2)); }
async function body(req) {
  let raw = '';
  for await (const part of req) { raw += part; if (raw.length > 20_000) fail(413, 'Request is too large.'); }
  try { return raw ? JSON.parse(raw) : {}; } catch { fail(400, 'Please send valid JSON.'); }
}
function currentUser(req) {
  const token = parseCookies(req.headers.cookie).sid;
  if (!token) return null;
  const session = one('SELECT user_id FROM sessions WHERE token_hash = ? AND expires_at > ?', digest(token), new Date().toISOString());
  return session ? one('SELECT * FROM users WHERE user_id = ?', session.user_id) : null;
}
function requireUser(req) { const user = currentUser(req); if (!user) fail(401, 'Please log in to continue.'); return user; }
function text(value, field, max, { optional = false } = {}) {
  const result = String(value ?? '').trim();
  if (!result && optional) return '';
  if (!result || result.length > max) fail(400, `${field} must be between 1 and ${max} characters.`);
  return result;
}
function postShape(row, viewerId) {
  const comments = q(`SELECT c.comment_id,c.content,c.created_at,u.user_id,u.full_name,u.major FROM comments c JOIN users u USING(user_id) WHERE c.post_id=? ORDER BY c.created_at`, row.post_id);
  return { ...row, liked_by_me: !!one('SELECT 1 FROM likes WHERE post_id=? AND user_id=?', row.post_id, viewerId), comments };
}
function createSession(userId, res) {
  const token = crypto.randomBytes(32).toString('base64url');
  run('INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)', digest(token), userId, new Date().toISOString(), new Date(Date.now() + 7 * 86400000).toISOString());
  cookie(res, token, 7 * 86400);
}
function transactional(action) { db.exec('BEGIN'); try { const value = action(); db.exec('COMMIT'); return value; } catch (e) { db.exec('ROLLBACK'); throw e; } }

async function api(req, res, url) {
  const method = req.method;
  const parts = url.pathname.split('/').filter(Boolean).slice(1);
  const route = parts.join('/');
  if (method === 'GET' && route === 'health') return json(res, 200, { ok: true });
  if (method === 'POST' && route === 'auth/register') {
    const b = await body(req); const name = text(b.full_name, 'Name', 100); const email = text(b.email, 'Email', 150).toLowerCase(); const major = text(b.major, 'Major', 100); const password = text(b.password, 'Password', 200);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'Enter a valid email address.');
    if (password.length < 8) fail(400, 'Use a password with at least 8 characters.');
    if (one('SELECT user_id FROM users WHERE email=?', email)) fail(409, 'That email is already registered.');
    const salt = crypto.randomBytes(16).toString('hex'); const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    const result = run(`INSERT INTO users(full_name,email,password_hash,major,faculty,bio,role,created_at) VALUES(?,?,?,?,?,?,?,?)`, name, email, `${salt}:${hash}`, major, text(b.faculty, 'Faculty', 100, { optional: true }), '', 'student', new Date().toISOString());
    createSession(Number(result.lastInsertRowid), res); return json(res, 201, { user: safeUser(one('SELECT * FROM users WHERE user_id=?', Number(result.lastInsertRowid))) });
  }
  if (method === 'POST' && route === 'auth/login') {
    const b = await body(req); const email = text(b.email, 'Email', 150).toLowerCase(); const user = one('SELECT * FROM users WHERE email=?', email); const [salt, expected] = (user?.password_hash || ':').split(':');
    const actual = crypto.scryptSync(String(b.password || '').slice(0, 200), salt || 'invalid', 64).toString('hex');
    if (!user || !crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) fail(401, 'Email or password is incorrect.');
    createSession(user.user_id, res); return json(res, 200, { user: safeUser(user) });
  }
  if (method === 'POST' && route === 'auth/logout') {
    const token = parseCookies(req.headers.cookie).sid; if (token) run('DELETE FROM sessions WHERE token_hash=?', digest(token)); cookie(res, '', 0); return json(res, 200, { ok: true });
  }
  if (method === 'GET' && route === 'auth/me') { const user = currentUser(req); return json(res, 200, { user: user ? safeUser(user) : null }); }
  const me = requireUser(req);
  if (method === 'GET' && route === 'users') {
    const search = `%${String(url.searchParams.get('q') || '').trim().slice(0, 100)}%`;
    const users = q(`SELECT u.user_id,u.full_name,u.major,u.faculty,u.bio,
      (SELECT COUNT(*) FROM follows f WHERE f.following_id=u.user_id) AS follower_count,
      EXISTS(SELECT 1 FROM follows f WHERE f.follower_id=? AND f.following_id=u.user_id) AS followed_by_me
      FROM users u WHERE u.user_id<>? AND (u.full_name LIKE ? OR u.major LIKE ? OR u.faculty LIKE ?) ORDER BY u.full_name LIMIT 30`, me.user_id, me.user_id, search, search, search);
    return json(res, 200, { users });
  }
  if (method === 'GET' && route === 'feed') {
    const rows = q(`SELECT p.post_id,p.user_id,p.content,p.created_at,p.updated_at,u.full_name,u.major,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.post_id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.post_id) AS comment_count
      FROM posts p JOIN users u USING(user_id)
      WHERE p.user_id=? OR p.user_id IN (SELECT following_id FROM follows WHERE follower_id=?)
      ORDER BY p.created_at DESC LIMIT 60`, me.user_id, me.user_id);
    return json(res, 200, { posts: rows.map(p => postShape(p, me.user_id)) });
  }
  if (method === 'GET' && route === 'posts') {
    const rows = q(`SELECT p.post_id,p.user_id,p.content,p.created_at,p.updated_at,u.full_name,u.major,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.post_id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.post_id) AS comment_count
      FROM posts p JOIN users u USING(user_id) ORDER BY p.created_at DESC LIMIT 60`);
    return json(res, 200, { posts: rows.map(p => postShape(p, me.user_id)) });
  }
  if (method === 'POST' && route === 'posts') {
    const b = await body(req); const content = validatePostContent(b.content);
    const result = run('INSERT INTO posts(user_id,content,created_at,updated_at) VALUES(?,?,?,?)', me.user_id, content, new Date().toISOString(), new Date().toISOString());
    return json(res, 201, { post_id: Number(result.lastInsertRowid) });
  }
  if (/^posts\/\d+$/.test(route) && method === 'PUT') {
    const id = Number(parts[1]); const post = one('SELECT user_id,created_at,updated_at FROM posts WHERE post_id=?', id);
    requirePostOwner(post, me.user_id, 'edit');
    const b = await body(req); const content = validatePostContent(b.content);
    const previousTime = Date.parse(post.updated_at || post.created_at);
    const updatedAt = new Date(Math.max(Date.now(), previousTime + 1)).toISOString();
    run('UPDATE posts SET content=?, updated_at=? WHERE post_id=?', content, updatedAt, id);
    return json(res, 200, { post_id: id, content, updated_at: updatedAt });
  }
  if (/^posts\/\d+$/.test(route) && method === 'DELETE') {
    const id = Number(parts[1]); const post = one('SELECT user_id FROM posts WHERE post_id=?', id); requirePostOwner(post, me.user_id, 'delete');
    transactional(() => run('DELETE FROM posts WHERE post_id=?', id)); return json(res, 200, { ok: true });
  }
  if (/^posts\/\d+\/likes$/.test(route) && method === 'POST') {
    const id = Number(parts[1]); if (!one('SELECT post_id FROM posts WHERE post_id=?', id)) fail(404, 'Post not found.');
    run('INSERT OR IGNORE INTO likes(post_id,user_id,created_at) VALUES(?,?,?)', id, me.user_id, new Date().toISOString()); return json(res, 200, { liked: true });
  }
  if (/^posts\/\d+\/likes$/.test(route) && method === 'DELETE') {
    run('DELETE FROM likes WHERE post_id=? AND user_id=?', Number(parts[1]), me.user_id); return json(res, 200, { liked: false });
  }
  if (/^posts\/\d+\/comments$/.test(route) && method === 'POST') {
    const id = Number(parts[1]); const b = await body(req); const content = text(b.content, 'Comment', 500); if (!one('SELECT post_id FROM posts WHERE post_id=?', id)) fail(404, 'Post not found.');
    run('INSERT INTO comments(post_id,user_id,content,created_at) VALUES(?,?,?,?)', id, me.user_id, content, new Date().toISOString()); return json(res, 201, { ok: true });
  }
  if (/^users\/\d+$/.test(route) && method === 'GET') {
    const id = Number(parts[1]); const user = one(`SELECT user_id,full_name,major,faculty,bio,created_at FROM users WHERE user_id=?`, id); if (!user) fail(404, 'Student not found.');
    const posts = q(`SELECT p.post_id,p.user_id,p.content,p.created_at,p.updated_at,u.full_name,u.major,(SELECT COUNT(*) FROM likes l WHERE l.post_id=p.post_id) AS like_count,(SELECT COUNT(*) FROM comments c WHERE c.post_id=p.post_id) AS comment_count FROM posts p JOIN users u USING(user_id) WHERE p.user_id=? ORDER BY p.created_at DESC LIMIT 30`, id).map(p => postShape(p, me.user_id));
    return json(res, 200, { user, posts, follower_count: one('SELECT COUNT(*) AS n FROM follows WHERE following_id=?', id).n, following_count: one('SELECT COUNT(*) AS n FROM follows WHERE follower_id=?', id).n, followed_by_me: !!one('SELECT 1 FROM follows WHERE follower_id=? AND following_id=?', me.user_id, id), is_me: id === me.user_id });
  }
  if (/^users\/\d+\/follow$/.test(route) && method === 'POST') {
    const id = Number(parts[1]); if (id === me.user_id) fail(400, 'You cannot follow yourself.'); if (!one('SELECT user_id FROM users WHERE user_id=?', id)) fail(404, 'Student not found.');
    run('INSERT OR IGNORE INTO follows(follower_id,following_id,created_at) VALUES(?,?,?)', me.user_id, id, new Date().toISOString()); return json(res, 200, { following: true });
  }
  if (/^users\/\d+\/follow$/.test(route) && method === 'DELETE') { run('DELETE FROM follows WHERE follower_id=? AND following_id=?', me.user_id, Number(parts[1])); return json(res, 200, { following: false }); }
  if (method === 'GET' && route === 'connections') {
    const followers = q('SELECT u.user_id,u.full_name,u.major FROM follows f JOIN users u ON u.user_id=f.follower_id WHERE f.following_id=? ORDER BY u.full_name', me.user_id);
    const following = q('SELECT u.user_id,u.full_name,u.major FROM follows f JOIN users u ON u.user_id=f.following_id WHERE f.follower_id=? ORDER BY u.full_name', me.user_id);
    return json(res, 200, { followers, following });
  }
  fail(404, 'That page or action was not found.');
}

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    const target = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
    const file = path.resolve(ROOT, target);
    if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return json(res, 404, { error: 'Not found.' });
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'" });
    fs.createReadStream(file).pipe(res);
  } catch (e) { json(res, e.status || 500, { error: e.status ? e.message : 'Something went wrong. Please try again.' }); }
});
server.listen(PORT, '127.0.0.1', () => console.log(`Student Social is ready at http://127.0.0.1:${PORT}`));
