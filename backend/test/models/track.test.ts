import mockingoose from 'mockingoose'
import User, { JBUser } from '../../src/models/user'
import EventLogger from '../../src/utils/event-logger'
import logger from '../../src/config/logger'
import Track, { updateTrackPlaycount, updateTrackVote } from '../../src/models/track'
jest.mock('../../src/config/logger')
jest.mock('../../src/utils/event-logger')

describe('test mongoose Track model', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('#Track', () => {
    it('should return using findById', () => {
      const _doc = {
        _id: '2xN54cw14BBwQVCzQS2izH',
        addedBy: []
      } as unknown

      const finderMock = (query: any) => {
        expect(query.getQuery()).toMatchSnapshot('findById query')

        if (query.getQuery()._id === '2xN54cw14BBwQVCzQS2izH') {
          return _doc
        }
      }
      mockingoose(Track as any).toReturn(finderMock, 'findOne')

      return Track.findById('2xN54cw14BBwQVCzQS2izH').then((doc) => {
        expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc)
      })
    })
  })

  describe('#findTracks', () => {
    it('makes a call to find Track documents', async () => {
      expect.assertions(1)
      mockingoose(Track as any).toReturn([{ _id: '123' }], 'find')
      await Track.findTracks(['123'])
      expect(EventLogger.info).toHaveBeenCalledWith('FOUND CACHED TRACKS', {
        data: ['123']
      })
    })

    it('makes a call to find Track documents and returns nothing', async () => {
      expect.assertions(1)
      mockingoose(Track as any).toReturn([], 'find')
      await Track.findTracks(['123'])
      expect(logger.info).not.toHaveBeenCalled()
    })

    it('handles errors', () => {
      expect.assertions(1)
      mockingoose(Track as any).toReturn(new Error('My Error'), 'find')
      return Track.findTracks(['123']).catch((error) => {
        expect(error.message).toEqual('My Error')
      })
    })
  })

  describe('#addTracks', () => {
    const trackObject = { trackUri: '123' }
    const fakeDate = new Date(888251200000) as any

    it('returns the uris uses the user', async () => {
      expect.assertions(1)
      const userObject = {
        _id: '999',
        fullname: 'Fred Spanner'
      } as JBUser
      mockingoose(Track as any).toReturn(trackObject, 'updateOne' as any)
      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)

      const uris = await Track.addTracks(demoUris, userObject)
      expect(uris).toEqual({
        uris: ['123', '456'],
        user: { _id: '999', fullname: 'Fred Spanner' }
      })
    })

    it('returns the uris and uses BRH', async () => {
      expect.assertions(2)
      mockingoose(Track as any).toReturn(trackObject, 'updateOne' as any)

      const userFinderMock = (query: any) => {
        expect(query.getQuery()).toMatchSnapshot('findOneAndUpdate query')

        if (query.getQuery()._id === '1ambigrainbowhead') {
          return { _id: '1ambigrainbowhead', fullname: 'BRH' }
        }
      }
      mockingoose(User).toReturn(userFinderMock, 'findOneAndUpdate')

      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)

      const uris = await Track.addTracks(demoUris, null)
      expect(uris).toMatchObject({
        uris: ['123', '456'],
        user: { _id: '1ambigrainbowhead', fullname: 'BRH' }
      })
    })

    it('errors when calling findOrUseBRH and User fails', () => {
      expect.assertions(1)
      mockingoose(User).toReturn(new Error('user fail'), 'findOneAndUpdate')
      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      Track.addTracks(demoUris)

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('addTracks:findOrUseBRH', {
            message: 'user fail'
          })
          resolve()
        }, 0)
      })
    })

    it('errors when calling findOrUseBRH and Track fails', () => {
      expect.assertions(1)
      mockingoose(Track as any).toReturn(new Error('track fail'), 'findOneAndUpdate')
      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      Track.addTracks(demoUris)

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('addTracks:Track.updateOne', {
            message: 'track fail'
          })
          resolve()
        }, 0)
      })
    })
  })

  describe('#updateTrackPlaycount', () => {
    const fakeDate = new Date(888251200000) as any

    it('sets the playedAt', async () => {
      expect.assertions(1)
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      const track = {
        addedBy: [{}]
      } as unknown
      mockingoose(Track as any).toReturn(track, 'findOne')
      const track_1 = await updateTrackPlaycount('123')
      expect(track_1).toMatchSnapshot('playedAt data filled in')
    })

    it('does not set the playedAt', async () => {
      expect.assertions(1)
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      const track = {
        addedBy: []
      } as unknown
      mockingoose(Track as any).toReturn(track, 'findOne')
      const track_1 = await updateTrackPlaycount('123')
      expect(track_1).toMatchSnapshot('playedAt data filled in')
    })

    it('handles an error', () => {
      expect.assertions(1)
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      mockingoose(Track as any).toReturn(new Error('boom!'), 'findOne')
      updateTrackPlaycount('123')

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('updateTrackPlaycount', {
            message: 'boom!'
          })
          resolve()
        }, 0)
      })
    })
  })

  describe('#updateTrackVote', () => {
    const fakeDate = new Date(888251200000) as any
    const user = { _id: 'user999', fullname: 'Fred Spanner' } as JBUser

    it('does not vote when there is no matching track', async () => {
      expect.assertions(1)
      const payload = { _id: 'uri123', addedBy: [] } as any
      mockingoose(Track as any).toReturn(payload, 'findOne')
      const result = await updateTrackVote(payload._id, user, 12)
      expect(result).toMatchSnapshot()
    })

    it('handles an error with Track.findById', () => {
      expect.assertions(1)
      const track = { _id: 'uri123', addedBy: [{ votes: [] }] } as Track
      mockingoose(Track as any).toReturn(new Error('boom!'), 'findOne')
      updateTrackVote(track._id, user, 12)

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('updateTrackVote:findById', {
            message: 'boom!'
          })
          resolve()
        }, 0)
      })
    })

    it('handles an error with findOrUseBRH', () => {
      expect.assertions(1)
      const track = { _id: 'uri123', addedBy: [{ votes: [] }] } as Track
      mockingoose(User).toReturn(new Error('boom!'), 'findOneAndUpdate')
      updateTrackVote(track._id, null, 12)

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('updateTrackVote:findOrUseBRH', {
            message: 'boom!'
          })
          resolve()
        }, 0)
      })
    })

    it('adds a vote when there is a matching track', async () => {
      expect.assertions(1)
      const payload = { _id: 'uri123', addedBy: [{ votes: [] }] } as Track
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      mockingoose(Track as any).toReturn(payload, 'findOne')

      const track = await updateTrackVote(payload._id, user, 2)
      expect(track).toMatchSnapshot()
    })

    it('updates a vote when there is a matching track', async () => {
      expect.assertions(1)
      const vote = { user, vote: 10, at: new Date(888451200000) }
      const track = {
        _id: 'uri123',
        id: 'uri123',
        addedBy: [{ votes: [vote] }],
        metrics: {},
        save: () =>
          Promise.resolve({
            id: '123',
            addedBy: 'addedBy',
            metrics: 'metrics'
          })
      }
      jest.spyOn(Track, 'findOne').mockImplementation(() => {
        return {
          populate: () => {
            return {
              populate: () => Promise.resolve(track)
            }
          }
        } as any
      })
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)

      const result_3 = await updateTrackVote(track._id, user, 12)
      expect(result_3).toMatchSnapshot()
    })
  })
})
