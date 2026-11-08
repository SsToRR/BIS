const { test } = require('node:test');
const assert = require('node:assert/strict');
const { requirePostOwner, validatePostContent } = require('../post-rules');

test('the post owner is allowed to edit', () => {
  assert.doesNotThrow(() => requirePostOwner({ user_id: 12 }, 12));
});

test('a different user is rejected with 403', () => {
  assert.throws(
    () => requirePostOwner({ user_id: 12 }, 34),
    error => error.status === 403 && error.message === 'You can only edit your own posts.'
  );
});

test('a missing post is rejected with 404', () => {
  assert.throws(
    () => requirePostOwner(null, 12),
    error => error.status === 404 && error.message === 'Post not found.'
  );
});

test('post content is trimmed and accepts the 1- and 2000-character boundaries', () => {
  assert.equal(validatePostContent('  x  '), 'x');
  assert.equal(validatePostContent('x'.repeat(2000)).length, 2000);
});

test('blank and over-limit post content are rejected with 400', () => {
  for (const content of ['   ', 'x'.repeat(2001)]) {
    assert.throws(
      () => validatePostContent(content),
      error => error.status === 400 && error.message === 'Post must be between 1 and 2000 characters.'
    );
  }
});
