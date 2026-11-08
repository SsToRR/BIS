const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const start = appSource.indexOf('function postCard(p){');
const end = appSource.indexOf('\nfunction empty(', start);
assert.ok(start >= 0 && end > start, 'postCard renderer should be present');
const cardRenderer = appSource.slice(start, end);
const context = {
  state: { user: { user_id: 11 }, editingPostId: null },
  esc: value => String(value ?? ''),
  date: () => 'Just now',
  avatar: () => '<div class="avatar">CM</div>'
};
vm.createContext(context);
vm.runInContext(`${cardRenderer}\nglobalThis.renderPostCard = postCard;`, context);

const post = {
  post_id: 91,
  user_id: 11,
  full_name: 'Casey Morgan',
  major: 'Computer Science',
  content: 'A sample post',
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
  like_count: 0,
  comment_count: 0,
  liked_by_me: false,
  comments: []
};

test('the author sees edit and delete controls on their post', () => {
  const html = context.renderPostCard(post);
  assert.match(html, /data-action="edit-post"/);
  assert.match(html, /data-action="delete-post"/);
});

test('another student does not see edit or delete controls', () => {
  context.state.user = { user_id: 12 };
  const html = context.renderPostCard(post);
  assert.doesNotMatch(html, /data-action="edit-post"/);
  assert.doesNotMatch(html, /data-action="delete-post"/);
});
