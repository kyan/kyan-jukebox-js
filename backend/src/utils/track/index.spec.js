import { findTracks, addTrack } from './index'
import Track from 'services/mongodb/models/track'
import logger from 'config/winston'
jest.mock('config/winston')
jest.mock('services/mongodb/models/track')

const userObject = {
  _id: '123',
  fullname: 'Big Rainbowhead'
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

    it('makes a call to updateOne Track document', () => {
      expect.assertions(3)
      Track.updateOne.mockResolvedValue(trackObject)
      const dateSpy = jest.spyOn(global, 'Date')
      addTrack('123', userObject)
      expect(Track.updateOne).toHaveBeenCalledWith(
        { '_id': '123' },
        { '$push': { addedBy: { _id: '123', addedAt: dateSpy.mock.instances[0], fullname: 'Big Rainbowhead' } } },
        { upsert: true },
        expect.any(Function)
      )
      Track.updateOne.mock.calls[0][3](null, trackObject)
      expect(logger.info).toHaveBeenCalledWith('Updated track', { trackUri: '123' })
      Track.updateOne.mock.calls[0][3](new Error('bang'), null)
      expect(logger.error).toHaveBeenCalledWith('Updated track', { message: 'bang' })
    })

    it('makes a call to updateOne Track document without user', () => {
      expect.assertions(3)
      Track.updateOne.mockResolvedValue(trackObject)
      addTrack('123', null)
      expect(Track.updateOne).toHaveBeenCalledWith(
        {'_id': '123'},
        { '$push': { addedBy: { addedAt: {}, fullname: 'BRH', picture: 'https://cdn-images-1.medium.com/fit/c/200/200/1*bFBXYvskkPFI9nPx6Elwxg.png' } } },
        { upsert: true },
        expect.any(Function)
      )
      Track.updateOne.mock.calls[0][3](null, trackObject)
      expect(logger.info).toHaveBeenCalledWith('Updated track', { trackUri: '123' })
      Track.updateOne.mock.calls[0][3](new Error('bang'), null)
      expect(logger.error).toHaveBeenCalledWith('Updated track', { message: 'bang' })
    })
  })
})
