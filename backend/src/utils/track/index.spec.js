import { findTracks, addTrack } from './index'
import Track from 'services/mongodb/models/track'
import logger from 'config/winston'
jest.mock('config/winston')

const userObject = {
  _id: '123',
  fullname: 'Big Rainbowhead'
}

describe('findTracks', () => {
  it('makes a call to findOne Track document', () => {
    expect.assertions(1)
    jest.spyOn(Track, 'find').mockReturnValue(Promise.resolve([{ _id: '123' }]))
    return findTracks('123').then(() => {
      expect(Track.find).toHaveBeenCalledWith({
        _id: {
          $in: '123'
        }
      })
    })
  })
})

describe('addTrack', () => {
  const trackObject = { trackUri: '123' }
  it('makes a call to updateOne Track document', () => {
    expect.assertions(2)
    jest.spyOn(Track, 'updateOne').mockReturnValue(Promise.resolve(trackObject))
    const dateSpy = jest.spyOn(global, 'Date')
    addTrack('123', userObject)
    expect(Track.updateOne).toHaveBeenCalledWith(
      {'_id': '123'},
      {'$push': {'addedBy': {'_id': '123', 'addedAt': dateSpy.mock.instances[0], 'fullname': 'Big Rainbowhead'}}},
      { upsert: true },
      expect.any(Function)
    )
    Track.updateOne.mock.calls[0][3](null, trackObject)
    expect(logger.info).toHaveBeenCalledWith('Updated track', {'trackUri': '123'})
  })
})
