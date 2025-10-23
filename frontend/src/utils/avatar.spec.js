import { getAvatarUrl } from './avatar'
import { describe, it, expect } from 'bun:test'

describe('avatar utils', () => {
  describe('getAvatarUrl', () => {
    it('should return user picture if provided', () => {
      const user = {
        picture: 'https://example.com/avatar.jpg',
        fullname: 'John Doe',
        email: 'john@example.com'
      }

      const result = getAvatarUrl(user)

      expect(result).toBe('https://example.com/avatar.jpg')
    })

    it('should generate ui-avatars URL with fullname when no picture', () => {
      const user = {
        fullname: 'John Doe',
        email: 'john@example.com'
      }

      const result = getAvatarUrl(user)

      expect(result).toBe('https://ui-avatars.com/api/?name=John%20Doe&size=50&background=random')
    })

    it('should generate ui-avatars URL with email when no fullname', () => {
      const user = {
        email: 'john@example.com'
      }

      const result = getAvatarUrl(user)

      expect(result).toBe(
        'https://ui-avatars.com/api/?name=john%40example.com&size=50&background=random'
      )
    })

    it('should use custom size parameter', () => {
      const user = {
        fullname: 'John Doe'
      }

      const result = getAvatarUrl(user, 100)

      expect(result).toBe('https://ui-avatars.com/api/?name=John%20Doe&size=100&background=random')
    })

    it('should handle user with no name or email', () => {
      const user = {}

      const result = getAvatarUrl(user)

      expect(result).toBe(
        'https://ui-avatars.com/api/?name=Unknown%20User&size=50&background=random'
      )
    })

    it('should handle null or undefined user', () => {
      const result1 = getAvatarUrl(null)
      const result2 = getAvatarUrl(undefined)

      expect(result1).toBe(
        'https://ui-avatars.com/api/?name=Unknown%20User&size=50&background=random'
      )
      expect(result2).toBe(
        'https://ui-avatars.com/api/?name=Unknown%20User&size=50&background=random'
      )
    })

    it('should properly encode special characters in names', () => {
      const user = {
        fullname: 'John & Jane Doe'
      }

      const result = getAvatarUrl(user)

      expect(result).toBe(
        'https://ui-avatars.com/api/?name=John%20%26%20Jane%20Doe&size=50&background=random'
      )
    })
  })
})
