const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const dbFile = process.env.DB_FILE || path.join(__dirname, 'student-network.sqlite');
const db = new DatabaseSync(dbFile);
db.exec('PRAGMA foreign_keys = ON;');
db.exec(require('node:fs').readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
const run = (sql,...args)=>db.prepare(sql).run(...args);
const one = (sql,...args)=>db.prepare(sql).get(...args);
const now = new Date().toISOString();
const demoPassword = 'CampusDemo2026!';
const accounts = [
  ['Casey Morgan','casey@student.local','Information Systems','School of Business','Curious about campus life and good coffee.'],
  ['Jordan Lee','jordan@student.local','Computer Science','School of Engineering','Building little projects and big ideas.'],
  ['Taylor Brooks','taylor@student.local','Finance','School of Business','Always happy to share study notes.'],
  ['Riley Chen','riley@student.local','Marketing','School of Business','Looking for creative collaborators.'],
  ['Alex Rivera','alex@student.local','Data Science','School of Engineering','Learning something new every day.']
];
for (const [full_name,email,major,faculty,bio] of accounts) {
  if (one('SELECT user_id FROM users WHERE email=?',email)) continue;
  const salt=crypto.randomBytes(16).toString('hex');
  const hash=crypto.scryptSync(demoPassword,salt,64).toString('hex');
  run('INSERT INTO users(full_name,email,password_hash,major,faculty,bio,role,created_at) VALUES(?,?,?,?,?,?,?,?)',full_name,email,`${salt}:${hash}`,major,faculty,bio,'student',now);
}
if (one('SELECT COUNT(*) AS n FROM posts').n===0) {
  const users=Object.fromEntries(accounts.map(([,email])=>[email,one('SELECT user_id FROM users WHERE email=?',email).user_id]));
  const post1=Number(run('INSERT INTO posts(user_id,content,created_at,updated_at) VALUES(?,?,?,?)',users['jordan@student.local'],'Anyone up for a quiet study session in the library this afternoon? I have extra notes for the database lecture.',now,now).lastInsertRowid);
  const post2=Number(run('INSERT INTO posts(user_id,content,created_at,updated_at) VALUES(?,?,?,?)',users['taylor@student.local'],'Small win: finally got my study plan organized for the week. What helps you stay on track?',now,now).lastInsertRowid);
  run('INSERT INTO comments(post_id,user_id,content,created_at) VALUES(?,?,?,?)',post1,users['casey@student.local'],'I would love to join. Thanks for sharing your notes!',now);
  run('INSERT INTO comments(post_id,user_id,content,created_at) VALUES(?,?,?,?)',post2,users['riley@student.local'],'A short to-do list each morning works for me.',now);
  for(const [userId,postId] of [[users['casey@student.local'],post1],[users['riley@student.local'],post1],[users['casey@student.local'],post2]]) run('INSERT OR IGNORE INTO likes(post_id,user_id,created_at) VALUES(?,?,?)',postId,userId,now);
  for(const [follower,following] of [[users['casey@student.local'],users['jordan@student.local']],[users['casey@student.local'],users['taylor@student.local']],[users['jordan@student.local'],users['casey@student.local']],[users['riley@student.local'],users['taylor@student.local']]]) run('INSERT OR IGNORE INTO follows(follower_id,following_id,created_at) VALUES(?,?,?)',follower,following,now);
}
console.log(`Demo data is ready in ${dbFile}. Five fictional accounts use the local-only password: ${demoPassword}`);
db.close();
