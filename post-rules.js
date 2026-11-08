function reject(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function validatePostContent(value) {
  const content = String(value ?? '').trim();
  if (!content || content.length > 2000) reject(400, 'Post must be between 1 and 2000 characters.');
  return content;
}

function requirePostOwner(post, userId, action = 'edit') {
  if (!post) reject(404, 'Post not found.');
  if (post.user_id !== userId) reject(403, `You can only ${action} your own posts.`);
}

module.exports = { requirePostOwner, validatePostContent };
