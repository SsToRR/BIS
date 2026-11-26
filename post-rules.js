function reject(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function validatePostContent(value, hasPhoto = false) {
  const content = String(value ?? '').trim();
  if (!content && !hasPhoto) reject(400, 'Write a post or add a photo.');
  if (content.length > 2000) reject(400, 'Post text must be 2000 characters or fewer.');
  return content;
}

function requirePostOwner(post, userId, action = 'edit') {
  if (!post) reject(404, 'Post not found.');
  if (post.user_id !== userId) reject(403, `You can only ${action} your own posts.`);
}

module.exports = { requirePostOwner, validatePostContent };
