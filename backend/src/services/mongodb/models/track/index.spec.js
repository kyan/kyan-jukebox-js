import mockingoose from 'mockingoose'
import User from 'services/mongodb/models/user'
import Track, { findTracks, addTracks, updateTrackPlaycount } from './index'
import logger from 'config/winston'
jest.mock('config/winston')

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
        expect(logger.info).toHaveBeenCalledWith('FOUND CACHED TRACKS', { keys: '123' })
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

    it('returns the uris uses the user', done => {
      const userObject = {
        _id: '999',
        fullname: 'Fred Spanner'
      }

      expect.assertions(1)
      mockingoose(Track).toReturn(trackObject, 'updateOne')
      const demoUris = ['123', '456']
      jest.spyOn(global, 'Date').mockImplementation(() => fakeDate)
      addTracks(demoUris, userObject).then((uris) => {
        setTimeout(() => {
          try {
            expect(uris).toEqual(demoUris)
            done()
          } catch (err) {
            done.fail(err)
          }
        })
      })
    })

    it('returns the uris and uses BRH', done => {
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
      addTracks(demoUris, null).then((uris) => {
        setTimeout(() => {
          try {
            expect(uris).toEqual(demoUris)
            done()
          } catch (err) {
            done.fail(err)
          }
        })
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
      mockingoose(Track).toReturn(new Error('updateOne Track Fail'), 'updateOne')
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
})
