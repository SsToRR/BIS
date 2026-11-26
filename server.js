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
const positiveSetting = (value, fallback, max) => {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= max ? number : fallback;
};
const SESSION_DAYS = positiveSetting(process.env.SESSION_DAYS, 30, 365);
const MAX_USERS = positiveSetting(process.env.MAX_USERS, 500, 1000000);
const MAX_BODY_LENGTH = 20_000;
const MAX_POST_IMAGE_BYTES = 1_400_000;
const MAX_POST_BODY_LENGTH = 2_000_000;
const POST_IMAGE_PATTERN = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/;
const POST_IMAGE_TYPE_ERROR = 'Choose a PNG, JPEG, or WebP image.';
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

function migrateSqlitePosts(schema) {
  const postSchema = () => db.prepare("SELECT sql FROM sqlite_schema WHERE type='table' AND name='posts'").get().sql;
  if (postSchema().includes('posts_content_or_photo')) return;
  // Keep dependent comments, likes, and bookmarks when replacing the posts table.
  db.exec('PRAGMA foreign_keys = OFF');
  try {
    db.exec('BEGIN IMMEDIATE');
    if (!postSchema().includes('posts_content_or_photo')) {
      const columns = db.prepare('PRAGMA table_info(posts)').all().map(column => column.name);
      const sequence = db.prepare("SELECT seq FROM sqlite_sequence WHERE name='posts'").get();
      const imageData = columns.includes('image_data') ? 'image_data' : "''";
      const imageAlt = columns.includes('image_alt') ? 'image_alt' : "''";
      db.exec(`
        CREATE TABLE posts_new (
          post_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          image_data TEXT NOT NULL DEFAULT '',
          image_alt TEXT NOT NULL DEFAULT '' CHECK(length(image_alt) <= 200),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          CONSTRAINT posts_content_or_photo CHECK(length(content) <= 2000 AND (content <> '' OR image_data <> ''))
        );
        INSERT INTO posts_new(post_id,user_id,content,image_data,image_alt,created_at,updated_at)
          SELECT post_id,user_id,content,${imageData},${imageAlt},created_at,updated_at FROM posts;
        DROP TABLE posts;
        ALTER TABLE posts_new RENAME TO posts;
      `);
      if (sequence) db.prepare("UPDATE sqlite_sequence SET seq=MAX(seq,?) WHERE name='posts'").run(sequence.seq);
      db.exec(schema);
      if (db.prepare('PRAGMA foreign_key_check').get()) throw new Error('Post migration failed its foreign key check.');
    }
    db.exec('COMMIT');
  } catch (error) {
    if (db.isTransaction) db.exec('ROLLBACK');
    throw error;
  } finally {
    db.exec('PRAGMA foreign_keys = ON');
  }
}

async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      if (usePostgres) {
        const schema = fs.readFileSync(path.join(ROOT, 'database', 'schema.postgres.sql'), 'utf8');
        for (const statement of schema.split(';').map((part) => part.trim()).filter(Boolean)) {
          await sql.query(statement, []);
        }
        await sql.query(`DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='posts'::regclass AND conname='posts_content_or_photo') THEN
              RETURN;
            END IF;
            LOCK TABLE posts IN ACCESS EXCLUSIVE MODE;
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='posts'::regclass AND conname='posts_content_or_photo') THEN
              ALTER TABLE posts
                ADD COLUMN IF NOT EXISTS image_data TEXT NOT NULL DEFAULT '',
                ADD COLUMN IF NOT EXISTS image_alt TEXT NOT NULL DEFAULT '' CHECK(length(image_alt) <= 200),
                DROP CONSTRAINT IF EXISTS posts_content_check,
                ADD CONSTRAINT posts_content_or_photo CHECK(length(content) <= 2000 AND (content <> '' OR image_data <> ''));
            END IF;
          END $$`, []);
        await sql.query('UPDATE users SET role=\'admin\' WHERE role<>\'admin\'', []);
        await sql.query(toPostgresSql('INSERT OR IGNORE INTO app_settings(setting_key,setting_value) VALUES(?,?)'), ['max_users', String(MAX_USERS)]);
      } else {
        db.exec('PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL;');
        const schema = fs.readFileSync(path.join(ROOT, 'database', 'schema.sql'), 'utf8');
        db.exec(schema);
        migrateSqlitePosts(schema);
        db.prepare("UPDATE users SET role='admin' WHERE role<>'admin'").run();
        db.prepare('INSERT OR IGNORE INTO app_settings(setting_key,setting_value) VALUES(?,?)').run('max_users', String(MAX_USERS));
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

async function body(req, { allowPostImage = false } = {}) {
  const mediaType = req.headers['content-type']?.split(';')[0].trim().toLowerCase();
  const maxLength = allowPostImage && mediaType === 'application/json' ? MAX_POST_BODY_LENGTH : MAX_BODY_LENGTH;
  let parsed = req.body;
  if (Buffer.isBuffer(parsed)) parsed = parsed.toString('utf8');
  let raw = '';
  if (parsed != null) {
    raw = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
    if (raw.length > maxLength) fail(413, 'Request is too large.');
  } else {
    req.setEncoding?.('utf8');
    for await (const part of req) {
      raw += part;
      if (raw.length > maxLength) fail(413, 'Request is too large.');
    }
  }
  try {
    if (parsed == null || typeof parsed === 'string') parsed = raw ? JSON.parse(raw) : {};
  } catch {
    if (raw.length > MAX_BODY_LENGTH) fail(413, 'Request is too large.');
    fail(400, 'Please send valid JSON.');
  }
  if (raw.length > MAX_BODY_LENGTH && !parsed?.image_data) fail(413, 'Request is too large.');
  return parsed && typeof parsed === 'object' ? parsed : {};
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

function validatePostImage(value) {
  if (value == null || value === '') return '';
  if (typeof value !== 'string') fail(400, POST_IMAGE_TYPE_ERROR);
  const sizeError = 'Photo must be 1.4 MB or smaller.';
  const match = POST_IMAGE_PATTERN.exec(value);
  if (!match || match[0] !== value) fail(400, POST_IMAGE_TYPE_ERROR);
  const [, type, encoded] = match;
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length > MAX_POST_IMAGE_BYTES) fail(413, sizeError);
  if (bytes.toString('base64') !== encoded) fail(400, POST_IMAGE_TYPE_ERROR);
  const isPng = type === 'image/png' && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isJpeg = type === 'image/jpeg' && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isWebp = type === 'image/webp' && bytes.toString('latin1', 0, 4) === 'RIFF' && bytes.toString('latin1', 8, 12) === 'WEBP';
  if (!isPng && !isJpeg && !isWebp) fail(400, 'The selected file does not match its image type.');
  return value;
}

async function currentMaxUsers() {
  const setting = await one('SELECT setting_value FROM app_settings WHERE setting_key=?', 'max_users');
  return positiveSetting(setting?.setting_value, MAX_USERS, 1000000);
}

function requireAdmin(user) {
  if (user.role !== 'admin') fail(403, 'Administrator access is required.');
}

function splitTranslationText(value, limit = 450) {
  const chunks = [];
  let chunk = '';
  const parts = String(value).match(/\S+\s*|\s+/gu) || [];
  for (const part of parts) {
    if (Buffer.byteLength(chunk + part, 'utf8') <= limit) { chunk += part; continue; }
    if (chunk) chunks.push(chunk);
    chunk = '';
    for (const character of part) {
      if (Buffer.byteLength(chunk + character, 'utf8') > limit && chunk) { chunks.push(chunk); chunk = ''; }
      chunk += character;
    }
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

async function translatePostContent(content, source, target) {
  const translated = [];
  const paragraphs = String(content).split(/(\r?\n)/u);
  for (const paragraph of paragraphs) {
    if (/^\r?\n$/u.test(paragraph)) {
      translated.push(paragraph);
      continue;
    }
    for (const chunk of splitTranslationText(paragraph)) {
      const url = new URL('https://api.mymemory.translated.net/get');
      url.searchParams.set('q', chunk);
      url.searchParams.set('langpair', `${source}|${target}`);
      let response;
      let data;
      try {
        response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
        data = await response.json().catch(() => null);
      } catch {}
      const details = String(data?.responseDetails || '');
      const limitReached = response?.status === 429 || Number(data?.responseStatus) === 429
        || /quota|too many requests|(?:usage|daily|rate).{0,40}(?:limit|exceed|reach)|(?:limit|exceed|reach).{0,40}(?:usage|daily|quota|rate)|(?:used|reach|exceed).{0,40}(?:free|daily|quota|limit)|free.{0,25}translations.{0,25}today|exceed(?:ed|ing)?.{0,30}(?:limit|guideline)/iu.test(details);
      if (limitReached) fail(429, 'The translation service has reached its usage limit. Please try again later.');
      if (!response?.ok || Number(data?.responseStatus) !== 200 || typeof data?.responseData?.translatedText !== 'string' || !data.responseData.translatedText.trim()) {
        fail(502, 'The translation service is unavailable. Please try again later.');
      }
      translated.push(data.responseData.translatedText);
    }
  }
  return translated.join('');
}

async function eventShape(row, viewerId) {
  const [countRow, mine, attendees] = await Promise.all([
    one('SELECT COUNT(*) AS count FROM event_rsvps WHERE event_id=?', row.event_id),
    one('SELECT rsvp_id FROM event_rsvps WHERE event_id=? AND user_id=?', row.event_id, viewerId),
    q('SELECT u.user_id,u.full_name FROM event_rsvps r JOIN users u ON u.user_id=r.user_id WHERE r.event_id=? ORDER BY r.rsvp_id LIMIT 4', row.event_id),
  ]);
  const total = Number(countRow.count);
  let position = 0;
  if (mine) {
    const ahead = await one('SELECT COUNT(*) AS count FROM event_rsvps WHERE event_id=? AND rsvp_id<=?', row.event_id, mine.rsvp_id);
    position = Number(ahead.count);
  }
  const capacity = Number(row.capacity);
  const myStatus = position ? position <= capacity ? 'attending' : 'waitlisted' : null;
  return {
    ...row,
    event_id: Number(row.event_id),
    user_id: Number(row.user_id),
    capacity,
    attendee_count: Math.min(total, capacity),
    waitlist_count: Math.max(total - capacity, 0),
    my_status: myStatus,
    my_waitlist_position: myStatus === 'waitlisted' ? position - capacity : null,
    attendees: attendees.filter((_, index) => index < capacity).map((user) => ({ ...user, user_id: Number(user.user_id) })),
  };
}

async function postShape(row, viewerId) {
  const [comments, liked, saved] = await Promise.all([
    q('SELECT c.comment_id,c.content,c.created_at,u.user_id,u.full_name,u.major FROM comments c JOIN users u USING(user_id) WHERE c.post_id=? ORDER BY c.created_at', row.post_id),
    one('SELECT 1 FROM likes WHERE post_id=? AND user_id=?', row.post_id, viewerId),
    one('SELECT 1 FROM bookmarks WHERE post_id=? AND user_id=?', row.post_id, viewerId),
  ]);
  return {
    ...row,
    post_id: Number(row.post_id),
    user_id: Number(row.user_id),
    has_image: Boolean(row.has_image),
    like_count: Number(row.like_count),
    comment_count: Number(row.comment_count),
    liked_by_me: !!liked,
    saved_by_me: !!saved,
    comments: comments.map((comment) => ({ ...comment, comment_id: Number(comment.comment_id), user_id: Number(comment.user_id) })),
  };
}

async function createSession(userId, res) {
  const token = crypto.randomBytes(32).toString('base64url');
  await run('INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)', digest(token), userId, new Date().toISOString(), new Date(Date.now() + SESSION_DAYS * 86400000).toISOString());
  cookie(res, token, SESSION_DAYS * 86400);
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

  if (method === 'GET' && route === 'meta') {
    return json(res, 200, { session_days: SESSION_DAYS, max_users: await currentMaxUsers() });
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
    const accountCount = await one('SELECT COUNT(*) AS count FROM users');
    const maxUsers = await currentMaxUsers();
    if (Number(accountCount.count) >= maxUsers) fail(409, `This campus has reached its ${maxUsers}-student account limit.`);
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    const inserted = await one('INSERT INTO users(full_name,email,password_hash,major,faculty,bio,role,created_at) VALUES(?,?,?,?,?,?,?,?) RETURNING user_id', name, email, `${salt}:${hash}`, major, text(b.faculty, 'Faculty', 100, { optional: true }), '', 'admin', new Date().toISOString());
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
  if (method === 'POST' && route === 'translate') {
    const b = await body(req);
    const postId = Number(b.post_id);
    if (!Number.isInteger(postId) || postId < 1) fail(400, 'Choose a valid post.');
    const post = await one('SELECT content FROM posts WHERE post_id=?', postId);
    if (!post) fail(404, 'Post not found.');
    if (!post.content) fail(400, 'This post has no text to translate.');
    const languages = ['en', 'kk', 'ru'];
    if (!languages.includes(b.source) || !languages.includes(b.target)) fail(400, 'Choose English, Kazakh, or Russian for translation.');
    if (b.source === b.target) fail(400, 'Choose a post language different from your interface language.');
    return json(res, 200, { translation: await translatePostContent(post.content, b.source, b.target) });
  }

  if (route === 'admin/settings' && method === 'GET') {
    requireAdmin(me);
    const [maxUsers, registered] = await Promise.all([
      currentMaxUsers(),
      one('SELECT COUNT(*) AS count FROM users'),
    ]);
    return json(res, 200, { max_users: maxUsers, registered_users: Number(registered.count) });
  }

  if (route === 'admin/settings' && method === 'PUT') {
    requireAdmin(me);
    const b = await body(req);
    const maxUsers = Number(b.max_users);
    if (!Number.isInteger(maxUsers) || maxUsers < 1 || maxUsers > 1000000) fail(400, 'Capacity must be a whole number from 1 to 1,000,000.');
    const registered = await one('SELECT COUNT(*) AS count FROM users');
    if (maxUsers < Number(registered.count)) fail(400, 'Capacity cannot be lower than the current number of student accounts.');
    await run('INSERT INTO app_settings(setting_key,setting_value) VALUES(?,?) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value', 'max_users', String(maxUsers));
    return json(res, 200, { max_users: maxUsers, registered_users: Number(registered.count) });
  }

  if (method === 'GET' && route === 'events') {
    const kind = url.searchParams.get('kind') || 'event';
    if (!['event', 'study'].includes(kind)) fail(400, 'Choose events or study sessions.');
    const rows = await q(`SELECT e.*,u.full_name AS host_name
      FROM events e JOIN users u ON u.user_id=e.user_id
      WHERE e.kind=? AND e.starts_at>=? ORDER BY e.starts_at LIMIT 60`, kind, new Date().toISOString());
    return json(res, 200, { events: await Promise.all(rows.map((row) => eventShape(row, me.user_id))) });
  }

  if (method === 'POST' && route === 'events') {
    const b = await body(req);
    const kind = b.kind === 'study' ? 'study' : b.kind === 'event' ? 'event' : null;
    if (!kind) fail(400, 'Choose an event or study session.');
    const title = text(b.title, 'Title', 100);
    const description = text(b.description, 'Description', 500, { optional: true });
    const location = text(b.location, 'Location', 160);
    const startDate = new Date(b.starts_at);
    if (!b.starts_at || Number.isNaN(startDate.getTime()) || startDate.getTime() <= Date.now()) fail(400, 'Choose a future date and time.');
    const capacity = Number(b.capacity);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 500) fail(400, 'Capacity must be a whole number from 1 to 500.');
    const createdAt = new Date().toISOString();
    const inserted = await one('INSERT INTO events(user_id,kind,title,description,location,starts_at,capacity,created_at) VALUES(?,?,?,?,?,?,?,?) RETURNING event_id', me.user_id, kind, title, description, location, startDate.toISOString(), capacity, createdAt);
    return json(res, 201, { event_id: Number(inserted.event_id) });
  }

  if (/^events\/\d+\/rsvp$/.test(route) && method === 'POST') {
    const id = Number(parts[1]);
    const event = await one('SELECT event_id,starts_at FROM events WHERE event_id=?', id);
    if (!event) fail(404, 'Event not found.');
    if (Date.parse(event.starts_at) <= Date.now()) fail(409, 'This session has already started.');
    await run('INSERT OR IGNORE INTO event_rsvps(event_id,user_id,created_at) VALUES(?,?,?)', id, me.user_id, new Date().toISOString());
    return json(res, 200, { event: await eventShape(await one('SELECT e.*,u.full_name AS host_name FROM events e JOIN users u ON u.user_id=e.user_id WHERE e.event_id=?', id), me.user_id) });
  }

  if (/^events\/\d+\/rsvp$/.test(route) && method === 'DELETE') {
    const id = Number(parts[1]);
    await run('DELETE FROM event_rsvps WHERE event_id=? AND user_id=?', id, me.user_id);
    return json(res, 200, { ok: true });
  }

  if (/^events\/\d+$/.test(route) && method === 'DELETE') {
    const id = Number(parts[1]);
    const event = await one('SELECT user_id FROM events WHERE event_id=?', id);
    if (!event) fail(404, 'Event not found.');
    if (Number(event.user_id) !== Number(me.user_id)) fail(403, 'Only the event host can cancel it.');
    await run('DELETE FROM events WHERE event_id=?', id);
    return json(res, 200, { ok: true });
  }
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
      (p.image_data <> '') AS has_image,p.image_alt,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.post_id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.post_id) AS comment_count
      FROM posts p JOIN users u USING(user_id)
      WHERE p.user_id=? OR p.user_id IN (SELECT following_id FROM follows WHERE follower_id=?)
      ORDER BY p.created_at DESC LIMIT 60`, me.user_id, me.user_id);
    return json(res, 200, { posts: await Promise.all(rows.map((post) => postShape(post, me.user_id))) });
  }

  if (method === 'GET' && route === 'bookmarks') {
    const rows = await q(`SELECT p.post_id,p.user_id,p.content,p.created_at,p.updated_at,u.full_name,u.major,
      (p.image_data <> '') AS has_image,p.image_alt,
      b.created_at AS saved_at,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.post_id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.post_id) AS comment_count
      FROM bookmarks b JOIN posts p USING(post_id) JOIN users u ON u.user_id=p.user_id
      WHERE b.user_id=? ORDER BY b.created_at DESC`, me.user_id);
    return json(res, 200, { posts: await Promise.all(rows.map((post) => postShape(post, me.user_id))) });
  }

  if (method === 'GET' && route === 'posts') {
    const rows = await q(`SELECT p.post_id,p.user_id,p.content,p.created_at,p.updated_at,u.full_name,u.major,
      (p.image_data <> '') AS has_image,p.image_alt,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.post_id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.post_id) AS comment_count
      FROM posts p JOIN users u USING(user_id) ORDER BY p.created_at DESC LIMIT 60`);
    return json(res, 200, { posts: await Promise.all(rows.map((post) => postShape(post, me.user_id))) });
  }

  if (method === 'POST' && route === 'posts') {
    const b = await body(req, { allowPostImage: true });
    const imageData = validatePostImage(b.image_data);
    const content = validatePostContent(b.content, Boolean(imageData));
    const imageAlt = imageData ? text(b.image_alt, 'Photo description', 200, { optional: true }) : '';
    const now = new Date().toISOString();
    const inserted = await one(`INSERT INTO posts(user_id,content,image_data,image_alt,created_at,updated_at)
      VALUES(?,?,?,?,?,?) RETURNING post_id`, me.user_id, content, imageData, imageAlt, now, now);
    return json(res, 201, { post_id: Number(inserted.post_id) });
  }

  if (/^posts\/\d+\/image$/.test(route) && method === 'GET') {
    const post = await one('SELECT image_data FROM posts WHERE post_id=?', Number(parts[1]));
    const match = POST_IMAGE_PATTERN.exec(post?.image_data || '');
    if (!match) fail(404, 'Post photo not found.');
    const image = Buffer.from(match[2], 'base64');
    res.setHeader('Content-Type', match[1]);
    res.setHeader('Content-Length', image.length);
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (typeof res.writeHead === 'function') {
      res.writeHead(200);
      res.end(image);
      return;
    }
    return res.status(200).send(image);
  }

  if (/^posts\/\d+$/.test(route) && method === 'PUT') {
    const id = Number(parts[1]);
    const post = await one("SELECT user_id,created_at,updated_at,(image_data <> '') AS has_image FROM posts WHERE post_id=?", id);
    requirePostOwner(post, me.user_id, 'edit');
    const b = await body(req, { allowPostImage: true });
    const changesPhoto = Object.hasOwn(b, 'image_data') || b.remove_image === true;
    const imageData = changesPhoto ? validatePostImage(b.image_data) : null;
    const content = validatePostContent(b.content, changesPhoto ? Boolean(imageData) : Boolean(post.has_image));
    const previousTime = Date.parse(post.updated_at || post.created_at);
    const updatedAt = new Date(Math.max(Date.now(), previousTime + 1)).toISOString();
    if (changesPhoto) {
      const imageAlt = imageData ? text(b.image_alt, 'Photo description', 200, { optional: true }) : '';
      await run('UPDATE posts SET content=?,image_data=?,image_alt=?,updated_at=? WHERE post_id=?', content, imageData, imageAlt, updatedAt, id);
    } else {
      const imageAlt = Object.hasOwn(b, 'image_alt') ? text(b.image_alt, 'Photo description', 200, { optional: true }) : null;
      const updated = await one(`UPDATE posts SET content=?,
        image_alt=CASE WHEN image_data <> '' THEN COALESCE(?,image_alt) ELSE '' END,updated_at=?
        WHERE post_id=? AND (? <> '' OR image_data <> '') RETURNING post_id`, content, imageAlt, updatedAt, id, content);
      if (!updated) fail(409, 'The post changed. Reopen it and try again.');
    }
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

  if (/^posts\/\d+\/bookmark$/.test(route) && method === 'POST') {
    const id = Number(parts[1]);
    if (!await one('SELECT post_id FROM posts WHERE post_id=?', id)) fail(404, 'Post not found.');
    await run('INSERT OR IGNORE INTO bookmarks(post_id,user_id,created_at) VALUES(?,?,?)', id, me.user_id, new Date().toISOString());
    return json(res, 200, { saved: true });
  }
  if (/^posts\/\d+\/bookmark$/.test(route) && method === 'DELETE') {
    await run('DELETE FROM bookmarks WHERE post_id=? AND user_id=?', Number(parts[1]), me.user_id);
    return json(res, 200, { saved: false });
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
      (p.image_data <> '') AS has_image,p.image_alt,
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
