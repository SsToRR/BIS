const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const init = appSource.lastIndexOf('\ninit();');
assert.ok(init > 0, 'App initialization should follow the renderers');
const ui = { addEventListener() {} };
const context = {
  document: { querySelector: () => ui },
  window: ui,
};
vm.createContext(context);
vm.runInContext(`${appSource.slice(0, init)}\nObject.assign(globalThis, { renderPostCard: postCard, state });`, context);

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
  context.state.user = { user_id: 11 };
  const html = context.renderPostCard(post);
  assert.match(html, /data-action="edit-post"/);
  assert.match(html, /data-action="delete-post"/);
});

test('post photos include escaped descriptions and owner-only editing controls', () => {
  const withPhoto = { ...post, has_image: true, image_alt: 'Casey’s "campus" photo' };
  context.state.user = { user_id: 11 };
  context.state.editingPostId = 91;
  const edit = context.renderPostCard(withPhoto);
  assert.match(edit, /name="image_file" accept="image\/png,image\/jpeg,image\/webp"/);
  assert.match(edit, /name="image_alt" maxlength="200" value="Casey’s &quot;campus&quot; photo"/);
  assert.match(edit, /name="remove_image"/);

  context.state.user = { user_id: 12 };
  const view = context.renderPostCard(withPhoto);
  assert.match(view, /src="\/api\/posts\/91\/image\?v=/);
  assert.match(view, /alt="Casey’s &quot;campus&quot; photo"/);
  assert.doesNotMatch(view, /name="image_file"|name="remove_image"/);
  context.state.editingPostId = null;
});

test('another student does not see edit or delete controls', () => {
  context.state.user = { user_id: 12 };
  const html = context.renderPostCard(post);
  assert.doesNotMatch(html, /data-action="edit-post"/);
  assert.doesNotMatch(html, /data-action="delete-post"/);
});
