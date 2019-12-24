import { findTracks, addTracks } from './index'
import Track from 'services/mongodb/models/track'
import logger from 'config/winston'
jest.mock('config/winston')
jest.mock('services/mongodb/models/track')

const userObject = {
  _id: '999',
  fullname: 'Fred Spanner'
}

describe('trackUtils', () => {
  describe('#findTracks', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('makes a call to findOne Track document', () => {
      expect.assertions(1)
      Track.find.mockResolvedValue([{ _id: '123' }])
      return findTracks('123').then(() => {
        expect(Track.find).toHaveBeenCalledWith({
          _id: {
            $in: '123'
          }
        })
      })
    })

    it('handles errors', () => {
      expect.assertions(1)
      Track.find.mockRejectedValue(new Error('bang'))
      return findTracks('123').catch((error) => {
        expect(error.message).toEqual('bang')
      })
    })
  })

  describe('#addTrack', () => {
    const trackObject = { trackUri: '123' }
    const fakeDate = new Date(1222222224332)

    it('makes a call to updateOne Track document via user', done => {
      expect.assertions(2)
      Track.updateOne.mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(trackObject)
        }
      })
      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      addTracks(demoUris, userObject).then((uris) => {
        setTimeout(() => {
          try {
            expect(uris).toEqual(demoUris)
            expect(Track.updateOne.mock.calls[0]).toEqual([
              { _id: '123' },
              { $push: {
                addedBy: {
                  _id: '999',
                  addedAt: fakeDate,
                  fullname: 'Fred Spanner'
                }
              }
              },
              { upsert: true }
            ])
            done()
          } catch (err) {
            done.fail(err)
          }
        })
      })
    })

    it('makes a call to updateOne Track document via BRH', done => {
      expect.assertions(2)
      Track.updateOne.mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(trackObject)
        }
      })
      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      addTracks(demoUris).then((uris) => {
        setTimeout(() => {
          try {
            expect(uris).toEqual(demoUris)
            expect(Track.updateOne.mock.calls[0]).toEqual([
              { _id: '123' },
              { $push: {
                addedBy: {
                  addedAt: fakeDate,
                  fullname: 'BRH',
                  picture: 'https://cdn-images-1.medium.com/fit/c/200/200/1*bFBXYvskkPFI9nPx6Elwxg.png'
                }
              }
              },
              { upsert: true }
            ])
            done()
          } catch (err) {
            done.fail(err)
          }
        })
      })
    })

    it('makes a call to updateOne Track document and errors', done => {
      expect.assertions(1)
      Track.updateOne.mockImplementation(() => {
        return {
          exec: jest.fn().mockRejectedValue(new Error('boom'))
        }
      })
      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      addTracks(demoUris)
      setTimeout(() => {
        try {
          expect(logger.error).toHaveBeenCalledWith('addTracks', { message: 'boom' })
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })
  })
})
