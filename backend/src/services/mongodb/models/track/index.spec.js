import mockingoose from 'mockingoose'
import User from 'services/mongodb/models/user'
import EventLogger from 'utils/event-logger'
import logger from 'config/winston'
import Track, { findTracks, addTracks, updateTrackPlaycount, updateTrackVote } from './index'
jest.mock('config/winston')
jest.mock('utils/event-logger')

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
      }

      const finderMock = query => {
        expect(query.getQuery()).toMatchSnapshot('findById query')

        if (query.getQuery()._id === '2xN54cw14BBwQVCzQS2izH') {
          return _doc
        }
      }
      mockingoose(Track).toReturn(finderMock, 'findOne')

      return Track.findById('2xN54cw14BBwQVCzQS2izH').then(doc => {
        expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc)
      })
    })
  })

  describe('#findTracks', () => {
    it('makes a call to findOne Track document', () => {
      expect.assertions(1)
      mockingoose(Track).toReturn([{ _id: '123' }], 'find')
      return findTracks('123').then(() => {
        expect(EventLogger.info).toHaveBeenCalledWith('FOUND CACHED TRACKS', { data: '123' })
      })
    })

    it('makes a call to findOne Track document and returns nothing', () => {
      expect.assertions(1)
      mockingoose(Track).toReturn([], 'find')
      return findTracks('123').then(() => {
        expect(logger.info).not.toHaveBeenCalled()
      })
    })

    it('handles errors', () => {
      expect.assertions(1)
      mockingoose(Track).toReturn(new Error('My Error'), 'find')
      return findTracks('123').catch((error) => {
        expect(error.message).toEqual('My Error')
      })
    })
  })

  describe('#addTracks', () => {
    const trackObject = { trackUri: '123' }
    const fakeDate = new Date(8251200000)

    it('returns the uris uses the user', () => {
      expect.assertions(1)
      const userObject = {
        _id: '999',
        fullname: 'Fred Spanner'
      }
      mockingoose(Track).toReturn(trackObject, 'updateOne')
      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)

      return addTracks(demoUris, userObject).then((uris) => {
        expect(uris).toEqual({ uris: ['123', '456'], user: { _id: '999', fullname: 'Fred Spanner' } })
      })
    })

    it('returns the uris and uses BRH', () => {
      expect.assertions(2)
      mockingoose(Track).toReturn(trackObject, 'updateOne')

      const userFinderMock = query => {
        expect(query.getQuery()).toMatchSnapshot('findOneAndUpdate query')

        if (query.getQuery()._id === '1ambigrainbowhead') {
          return { _id: '1ambigrainbowhead', fullname: 'BRH' }
        }
      }
      mockingoose(User).toReturn(userFinderMock, 'findOneAndUpdate')

      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)

      return addTracks(demoUris, null).then((uris) => {
        expect(uris).toMatchObject({ uris: ['123', '456'], user: { _id: '1ambigrainbowhead', fullname: 'BRH' } })
      })
    })

    it('errors when calling findOrUseBRH', done => {
      expect.assertions(1)
      mockingoose(User).toReturn(new Error('updateOne BRH Fail'), 'findOneAndUpdate')
      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      addTracks(demoUris)
      setTimeout(() => {
        try {
          expect(logger.error).toHaveBeenCalledWith('addTracks:findOrUseBRH', { message: 'updateOne BRH Fail' })
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })

    it('errors when calling findOrUseBRH', done => {
      expect.assertions(1)
      mockingoose(Track).toReturn(new Error('updateOne Track Fail'), 'findOneAndUpdate')
      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      addTracks(demoUris)
      setTimeout(() => {
        try {
          expect(logger.error).toHaveBeenCalledWith('addTracks:Track.updateOne', { message: 'updateOne Track Fail' })
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })
  })

  describe('#updateTrackPlaycount', () => {
    const fakeDate = new Date(8251200000)

    it('sets the playedAt', () => {
      expect.assertions(1)
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      const track = {
        addedBy: [
          { playedAt: null }
        ]
      }
      mockingoose(Track).toReturn(track, 'findOne')
      return updateTrackPlaycount('123').then((track) => {
        expect(track).toMatchSnapshot('playedAt data filled in')
      })
    })

    it('does not set the playedAt', () => {
      expect.assertions(1)
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      const track = {
        addedBy: []
      }
      mockingoose(Track).toReturn(track, 'findOne')
      return updateTrackPlaycount('123').then((track) => {
        expect(track).toMatchSnapshot('playedAt data filled in')
      })
    })

    it('handles an error', done => {
      expect.assertions(1)
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      mockingoose(Track).toReturn(new Error('boom!'), 'findOne')
      updateTrackPlaycount('123')
      setTimeout(() => {
        try {
          expect(logger.error).toHaveBeenCalledWith('updateTrackPlaycount', { message: 'boom!' })
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })
  })

  describe('#updateTrackVote', () => {
    const fakeDate = new Date(8251200000)
    const user = { _id: 'user999', fullname: 'Fred Spanner' }

    it('does not vote when there is no matching track', () => {
      expect.assertions(1)
      const payload = { _id: 'uri123', addedBy: [] }
      mockingoose(Track).toReturn(payload, 'findOne')
      return updateTrackVote(payload._id, user, 12).then((result) => {
        expect(result).toMatchSnapshot()
      })
    })

    it('handles an error with Track.findById', done => {
      expect.assertions(1)
      const track = { _id: 'uri123', addedBy: [{ votes: [] }] }
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      mockingoose(Track).toReturn(new Error('boom!'), 'findOne')
      updateTrackVote(track._id, user, 12)
      setTimeout(() => {
        try {
          expect(logger.error).toHaveBeenCalledWith('updateTrackVote:findById', { message: 'boom!' })
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })

    it('handles an error with findOrUseBRH', done => {
      expect.assertions(1)
      const track = { _id: 'uri123', addedBy: [{ votes: [] }] }
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      mockingoose(User).toReturn(new Error('boom!'), 'findOneAndUpdate')
      updateTrackVote(track._id, null, 12)
      setTimeout(() => {
        try {
          expect(logger.error).toHaveBeenCalledWith('updateTrackVote:findOrUseBRH', { message: 'boom!' })
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })

    it('adds a vote when there is a matching track', () => {
      expect.assertions(1)
      const payload = { _id: 'uri123', addedBy: [{ votes: [] }] }
      mockingoose(Track).toReturn(payload, 'findOne')
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)

      return updateTrackVote(payload._id, user, 2).then((track) => {
        expect(track).toMatchSnapshot()
      })
    })

    it('updates a vote when there is a matching track', done => {
      expect.assertions(1)
      const track = {
        _id: 'uri123',
        id: 'uri123',
        addedBy: [{ votes: [{ user: { _id: 'user999' }, vote: 10 }] }],
        metrics: {},
        save: () => Promise.resolve({
          id: '123',
          addedBy: 'addedBy',
          metrics: 'metrics'
        })
      }
      jest.spyOn(Track, 'findById').mockImplementation(() => {
        return {
          populate: () => {
            return {
              populate: () => Promise.resolve(track)
            }
          }
        }
      })
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)

      return updateTrackVote(track._id, user, 12).then((result) => {
        setTimeout(() => {
          try {
            expect(result).toMatchSnapshot()
            done()
          } catch (err) {
            done.fail(err)
          }
        })
      })
    })
  })
})
