import Settings from './index'

jest.mock('node-localstorage', () => {
  const dataMock = jest.fn()
    .mockReturnValueOnce('["3oAWTk92mZBxKBOKf8mR5v","6PPhp1qpAjLUxQr75vSD4H"]')
    .mockReturnValueOnce(null)
    .mockReturnValueOnce('["3oAWTk92mZBxKBOKf8mR5v","6PPhp1qpAjLUxQr75vSD4H"]')
    .mockReturnValueOnce('"xxxxxxxxx"')
    .mockReturnValueOnce(null)
    .mockReturnValueOnce('["3oAWTk92mZBxKBOKf8mR5v","6PPhp1qpAjLUxQr75vSD4H"]')
    .mockReturnValueOnce('["3oAWTk92mZBxKBOKf8mR5v","6PPhp1qpAjLUxQr75vSD4H"]')

  return {
    LocalStorage: jest.fn()
      .mockImplementation(() => {
        return {
          getItem: () => dataMock(),
          setItem: () => jest.fn(),
          removeItem: () => 'allOK',
          clear: () => 'cleared'
        }
      })
  }
})

describe('Settings', () => {
  describe('getItem', () => {
    it('handles get', () => {
      expect(Settings.getItem('myKey')).toEqual(['3oAWTk92mZBxKBOKf8mR5v', '6PPhp1qpAjLUxQr75vSD4H'])
    })

    it('handles empty get', () => {
      expect(Settings.getItem('myKey')).toBeNull()
    })
  })

  describe('setItem', () => {
    it('correctly sets a value', () => {
      JSON.stringify = jest.fn()
      Settings.setItem('myKey', 'myValue')
      expect(JSON.stringify.mock.calls[0]).toEqual(['myValue'])
    })

    it('only sets a value is one is availble to set', () => {
      JSON.stringify = jest.fn()
      Settings.setItem('myKey', null)
      expect(JSON.stringify.mock.calls[0]).toBeUndefined()
    })
  })

  describe('removeItem', () => {
    it('handles removeItem', () => {
      expect(Settings.removeItem('myKey')).toEqual('allOK')
    })
  })

  describe('clearAll', () => {
    it('handles clearAll', () => {
      expect(Settings.clearAll()).toEqual('cleared')
    })
  })

  describe('addToUniqueArray', () => {
    it('adds information correctly', () => {
      const data = Settings.addToUniqueArray('myKey', 'myValue')
      expect(data).toEqual(['3oAWTk92mZBxKBOKf8mR5v', '6PPhp1qpAjLUxQr75vSD4H', 'myValue'])
    })

    it('adds to an array even if', () => {
      expect(() => {
        Settings.addToUniqueArray('myKey', 'myValue')
      }).toThrow('addToUniqueArray: myKey is currently NOT an Array')
    })

    it('adds information correctly when adding for the first time', () => {
      const data = Settings.addToUniqueArray('myKey', 'myValue')
      expect(data).toEqual(['myValue'])
    })

    it('correctly applies a limit', () => {
      const data = Settings.addToUniqueArray('myKey', 'myValue', 2)
      expect(data).toEqual(['6PPhp1qpAjLUxQr75vSD4H', 'myValue'])
    })

    it('does not re-add information', () => {
      const data = Settings.addToUniqueArray('myKey', '6PPhp1qpAjLUxQr75vSD4H', 2)
      expect(data).toEqual(['3oAWTk92mZBxKBOKf8mR5v', '6PPhp1qpAjLUxQr75vSD4H'])
    })
  })
})
