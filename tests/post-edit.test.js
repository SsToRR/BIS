const { after, before, beforeEach, test } = require('node:test');
const assert = require('node:assert/strict');
const { createHash, randomBytes } = require('node:crypto');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const projectRoot = path.resolve(__dirname, '..');
const nodeBinary = process.env.NODE_BINARY || process.execPath;
let tempDir;
let databaseFile;
let serverProcess;
let baseUrl;
let owner;
let otherUser;
let ownedPostId;

async function freePort() {
  const probe = net.createServer();
  await new Promise((resolve, reject) => {
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', resolve);
  });
  const port = probe.address().port;
  await new Promise((resolve, reject) => probe.close(error => error ? reject(error) : resolve()));
  return port;
}

function makeUser(db, fullName, email) {
  const result = db.prepare(`INSERT INTO users(full_name,email,password_hash,major,faculty,bio,role,created_at)
    VALUES(?,?,?,'Testing','','','student',?)`).run(fullName, email, 'test-salt:test-hash', new Date().toISOString());
  const userId = Number(result.lastInsertRowid);
  const token = randomBytes(24).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  db.prepare('INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)')
    .run(tokenHash, userId, new Date().toISOString(), '2999-01-01T00:00:00.000Z');
  return { userId, token };
}

function resetPost() {
  const db = new DatabaseSync(databaseFile);
  try {
    db.prepare('UPDATE posts SET content=?, updated_at=created_at WHERE post_id=?').run('Original post', ownedPostId);
  } finally {
    db.close();
  }
}

async function editPost(postId, token, content) {
  return fetch(`${baseUrl}/api/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: `sid=${token}` },
    body: JSON.stringify({ content })
  });
}

function savedPost(postId) {
  const db = new DatabaseSync(databaseFile);
  try {
    return db.prepare('SELECT content,created_at,updated_at FROM posts WHERE post_id=?').get(postId);
  } finally {
    db.close();
  }
}

before(async () => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'campus-post-edit-'));
  databaseFile = path.join(tempDir, 'test.sqlite');
  const db = new DatabaseSync(databaseFile);
  try {
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(fs.readFileSync(path.join(projectRoot, 'database/schema.sql'), 'utf8'));
    owner = makeUser(db, 'Post Owner', 'owner@example.test');
    otherUser = makeUser(db, 'Other Student', 'other@example.test');
    const result = db.prepare(`INSERT INTO posts(user_id,content,created_at,updated_at)
      VALUES(?,?,?,?)`).run(owner.userId, 'Original post', '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z');
    ownedPostId = Number(result.lastInsertRowid);
  } finally {
    db.close();
  }

  const port = await freePort();
  baseUrl = `http://127.0.0.1:${port}`;
  serverProcess = spawn(nodeBinary, [path.join(projectRoot, 'server.js')], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(port), DB_FILE: databaseFile, NODE_ENV: 'test' },
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
});

beforeEach(resetPost);

after(async () => {
  if (serverProcess && serverProcess.exitCode === null) {
    serverProcess.kill('SIGTERM');
    await Promise.race([once(serverProcess, 'exit'), new Promise(resolve => setTimeout(resolve, 2000))]);
  }
  if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
});

test('the owner can edit their own post and the updated content is saved', async () => {
  const response = await editPost(ownedPostId, owner.token, 'Updated by owner');
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.content, 'Updated by owner');
  const saved = savedPost(ownedPostId);
  assert.equal(saved.content, 'Updated by owner');
  assert.ok(Date.parse(saved.updated_at) > Date.parse(saved.created_at));
});

test('another student receives 403 and the post remains unchanged', async () => {
  const response = await editPost(ownedPostId, otherUser.token, 'Unauthorized change');
  assert.equal(response.status, 403);
  assert.equal(savedPost(ownedPostId).content, 'Original post');
});

test('an unknown post returns 404', async () => {
  const response = await editPost(999999, owner.token, 'Does not exist');
  assert.equal(response.status, 404);
});

test('an empty post edit is rejected', async () => {
  const response = await editPost(ownedPostId, owner.token, '   ');
  assert.equal(response.status, 400);
  assert.equal(savedPost(ownedPostId).content, 'Original post');
});

test('a post edit longer than 2000 characters is rejected', async () => {
  const response = await editPost(ownedPostId, owner.token, 'x'.repeat(2001));
  assert.equal(response.status, 400);
  assert.equal(savedPost(ownedPostId).content, 'Original post');
});
