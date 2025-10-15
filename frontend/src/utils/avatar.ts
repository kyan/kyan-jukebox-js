interface User {
  picture?: string
  fullname?: string
  email?: string
}

/**
 * Generate an avatar URL for a user
 * Falls back to ui-avatars.com if no picture is provided
 *
 * @param user - User object
 * @param size - Avatar size in pixels (default: 50)
 * @returns Avatar URL
 */
export const getAvatarUrl = (user: User, size: number = 50): string => {
  if (user && user.picture) {
    return user.picture
  }

  const name = user?.fullname || user?.email || 'Unknown User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=random`
}
