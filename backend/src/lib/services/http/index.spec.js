import HttpService from './index'
import { request } from 'gaxios'
import logger from '../../../config/winston'
jest.mock('../../../config/winston')
jest.mock('gaxios', () => {
  return {
    request: jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ body: {} }))
      .mockImplementationOnce(() => Promise.reject(new Error('bang!')))
  }
})

describe('HttpService', () => {
  const errorLoggerMock = jest.fn()
  const infoLoggerMock = jest.fn()
  const url = '/endpoint'
  const data = { track: 'Good song' }

  beforeAll(() => {
    jest.spyOn(logger, 'info').mockImplementation(infoLoggerMock)
    jest.spyOn(logger, 'error').mockImplementation(errorLoggerMock)
  })

  describe('post', () => {
    beforeEach(() => {
      HttpService.post({
        url,
        data
      })
    })

    it('should call through to the HTTP library with expected URL & data', () => {
      expect(request).toHaveBeenCalledWith({
        method: 'POST',
        url,
        data
      })
      expect(infoLoggerMock).toHaveBeenCalledWith(
        'Posted to /endpoint',
        { message: JSON.stringify({ track: 'Good song' }) }
      )
    })

    it('should catch an error and pass it to the logger', () => {
      expect(request).toHaveBeenCalledWith({
        method: 'POST',
        url,
        data
      })
      expect(errorLoggerMock).toHaveBeenCalledWith(
        'Something went wrong with /endpoint',
        { message: 'bang!' }
      )
    })
  })
})
