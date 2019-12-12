import EnvVars from './index'

describe('EnvVars', () => {
  const portKey = 'WS_MOPIDY_PORT'
  const portValue = '42'

  describe('isSet', () => {
    it('returns false if the specified environment variable is not set', () => {
      delete process.env[portKey]
      expect(EnvVars.isSet(portKey)).toEqual(false)
    })

    it('returns false if the specified environment variable is empty', () => {
      process.env[portKey] = ''
      expect(EnvVars.isSet(portKey)).toEqual(false)
    })

    it('returns true if the specified environment variable has a non-empty value', () => {
      process.env[portKey] = portValue
      expect(EnvVars.isSet(portKey)).toEqual(true)
    })
  })

  describe('get', () => {
    it('throws with a message if the environment variable is empty or undefined', () => {
      const key = 'foobar'
      expect(() => EnvVars.get(key)).toThrow(`Environment variable "${key}" is empty or undefined`)
    })

    it('throws with a message if the environment variable value is invalid', () => {
      const badValue = 'foobar'
      process.env[portKey] = badValue
      expect(() => EnvVars.get(portKey)).toThrow(
        `Environment variable "${portKey}" value is invalid: "${badValue}" does not match /^\\d+$/`
      )
    })

    it('does not throw if the environment variable is defined and valid', () => {
      process.env[portKey] = portValue
      expect(() => EnvVars.get(portKey)).not.toThrow()
    })

    it('returns the requested environment variable', () => {
      process.env[portKey] = portValue
      expect(EnvVars.get(portKey)).toEqual(portValue)
    })
  })
})
