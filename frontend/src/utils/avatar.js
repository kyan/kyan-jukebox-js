/**
 * Generate an avatar URL for a user
 * Falls back to ui-avatars.com if no picture is provided
 *
 * @param {Object} user - User object
 * @param {string} user.picture - User's profile picture URL (optional)
 * @param {string} user.fullname - User's full name (optional)
 * @param {string} user.email - User's email (optional)
 * @param {number} size - Avatar size in pixels (default: 50)
 * @returns {string} Avatar URL
 */
export const getAvatarUrl = (user, size = 50) => {
  if (user && user.picture) {
    return user.picture
  }

  const name = user?.fullname || user?.email || 'Unknown User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=random`
}
