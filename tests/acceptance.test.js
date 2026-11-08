const { after, before, beforeEach, test } = require('node:test');
const assert = require('node:assert/strict');
const { createHash, randomBytes, scryptSync } = require('node:crypto');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const passphrase = 'AcceptancePass2026!';
const fixtureSalt = randomBytes(16).toString('hex');
const fixtureHash = scryptSync(passphrase, fixtureSalt, 64).toString('hex');
const ownerToken = 'acceptance-owner-session';
const otherToken = 'acceptance-other-session';
let tempDir;
let dbFile;
let port;
let baseUrl;
let serverProcess;
let fixture;

function connect() {
  return new DatabaseSync(dbFile);
}

function addUser(db, { name, email, major = 'Information Systems', faculty = 'School of Business', bio = 'Test profile.' }) {
  const result = db.prepare(`INSERT INTO users(full_name,email,password_hash,major,faculty,bio,role,created_at)
    VALUES(?,?,?,?,?,?,?,?)`).run(name, email, `${fixtureSalt}:${fixtureHash}`, major, faculty, bio, 'student', new Date().toISOString());
  return Number(result.lastInsertRowid);
}

function addSession(db, userId, token) {
  const tokenHash = createHash('sha256').update(token).digest('hex');
  db.prepare('INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)')
    .run(tokenHash, userId, new Date().toISOString(), '2099-01-01T00:00:00.000Z');
}

function addPost(db, userId, content, createdAt = '2025-01-01T00:00:00.000Z') {
  const result = db.prepare('INSERT INTO posts(user_id,content,created_at,updated_at) VALUES(?,?,?,?)')
    .run(userId, content, createdAt, createdAt);
  return Number(result.lastInsertRowid);
}

function addFollow(db, followerId, followingId) {
  db.prepare('INSERT OR IGNORE INTO follows(follower_id,following_id,created_at) VALUES(?,?,?)')
    .run(followerId, followingId, new Date().toISOString());
}

function resetDatabase() {
  const db = connect();
  try {
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec('DELETE FROM users; DELETE FROM sqlite_sequence;');
    const ownerId = addUser(db, { name: 'Casey Morgan', email: 'casey@student.local', major: 'Computer Science' });
    const otherId = addUser(db, { name: 'Jordan Lee', email: 'jordan@student.local', major: 'Computer Science', faculty: 'School of Engineering' });
    const thirdId = addUser(db, { name: 'Taylor Brooks', email: 'taylor@student.local', major: 'Finance' });
    addSession(db, ownerId, ownerToken);
    addSession(db, otherId, otherToken);
    fixture = {
      ownerId,
      otherId,
      thirdId,
      ownerPostId: addPost(db, ownerId, 'Casey original post', '2025-01-01T00:00:00.000Z'),
      otherPostId: addPost(db, otherId, 'Jordan original post', '2025-01-02T00:00:00.000Z'),
      thirdPostId: addPost(db, thirdId, 'Taylor original post', '2025-01-03T00:00:00.000Z')
    };
  } finally {
    db.close();
  }
}

async function freePort() {
  const probe = net.createServer();
  await new Promise((resolve, reject) => {
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', resolve);
  });
  const assigned = probe.address().port;
  await new Promise((resolve, reject) => probe.close(error => error ? reject(error) : resolve()));
  return assigned;
}

async function startServer() {
  serverProcess = spawn(process.execPath, [path.join(root, 'server.js')], {
    cwd: root,
    env: { ...process.env, PORT: String(port), DB_FILE: dbFile, NODE_ENV: 'test' },
    stdio: 'ignore'
  });
  for (let attempt = 0; attempt < 60; attempt++) {
    if (serverProcess.exitCode !== null) throw new Error(`Test server exited with code ${serverProcess.exitCode}.`);
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error('Test server did not become ready.');
}

async function stopServer() {
  if (!serverProcess || serverProcess.exitCode !== null) return;
  const exited = once(serverProcess, 'exit');
  serverProcess.kill('SIGTERM');
  await exited;
}

async function restartServer() {
  await stopServer();
  await startServer();
}

async function request(pathname, { method = 'GET', token = ownerToken, body, rawBody, headers = {} } = {}) {
  const requestHeaders = { ...headers };
  if (token) requestHeaders.Cookie = `sid=${token}`;
  if (body !== undefined || rawBody !== undefined) requestHeaders['Content-Type'] ||= 'application/json';
  const payload = rawBody !== undefined ? rawBody : body === undefined ? undefined : JSON.stringify(body);
  return fetch(`${baseUrl}/api/${pathname}`, { method, headers: requestHeaders, body: payload });
}

function query(sql, ...args) {
  const db = connect();
  try {
    return db.prepare(sql).all(...args);
  } finally {
    db.close();
  }
}

function one(sql, ...args) {
  const db = connect();
  try {
    return db.prepare(sql).get(...args);
  } finally {
    db.close();
  }
}

before(async () => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bis-acceptance-'));
  dbFile = path.join(tempDir, 'acceptance.sqlite');
  const db = new DatabaseSync(dbFile);
  try {
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(fs.readFileSync(path.join(root, 'database/schema.sql'), 'utf8'));
  } finally {
    db.close();
  }
  resetDatabase();
  port = await freePort();
  baseUrl = `http://127.0.0.1:${port}`;
  await startServer();
});

beforeEach(resetDatabase);

after(async () => {
  await stopServer();
  if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
});

test('AC-01 registration creates a student account', async () => {
  const response = await request('auth/register', { method: 'POST', token: null, body: { full_name: 'Avery Student', email: 'avery@example.test', major: 'Design', password: passphrase } });
  const data = await response.json();
  assert.equal(response.status, 201);
  assert.equal(data.user.role, 'student');
  assert.ok(one('SELECT user_id FROM users WHERE email=?', 'avery@example.test'));
});

test('AC-02 registration rejects an invalid email', async () => {
  const response = await request('auth/register', { method: 'POST', token: null, body: { full_name: 'Avery Student', email: 'abc@', major: 'Design', password: passphrase } });
  assert.equal(response.status, 400);
  assert.equal(one('SELECT COUNT(*) AS n FROM users WHERE email=?', 'abc@').n, 0);
});

test('AC-03 registration rejects a password shorter than eight characters', async () => {
  const response = await request('auth/register', { method: 'POST', token: null, body: { full_name: 'Avery Student', email: 'avery@example.test', major: 'Design', password: 'short7!' } });
  assert.equal(response.status, 400);
  assert.equal(one('SELECT COUNT(*) AS n FROM users WHERE email=?', 'avery@example.test').n, 0);
});

test('AC-04 duplicate email detection ignores letter case', async () => {
  const response = await request('auth/register', { method: 'POST', token: null, body: { full_name: 'Duplicate', email: 'CASEY@STUDENT.LOCAL', major: 'Design', password: passphrase } });
  const data = await response.json();
  assert.equal(response.status, 409);
  assert.match(data.error, /already registered/i);
  assert.equal(one('SELECT COUNT(*) AS n FROM users WHERE lower(email)=?', 'casey@student.local').n, 1);
});

test('AC-05 login sets an HttpOnly seven-day session cookie', async () => {
  const before = Date.now();
  const response = await request('auth/login', { method: 'POST', token: null, body: { email: 'casey@student.local', password: passphrase } });
  const cookie = response.headers.get('set-cookie') || '';
  assert.equal(response.status, 200);
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=Lax/i);
  assert.match(cookie, /Max-Age=604800/);
  const session = one('SELECT created_at,expires_at FROM sessions WHERE user_id=? ORDER BY session_id DESC LIMIT 1', fixture.ownerId);
  const duration = Date.parse(session.expires_at) - Date.parse(session.created_at);
  assert.ok(duration >= 7 * 86400000 - 1000 && duration <= 7 * 86400000 + 1000);
  assert.ok(Date.parse(session.created_at) >= before - 1000);
});

test('AC-06 wrong password and unknown email return the same 401 error', async () => {
  const wrong = await request('auth/login', { method: 'POST', token: null, body: { email: 'casey@student.local', password: 'wrong password' } });
  const unknown = await request('auth/login', { method: 'POST', token: null, body: { email: 'unknown@example.test', password: 'wrong password' } });
  assert.equal(wrong.status, 401);
  assert.equal(unknown.status, 401);
  assert.equal((await wrong.json()).error, (await unknown.json()).error);
  assert.equal(wrong.headers.get('set-cookie'), null);
  assert.equal(unknown.headers.get('set-cookie'), null);
});

test('AC-07 logout removes the session and the old cookie no longer authorizes requests', async () => {
  const tokenHash = createHash('sha256').update(ownerToken).digest('hex');
  const response = await request('auth/logout', { method: 'POST' });
  assert.equal(response.status, 200);
  assert.equal(one('SELECT session_id FROM sessions WHERE token_hash=?', tokenHash), undefined);
  assert.equal((await request('users', { token: ownerToken })).status, 401);
});

test('AC-08 passwords use salted scrypt hashes and sessions store token hashes', async () => {
  const response = await request('auth/register', { method: 'POST', token: null, body: { full_name: 'Avery Student', email: 'avery@example.test', major: 'Design', password: passphrase } });
  assert.equal(response.status, 201);
  const user = one('SELECT user_id,password_hash FROM users WHERE email=?', 'avery@example.test');
  const [salt, hash] = user.password_hash.split(':');
  assert.ok(salt.length >= 16);
  assert.equal(hash.length, 128);
  assert.notEqual(user.password_hash, passphrase);
  const cookie = response.headers.get('set-cookie') || '';
  const token = cookie.match(/^sid=([^;]+)/)?.[1];
  assert.ok(token);
  const stored = one('SELECT token_hash FROM sessions WHERE user_id=?', user.user_id).token_hash;
  assert.equal(stored, createHash('sha256').update(token).digest('hex'));
  assert.notEqual(stored, token);
});

test('AC-09 profile shows profile data, relationship counts, and newest posts first', async () => {
  const db = connect();
  let newestId;
  try {
    addFollow(db, fixture.ownerId, fixture.otherId);
    addFollow(db, fixture.thirdId, fixture.otherId);
    addFollow(db, fixture.otherId, fixture.thirdId);
    addPost(db, fixture.otherId, 'Older Jordan post', '2025-02-01T00:00:00.000Z');
    newestId = addPost(db, fixture.otherId, 'Newer Jordan post', '2025-02-02T00:00:00.000Z');
    db.prepare('UPDATE users SET bio=? WHERE user_id=?').run('Profile bio', fixture.otherId);
  } finally {
    db.close();
  }
  const response = await request(`users/${fixture.otherId}`);
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.user.full_name, 'Jordan Lee');
  assert.equal(data.user.major, 'Computer Science');
  assert.equal(data.user.bio, 'Profile bio');
  assert.equal(data.follower_count, 2);
  assert.equal(data.following_count, 1);
  assert.equal(data.posts[0].post_id, newestId);
});

test('AC-10 search matches name, major, or faculty, excludes self, sorts, and caps at 30', async () => {
  const db = connect();
  try {
    for (let i = 0; i < 31; i++) {
      addUser(db, { name: `CS Student ${String(i).padStart(2, '0')}`, email: `cs${i}@example.test`, major: 'Computer Science', faculty: 'Engineering' });
    }
    addUser(db, { name: 'Faculty Match', email: 'faculty@example.test', major: 'Art', faculty: 'Computer Science Faculty' });
    addUser(db, { name: 'Name Match Computer Science', email: 'name@example.test', major: 'Art', faculty: 'Arts' });
  } finally {
    db.close();
  }
  const response = await request('users?q=Computer%20Science');
  const { users } = await response.json();
  const names = users.map(user => user.full_name);
  assert.equal(response.status, 200);
  assert.equal(users.length, 30);
  assert.ok(users.every(user => user.user_id !== fixture.ownerId));
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
  assert.ok(users.some(user => user.major === 'Computer Science'));
});

test('AC-11 posts with one and 2000 characters are saved and returned in the feed', async () => {
  const shortResponse = await request('posts', { method: 'POST', body: { content: 'x' } });
  const longResponse = await request('posts', { method: 'POST', body: { content: 'x'.repeat(2000) } });
  assert.equal(shortResponse.status, 201);
  assert.equal(longResponse.status, 201);
  const feed = await (await request('feed')).json();
  assert.ok(feed.posts.some(post => post.content === 'x'));
  assert.ok(feed.posts.some(post => post.content.length === 2000));
});

test('AC-12 empty and over-2000-character posts are rejected without saving', async () => {
  const before = one('SELECT COUNT(*) AS n FROM posts').n;
  const empty = await request('posts', { method: 'POST', body: { content: '   ' } });
  const long = await request('posts', { method: 'POST', body: { content: 'x'.repeat(2001) } });
  assert.equal(empty.status, 400);
  assert.equal(long.status, 400);
  assert.equal(one('SELECT COUNT(*) AS n FROM posts').n, before);
});

test('AC-13 a user can delete their post but receives 403 for another user and 404 for a missing post', async () => {
  assert.equal((await request(`posts/${fixture.ownerPostId}`, { method: 'DELETE' })).status, 200);
  assert.equal((await request(`posts/${fixture.otherPostId}`, { method: 'DELETE' })).status, 403);
  assert.equal((await request('posts/999999', { method: 'DELETE' })).status, 404);
  assert.ok(one('SELECT post_id FROM posts WHERE post_id=?', fixture.otherPostId));
});

test('AC-14 feed includes only own and followed posts, newest first, up to 60', async () => {
  const db = connect();
  try {
    addFollow(db, fixture.ownerId, fixture.thirdId);
    for (let i = 0; i < 62; i++) addPost(db, fixture.thirdId, `Third post ${i}`, new Date(Date.UTC(2025, 1, 1, 0, 0, i)).toISOString());
  } finally {
    db.close();
  }
  const response = await request('feed');
  const { posts } = await response.json();
  assert.equal(response.status, 200);
  assert.equal(posts.length, 60);
  assert.ok(posts.every(post => post.user_id === fixture.ownerId || post.user_id === fixture.thirdId));
  assert.deepEqual(posts.map(post => post.created_at), [...posts].map(post => post.created_at).sort().reverse());
});

test('AC-15 a comment is saved and increments the post comment count', async () => {
  const response = await request(`posts/${fixture.otherPostId}/comments`, { method: 'POST', body: { content: 'Helpful comment' } });
  const posts = await (await request('posts')).json();
  const post = posts.posts.find(item => item.post_id === fixture.otherPostId);
  assert.equal(response.status, 201);
  assert.equal(post.comment_count, 1);
  assert.equal(post.comments[0].content, 'Helpful comment');
});

test('AC-16 empty, over-500-character, and missing-post comments are rejected', async () => {
  assert.equal((await request(`posts/${fixture.otherPostId}/comments`, { method: 'POST', body: { content: '   ' } })).status, 400);
  assert.equal((await request(`posts/${fixture.otherPostId}/comments`, { method: 'POST', body: { content: 'x'.repeat(501) } })).status, 400);
  assert.equal((await request('posts/999999/comments', { method: 'POST', body: { content: 'Valid comment' } })).status, 404);
  assert.equal(one('SELECT COUNT(*) AS n FROM comments').n, 0);
});

test('AC-17 liking a post twice creates one like and increases count once', async () => {
  assert.equal((await request(`posts/${fixture.otherPostId}/likes`, { method: 'POST' })).status, 200);
  await request(`posts/${fixture.otherPostId}/likes`, { method: 'POST' });
  const data = await (await request('posts')).json();
  assert.equal(one('SELECT COUNT(*) AS n FROM likes WHERE post_id=? AND user_id=?', fixture.otherPostId, fixture.ownerId).n, 1);
  assert.equal(data.posts.find(post => post.post_id === fixture.otherPostId).like_count, 1);
});

test('AC-18 unlike removes one like and lowers the count', async () => {
  await request(`posts/${fixture.otherPostId}/likes`, { method: 'POST' });
  assert.equal((await request(`posts/${fixture.otherPostId}/likes`, { method: 'DELETE' })).status, 200);
  assert.equal(one('SELECT COUNT(*) AS n FROM likes WHERE post_id=? AND user_id=?', fixture.otherPostId, fixture.ownerId).n, 0);
});

test('AC-19 following a student adds them to connections and the feed', async () => {
  assert.equal((await request(`users/${fixture.otherId}/follow`, { method: 'POST' })).status, 200);
  const connections = await (await request('connections')).json();
  const feed = await (await request('feed')).json();
  assert.ok(connections.following.some(user => user.user_id === fixture.otherId));
  assert.ok(feed.posts.some(post => post.user_id === fixture.otherId));
});

test('AC-20 following yourself is rejected with 400', async () => {
  const response = await request(`users/${fixture.ownerId}/follow`, { method: 'POST' });
  assert.equal(response.status, 400);
  assert.equal(one('SELECT COUNT(*) AS n FROM follows WHERE follower_id=? AND following_id=?', fixture.ownerId, fixture.ownerId).n, 0);
});

test('AC-21 repeated follow requests leave only one follow record', async () => {
  await request(`users/${fixture.otherId}/follow`, { method: 'POST' });
  await request(`users/${fixture.otherId}/follow`, { method: 'POST' });
  assert.equal(one('SELECT COUNT(*) AS n FROM follows WHERE follower_id=? AND following_id=?', fixture.ownerId, fixture.otherId).n, 1);
});

test('AC-22 unfollow removes the connection and the followed student’s posts from the feed', async () => {
  await request(`users/${fixture.otherId}/follow`, { method: 'POST' });
  assert.equal((await request(`users/${fixture.otherId}/follow`, { method: 'DELETE' })).status, 200);
  const connections = await (await request('connections')).json();
  const feed = await (await request('feed')).json();
  assert.ok(!connections.following.some(user => user.user_id === fixture.otherId));
  assert.ok(!feed.posts.some(post => post.user_id === fixture.otherId));
});

test('AC-23 posts, comments, likes, follows, and sessions persist after server restart', async () => {
  const created = await request('posts', { method: 'POST', body: { content: 'Persistent post' } });
  const createdId = (await created.json()).post_id;
  await request(`posts/${createdId}/comments`, { method: 'POST', body: { content: 'Persistent comment' } });
  await request(`posts/${fixture.otherPostId}/likes`, { method: 'POST' });
  await request(`users/${fixture.thirdId}/follow`, { method: 'POST' });
  await restartServer();
  const feed = await (await request('feed')).json();
  const posts = await (await request('posts')).json();
  const connections = await (await request('connections')).json();
  assert.ok(feed.posts.some(post => post.post_id === createdId));
  assert.equal(posts.posts.find(post => post.post_id === createdId).comments[0].content, 'Persistent comment');
  assert.ok(posts.posts.find(post => post.post_id === fixture.otherPostId).liked_by_me);
  assert.ok(connections.following.some(user => user.user_id === fixture.thirdId));
});

test('AC-24 deleting a post cascades to its comments and likes', async () => {
  const db = connect();
  try {
    db.prepare('INSERT INTO comments(post_id,user_id,content,created_at) VALUES(?,?,?,?)').run(fixture.ownerPostId, fixture.otherId, 'Cascade comment', new Date().toISOString());
    db.prepare('INSERT INTO likes(post_id,user_id,created_at) VALUES(?,?,?)').run(fixture.ownerPostId, fixture.otherId, new Date().toISOString());
  } finally {
    db.close();
  }
  assert.equal((await request(`posts/${fixture.ownerPostId}`, { method: 'DELETE' })).status, 200);
  assert.equal(one('SELECT COUNT(*) AS n FROM comments WHERE post_id=?', fixture.ownerPostId).n, 0);
  assert.equal(one('SELECT COUNT(*) AS n FROM likes WHERE post_id=?', fixture.ownerPostId).n, 0);
});

test('AC-25 feed, posts, search, profiles, and follow actions require a session', async () => {
  const responses = await Promise.all([
    request('feed', { token: null }),
    request('posts', { token: null }),
    request('users?q=Computer%20Science', { token: null }),
    request(`users/${fixture.otherId}`, { token: null }),
    request(`users/${fixture.otherId}/follow`, { method: 'POST', token: null }),
    request('connections', { token: null })
  ]);
  assert.ok(responses.every(response => response.status === 401));
});

test('AC-26 SQL injection strings are treated as plain text', async () => {
  const injection = "' OR 1=1 --";
  const search = await request(`users?q=${encodeURIComponent(injection)}`);
  const login = await request('auth/login', { method: 'POST', token: null, body: { email: injection, password: passphrase } });
  const post = await request('posts', { method: 'POST', body: { content: injection } });
  assert.deepEqual((await search.json()).users, []);
  assert.equal(login.status, 401);
  assert.equal(post.status, 201);
  assert.ok(one('SELECT post_id FROM posts WHERE content=?', injection));
});

test('AC-27 malformed requests return safe error messages without a stack trace', async () => {
  const response = await request('posts', { method: 'POST', rawBody: '{ malformed json' });
  const body = await response.text();
  assert.equal(response.status, 400);
  assert.match(body, /Please send valid JSON\./);
  assert.doesNotMatch(body, /stack|sqlite|database|server\.js/i);
});

test('AC-28 request bodies larger than 20000 characters return 413', async () => {
  const response = await request('posts', { method: 'POST', rawBody: 'x'.repeat(20001), headers: { 'Content-Type': 'text/plain' } });
  assert.equal(response.status, 413);
});

test('AC-29 HTML and frontend assets include a restrictive content security policy', async () => {
  for (const pathname of ['/', '/app.js', '/styles.css']) {
    const response = await fetch(`${baseUrl}${pathname}`);
    const policy = response.headers.get('content-security-policy') || '';
    assert.equal(response.status, 200);
    assert.match(policy, /default-src 'self'/);
    assert.match(policy, /script-src 'self'/);
  }
});

test('AC-30 the owner can edit their post and another user cannot', async () => {
  const ownEdit = await request(`posts/${fixture.ownerPostId}`, { method: 'PUT', body: { content: 'Edited by Casey' } });
  const otherEdit = await request(`posts/${fixture.ownerPostId}`, { method: 'PUT', token: otherToken, body: { content: 'Changed by Jordan' } });
  const missing = await request('posts/999999', { method: 'PUT', body: { content: 'Missing post' } });
  assert.equal(ownEdit.status, 200);
  assert.equal(otherEdit.status, 403);
  assert.equal(missing.status, 404);
  assert.equal(one('SELECT content FROM posts WHERE post_id=?', fixture.ownerPostId).content, 'Edited by Casey');
});
