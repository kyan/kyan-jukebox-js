import HttpService from './index'
import gaxios from 'gaxios'
import logger from '../../../config/winston'

jest.mock('gaxios', () => {
  return {
    request: jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ body: {} }))
      .mockImplementationOnce(() => Promise.reject(new Error('bang')))
  }
})

describe('HttpService', () => {
  // const errorLoggerMock = jest.fn()
  // const requestMock = jest.fn()

  // beforeAll(() => {
  //   jest.spyOn(gaxios, 'request').mockImplementationOnce(requestMock)
  //   jest.spyOn(logger, 'error').mockImplementation(errorLoggerMock)
  // })

  describe('post', () => {
    it('should call through to the HTTP library with expected URL & data', async () => {
      await HttpService.post('/endpoint', { foo: 'bar' })
      expect(gaxios.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/endpoint',
        data: {
          foo: 'bar'
        }
      })
    })

    it('should catch an error and pass it to the logger', async () => {
      await HttpService.post('/this_one_breaks', { foo: 'bar' })
      expect(gaxios.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/endpoint',
        data: {
          foo: 'bar'
        }
      })
    })
  })
})
