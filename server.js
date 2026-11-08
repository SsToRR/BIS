const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { requirePostOwner, validatePostContent } = require('./post-rules');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const SECURE_COOKIE = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const DATABASE_URL = process.env.DATABASE_URL;
const DB_FILE = process.env.DB_FILE || path.join(ROOT, 'database', 'student-network.sqlite');
const usePostgres = Boolean(DATABASE_URL);
if (process.env.VERCEL === '1' && !usePostgres) {
  throw new Error('DATABASE_URL must be configured for Vercel deployments.');
}
let db = null;
let sql = null;
let schemaPromise = null;

if (usePostgres) {
  const { neon } = require('@neondatabase/serverless');
  sql = neon(DATABASE_URL);
} else {
  const { DatabaseSync } = require('node:sqlite');
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  db = new DatabaseSync(DB_FILE);
}

function toPostgresSql(statement) {
  let text = statement.trim();
  if (/^INSERT OR IGNORE INTO\b/i.test(text)) {
    text = text.replace(/^INSERT OR IGNORE INTO/i, 'INSERT INTO');
    text += ' ON CONFLICT DO NOTHING';
  }
  let index = 0;
  return text.replace(/\?/g, () => `$${++index}`);
}

async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      if (usePostgres) {
        const schema = fs.readFileSync(path.join(ROOT, 'database', 'schema.postgres.sql'), 'utf8');
        for (const statement of schema.split(';').map((part) => part.trim()).filter(Boolean)) {
          await sql.query(statement, []);
        }
      } else {
        db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
        db.exec(fs.readFileSync(path.join(ROOT, 'database', 'schema.sql'), 'utf8'));
      }
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
}

async function q(statement, ...args) {
  await ensureSchema();
  if (!usePostgres) return db.prepare(statement).all(...args);
  const result = await sql.query(toPostgresSql(statement), args);
  return Array.isArray(result) ? result : result.rows;
}

async function one(statement, ...args) {
  await ensureSchema();
  if (!usePostgres) return db.prepare(statement).get(...args);
  const result = await sql.query(toPostgresSql(statement), args);
  const rows = Array.isArray(result) ? result : result.rows;
  return rows[0];
}

async function run(statement, ...args) {
  await ensureSchema();
  if (!usePostgres) return db.prepare(statement).run(...args);
  const result = await sql.query(toPostgresSql(statement), args);
  return { changes: Array.isArray(result) ? result.length : result.rowCount || 0 };
}

const safeUser = (u) => ({ user_id: Number(u.user_id), full_name: u.full_name, email: u.email, major: u.major, faculty: u.faculty, bio: u.bio, role: u.role, created_at: u.created_at });
const digest = (token) => crypto.createHash('sha256').update(token).digest('hex');
const cookie = (res, value, maxAge) => res.setHeader('Set-Cookie', `sid=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${SECURE_COOKIE ? '; Secure' : ''}`);
const json = (res, status, value) => {
  const payload = JSON.stringify(value);
  if (typeof res.writeHead === 'function') {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(payload);
    return;
  }
  res.status(status).setHeader('Cache-Control', 'no-store').send(payload);
};

function fail(status, message) { const error = new Error(message); error.status = status; throw error; }
function parseCookies(header = '') { return Object.fromEntries(header.split(';').map((value) => value.trim().split('=').map(decodeURIComponent)).filter((value) => value.length === 2)); }

async function body(req) {
  if (req.body !== undefined && req.body !== null) {
    const parsed = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : req.body;
    const raw = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
    if (raw.length > 20_000) fail(413, 'Request is too large.');
    if (typeof parsed !== 'string') return parsed && typeof parsed === 'object' ? parsed : {};
    try { return raw ? JSON.parse(raw) : {}; } catch { fail(400, 'Please send valid JSON.'); }
  }

  let raw = '';
  for await (const part of req) {
    raw += part;
    if (raw.length > 20_000) fail(413, 'Request is too large.');
  }
  try { return raw ? JSON.parse(raw) : {}; } catch { fail(400, 'Please send valid JSON.'); }
}

async function currentUser(req) {
  const token = parseCookies(req.headers.cookie).sid;
  if (!token) return null;
  const session = await one('SELECT user_id FROM sessions WHERE token_hash = ? AND expires_at > ?', digest(token), new Date().toISOString());
  return session ? one('SELECT * FROM users WHERE user_id = ?', session.user_id) : null;
}

async function requireUser(req) {
  const user = await currentUser(req);
  if (!user) fail(401, 'Please log in to continue.');
  return user;
}

function text(value, field, max, { optional = false } = {}) {
  const result = String(value ?? '').trim();
  if (!result && optional) return '';
  if (!result || result.length > max) fail(400, `${field} must be between 1 and ${max} characters.`);
  return result;
}

async function postShape(row, viewerId) {
  const [comments, liked] = await Promise.all([
    q('SELECT c.comment_id,c.content,c.created_at,u.user_id,u.full_name,u.major FROM comments c JOIN users u USING(user_id) WHERE c.post_id=? ORDER BY c.created_at', row.post_id),
    one('SELECT 1 FROM likes WHERE post_id=? AND user_id=?', row.post_id, viewerId),
  ]);
  return {
    ...row,
    post_id: Number(row.post_id),
    user_id: Number(row.user_id),
    like_count: Number(row.like_count),
    comment_count: Number(row.comment_count),
    liked_by_me: !!liked,
    comments: comments.map((comment) => ({ ...comment, comment_id: Number(comment.comment_id), user_id: Number(comment.user_id) })),
  };
}

async function createSession(userId, res) {
  const token = crypto.randomBytes(32).toString('base64url');
  await run('INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)', digest(token), userId, new Date().toISOString(), new Date(Date.now() + 7 * 86400000).toISOString());
  cookie(res, token, 7 * 86400);
}

async function api(req, res, url) {
  const method = req.method;
  const apiPath = url.pathname.replace(/^\/api(?:\/|$)/, '/');
  const parts = apiPath.split('/').filter(Boolean);
  const route = parts.join('/');
  if (method === 'GET' && route === 'health') {
    await one('SELECT 1 AS ok');
    return json(res, 200, { ok: true });
  }

  if (method === 'POST' && route === 'auth/register') {
    const b = await body(req);
    const name = text(b.full_name, 'Name', 100);
    const email = text(b.email, 'Email', 150).toLowerCase();
    const major = text(b.major, 'Major', 100);
    const password = text(b.password, 'Password', 200);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'Enter a valid email address.');
    if (password.length < 8) fail(400, 'Use a password with at least 8 characters.');
    if (await one('SELECT user_id FROM users WHERE email=?', email)) fail(409, 'That email is already registered.');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    const inserted = await one('INSERT INTO users(full_name,email,password_hash,major,faculty,bio,role,created_at) VALUES(?,?,?,?,?,?,?,?) RETURNING user_id', name, email, `${salt}:${hash}`, major, text(b.faculty, 'Faculty', 100, { optional: true }), '', 'student', new Date().toISOString());
    const userId = Number(inserted.user_id);
    await createSession(userId, res);
    return json(res, 201, { user: safeUser(await one('SELECT * FROM users WHERE user_id=?', userId)) });
  }

  if (method === 'POST' && route === 'auth/login') {
    const b = await body(req);
    const email = text(b.email, 'Email', 150).toLowerCase();
    const user = await one('SELECT * FROM users WHERE email=?', email);
    const [salt, expected] = (user?.password_hash || ':').split(':');
    const actual = crypto.scryptSync(String(b.password || '').slice(0, 200), salt || 'invalid', 64).toString('hex');
    if (!user || !crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) fail(401, 'Email or password is incorrect.');
    await createSession(user.user_id, res);
    return json(res, 200, { user: safeUser(user) });
  }

  if (method === 'POST' && route === 'auth/logout') {
    const token = parseCookies(req.headers.cookie).sid;
    if (token) await run('DELETE FROM sessions WHERE token_hash=?', digest(token));
    cookie(res, '', 0);
    return json(res, 200, { ok: true });
  }
  if (method === 'GET' && route === 'auth/me') {
    const user = await currentUser(req);
    return json(res, 200, { user: user ? safeUser(user) : null });
  }

  const me = await requireUser(req);
  if (method === 'GET' && route === 'users') {
    const search = `%${String(url.searchParams.get('q') || '').trim().slice(0, 100)}%`;
    const users = await q(`SELECT u.user_id,u.full_name,u.major,u.faculty,u.bio,
      (SELECT COUNT(*) FROM follows f WHERE f.following_id=u.user_id) AS follower_count,
      EXISTS(SELECT 1 FROM follows f WHERE f.follower_id=? AND f.following_id=u.user_id) AS followed_by_me
      FROM users u WHERE u.user_id<>? AND (u.full_name LIKE ? OR u.major LIKE ? OR u.faculty LIKE ?) ORDER BY u.full_name LIMIT 30`, me.user_id, me.user_id, search, search, search);
    return json(res, 200, { users: users.map((user) => ({ ...user, user_id: Number(user.user_id), follower_count: Number(user.follower_count) })) });
  }

  if (method === 'GET' && route === 'feed') {
    const rows = await q(`SELECT p.post_id,p.user_id,p.content,p.created_at,p.updated_at,u.full_name,u.major,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.post_id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.post_id) AS comment_count
      FROM posts p JOIN users u USING(user_id)
      WHERE p.user_id=? OR p.user_id IN (SELECT following_id FROM follows WHERE follower_id=?)
      ORDER BY p.created_at DESC LIMIT 60`, me.user_id, me.user_id);
    return json(res, 200, { posts: await Promise.all(rows.map((post) => postShape(post, me.user_id))) });
  }

  if (method === 'GET' && route === 'posts') {
    const rows = await q(`SELECT p.post_id,p.user_id,p.content,p.created_at,p.updated_at,u.full_name,u.major,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.post_id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.post_id) AS comment_count
      FROM posts p JOIN users u USING(user_id) ORDER BY p.created_at DESC LIMIT 60`);
    return json(res, 200, { posts: await Promise.all(rows.map((post) => postShape(post, me.user_id))) });
  }

  if (method === 'POST' && route === 'posts') {
    const b = await body(req);
    const content = validatePostContent(b.content);
    const inserted = await one('INSERT INTO posts(user_id,content,created_at,updated_at) VALUES(?,?,?,?) RETURNING post_id', me.user_id, content, new Date().toISOString(), new Date().toISOString());
    return json(res, 201, { post_id: Number(inserted.post_id) });
  }

  if (/^posts\/\d+$/.test(route) && method === 'PUT') {
    const id = Number(parts[1]);
    const post = await one('SELECT user_id,created_at,updated_at FROM posts WHERE post_id=?', id);
    requirePostOwner(post, me.user_id, 'edit');
    const b = await body(req);
    const content = validatePostContent(b.content);
    const previousTime = Date.parse(post.updated_at || post.created_at);
    const updatedAt = new Date(Math.max(Date.now(), previousTime + 1)).toISOString();
    await run('UPDATE posts SET content=?, updated_at=? WHERE post_id=?', content, updatedAt, id);
    return json(res, 200, { post_id: id, content, updated_at: updatedAt });
  }

  if (/^posts\/\d+$/.test(route) && method === 'DELETE') {
    const id = Number(parts[1]);
    const post = await one('SELECT user_id FROM posts WHERE post_id=?', id);
    requirePostOwner(post, me.user_id, 'delete');
    await run('DELETE FROM posts WHERE post_id=?', id);
    return json(res, 200, { ok: true });
  }

  if (/^posts\/\d+\/likes$/.test(route) && method === 'POST') {
    const id = Number(parts[1]);
    if (!await one('SELECT post_id FROM posts WHERE post_id=?', id)) fail(404, 'Post not found.');
    await run('INSERT OR IGNORE INTO likes(post_id,user_id,created_at) VALUES(?,?,?)', id, me.user_id, new Date().toISOString());
    return json(res, 200, { liked: true });
  }
  if (/^posts\/\d+\/likes$/.test(route) && method === 'DELETE') {
    await run('DELETE FROM likes WHERE post_id=? AND user_id=?', Number(parts[1]), me.user_id);
    return json(res, 200, { liked: false });
  }

  if (/^posts\/\d+\/comments$/.test(route) && method === 'POST') {
    const id = Number(parts[1]);
    const b = await body(req);
    const content = text(b.content, 'Comment', 500);
    if (!await one('SELECT post_id FROM posts WHERE post_id=?', id)) fail(404, 'Post not found.');
    await run('INSERT INTO comments(post_id,user_id,content,created_at) VALUES(?,?,?,?)', id, me.user_id, content, new Date().toISOString());
    return json(res, 201, { ok: true });
  }

  if (/^users\/\d+$/.test(route) && method === 'GET') {
    const id = Number(parts[1]);
    const user = await one('SELECT user_id,full_name,major,faculty,bio,created_at FROM users WHERE user_id=?', id);
    if (!user) fail(404, 'Student not found.');
    const rows = await q(`SELECT p.post_id,p.user_id,p.content,p.created_at,p.updated_at,u.full_name,u.major,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.post_id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.post_id) AS comment_count
      FROM posts p JOIN users u USING(user_id) WHERE p.user_id=? ORDER BY p.created_at DESC LIMIT 30`, id);
    const [followers, following, followed] = await Promise.all([
      one('SELECT COUNT(*) AS n FROM follows WHERE following_id=?', id),
      one('SELECT COUNT(*) AS n FROM follows WHERE follower_id=?', id),
      one('SELECT 1 FROM follows WHERE follower_id=? AND following_id=?', me.user_id, id),
    ]);
    return json(res, 200, {
      user: { ...user, user_id: Number(user.user_id) },
      posts: await Promise.all(rows.map((post) => postShape(post, me.user_id))),
      follower_count: Number(followers.n),
      following_count: Number(following.n),
      followed_by_me: !!followed,
      is_me: id === me.user_id,
    });
  }

  if (/^users\/\d+\/follow$/.test(route) && method === 'POST') {
    const id = Number(parts[1]);
    if (id === me.user_id) fail(400, 'You cannot follow yourself.');
    if (!await one('SELECT user_id FROM users WHERE user_id=?', id)) fail(404, 'Student not found.');
    await run('INSERT OR IGNORE INTO follows(follower_id,following_id,created_at) VALUES(?,?,?)', me.user_id, id, new Date().toISOString());
    return json(res, 200, { following: true });
  }
  if (/^users\/\d+\/follow$/.test(route) && method === 'DELETE') {
    await run('DELETE FROM follows WHERE follower_id=? AND following_id=?', me.user_id, Number(parts[1]));
    return json(res, 200, { following: false });
  }

  if (method === 'GET' && route === 'connections') {
    const [followers, following] = await Promise.all([
      q('SELECT u.user_id,u.full_name,u.major FROM follows f JOIN users u ON u.user_id=f.follower_id WHERE f.following_id=? ORDER BY u.full_name', me.user_id),
      q('SELECT u.user_id,u.full_name,u.major FROM follows f JOIN users u ON u.user_id=f.following_id WHERE f.follower_id=? ORDER BY u.full_name', me.user_id),
    ]);
    return json(res, 200, { followers, following });
  }
  fail(404, 'That page or action was not found.');
}

async function handleApi(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    await api(req, res, url);
  } catch (error) {
    json(res, error.status || 500, { error: error.status ? error.message : 'Something went wrong. Please try again.' });
  }
}

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) return handleApi(req, res);
  try {
    const target = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
    const file = path.resolve(ROOT, target);
    if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return json(res, 404, { error: 'Not found.' });
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'" });
    fs.createReadStream(file).pipe(res);
  } catch {
    json(res, 500, { error: 'Something went wrong. Please try again.' });
  }
});

if (require.main === module) {
  ensureSchema().then(() => {
    server.listen(PORT, '127.0.0.1', () => console.log(`Student Social is ready at http://127.0.0.1:${PORT}`));
  }).catch((error) => {
    console.error('Could not initialize the database.', error.message);
    process.exitCode = 1;
  });
}

module.exports = { handleApi, ensureSchema, server };
