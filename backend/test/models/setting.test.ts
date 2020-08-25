import Mopidy from 'mopidy'
import logger from '../../src/config/logger'
import Setting, {
  addToTrackSeedList,
  initializeState,
  clearState,
  trimTracklist,
  updateCurrentTrack,
  updateTracklist,
  removeFromSeeds,
  getSeedTracks,
  getTracklist,
  DBSettingValueInterface
} from '../../src/models/setting'
import { JBTrackInterface } from '../../src/models/track'
jest.mock('../../src/config/logger')

describe('test mongoose Settings model', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('initializeState', () => {
    it('sets state as expected', async () => {
      expect.assertions(1)
      jest
        .spyOn(Setting.collection, 'findOneAndReplace')
        .mockResolvedValue(undefined as never)
      const currentTrack = { uri: 'uri123' } as Mopidy.models.Track
      const currentTracklist = [currentTrack]

      await initializeState(currentTrack, currentTracklist)
      expect(Setting.collection.findOneAndReplace).toHaveBeenCalledWith(
        { key: 'state' },
        {
          key: 'state',
          value: {
            currentTrack: 'uri123',
            currentTracklist: ['uri123'],
            trackSeeds: []
          }
        },
        { runValidators: true, setDefaultsOnInsert: true, upsert: true }
      )
    })

    it('handles no current track', async () => {
      expect.assertions(1)
      jest
        .spyOn(Setting.collection, 'findOneAndReplace')
        .mockResolvedValue(undefined as never)

      await initializeState(null, [])
      expect(Setting.collection.findOneAndReplace).toHaveBeenCalledWith(
        { key: 'state' },
        {
          key: 'state',
          value: { currentTrack: null, currentTracklist: [], trackSeeds: [] }
        },
        { runValidators: true, setDefaultsOnInsert: true, upsert: true }
      )
    })

    it('handles errors', () => {
      expect.assertions(2)
      jest
        .spyOn(Setting.collection, 'findOneAndReplace')
        .mockRejectedValue(new Error('boom') as never)
      const currentTrack = { uri: 'uri123' } as Mopidy.models.Track
      const currentTracklist = [currentTrack]

      initializeState(currentTrack, currentTracklist)

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(Setting.collection.findOneAndReplace).toHaveBeenCalledWith(
            { key: 'state' },
            {
              key: 'state',
              value: {
                currentTrack: 'uri123',
                currentTracklist: ['uri123'],
                trackSeeds: []
              }
            },
            { runValidators: true, setDefaultsOnInsert: true, upsert: true }
          )
          expect(logger.error).toHaveBeenCalledWith('initializeState: boom')
          resolve()
        }, 0)
      })
    })
  })

  describe('clearState', () => {
    it('sets state as expected', async () => {
      expect.assertions(1)
      jest
        .spyOn(Setting.collection, 'findOneAndReplace')
        .mockResolvedValue(undefined as never)

      await clearState()
      expect(Setting.collection.findOneAndReplace).toHaveBeenCalledWith(
        { key: 'state' },
        { key: 'state' },
        { runValidators: true, setDefaultsOnInsert: true, upsert: true }
      )
    })

    it('handles errors', () => {
      expect.assertions(2)
      jest
        .spyOn(Setting.collection, 'findOneAndReplace')
        .mockRejectedValue(new Error('boom') as never)

      clearState()

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(Setting.collection.findOneAndReplace).toHaveBeenCalledWith(
            { key: 'state' },
            { key: 'state' },
            { runValidators: true, setDefaultsOnInsert: true, upsert: true }
          )
          expect(logger.error).toHaveBeenCalledWith('clearState: boom')
          resolve()
        }, 0)
      })
    })
  })

  describe('addToTrackSeedList', () => {
    it('sets state as expected', async () => {
      const result = { trackSeeds: [] } as DBSettingValueInterface
      const findOnReturn = {
        value: result,
        markModified: jest.fn(),
        save: jest.fn().mockResolvedValue(true)
      }
      expect.assertions(2)
      jest.spyOn(Setting, 'findOne').mockResolvedValue(findOnReturn as any)
      const track = {
        uri: 'uri123',
        metrics: {
          votesAverage: 50,
          votes: 10,
          plays: 10
        }
      } as JBTrackInterface

      const uri = await addToTrackSeedList(track)
      expect(Setting.findOne).toHaveBeenCalledWith({ key: 'state' })
      expect(uri).toEqual('uri123')
    })

    it('returns when average < 0', async () => {
      expect.assertions(1)
      const track = {
        uri: 'uri123',
        metrics: {
          votesAverage: 10,
          votes: 10,
          plays: 10
        }
      } as JBTrackInterface

      const uri = await addToTrackSeedList(track)
      expect(uri).not.toBeDefined()
    })

    it('returns when votes < 1', async () => {
      expect.assertions(1)
      const track = {
        uri: 'uri123',
        metrics: {
          votesAverage: 50,
          votes: 0,
          plays: 10
        }
      } as JBTrackInterface

      const uri = await addToTrackSeedList(track)
      expect(uri).not.toBeDefined()
    })

    it('handles errors', () => {
      expect.assertions(2)
      jest.spyOn(Setting, 'findOne').mockRejectedValue(new Error('boom'))
      const track = {
        uri: 'uri123',
        metrics: {
          votesAverage: 50,
          votes: 10
        }
      } as JBTrackInterface

      addToTrackSeedList(track)

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(Setting.findOne).toHaveBeenCalledWith({ key: 'state' })
          expect(logger.error).toHaveBeenCalledWith('addToTrackSeedList: boom')
          resolve()
        })
      })
    })
  })

  describe('trimTracklist', () => {
    it('updates tracklist', async () => {
      expect.assertions(2)
      const mopidyMock = {
        tracklist: {
          remove: jest.fn().mockResolvedValue(true)
        }
      } as unknown
      const currentTrack = 'uri123'
      const currentTracklist = ['uri1', 'uri2', 'uri3', 'uri4', 'uri5', 'uri123', 'uri6']
      const state = { value: { currentTrack, currentTracklist } }
      jest.spyOn(Setting, 'findOne').mockResolvedValue(state as any)
      jest.spyOn(Setting, 'findOneAndUpdate').mockResolvedValue(undefined)

      await trimTracklist(mopidyMock as Mopidy)
      expect(Setting.findOne).toHaveBeenCalledWith({ key: 'state' })
      expect(Setting.findOneAndUpdate).toHaveBeenCalledWith(
        { key: 'state' },
        {
          $set: {
            'value.currentTracklist': ['uri2', 'uri3', 'uri4', 'uri5', 'uri123', 'uri6']
          }
        },
        { runValidators: true, setDefaultsOnInsert: true, upsert: true }
      )
    })

    it('skips updating tracklist', async () => {
      expect.assertions(2)
      const mopidyMock = {
        tracklist: {
          remove: jest.fn().mockResolvedValue(true)
        }
      } as unknown
      const currentTrack = 'uri123'
      const currentTracklist = ['uri1', 'uri5', 'uri123', 'uri6']
      const state = { value: { currentTrack, currentTracklist } }
      jest.spyOn(Setting, 'findOne').mockResolvedValue(state as any)
      jest.spyOn(Setting, 'findOneAndUpdate').mockResolvedValue(undefined)

      await trimTracklist(mopidyMock as Mopidy)
      expect(Setting.findOne).toHaveBeenCalledWith({ key: 'state' })
      expect(Setting.findOneAndUpdate).not.toHaveBeenCalled()
    })

    it('handles errors', () => {
      expect.assertions(2)
      const mopidyMock = jest.fn() as unknown
      jest.spyOn(Setting, 'findOne').mockRejectedValue(new Error('boom'))

      trimTracklist(mopidyMock as Mopidy)

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(Setting.findOne).toHaveBeenCalledWith({ key: 'state' })
          expect(logger.error).toHaveBeenCalledWith('trimTracklist: boom')
          resolve()
        }, 0)
      })
    })
  })

  describe('updateCurrentTrack', () => {
    it('sets state as expected', async () => {
      expect.assertions(2)
      const uri = 'uri123'
      jest.spyOn(Setting, 'findOneAndUpdate').mockResolvedValue(undefined)

      const response = await updateCurrentTrack(uri)
      expect(Setting.findOneAndUpdate).toHaveBeenCalledWith(
        { key: 'state' },
        { $set: { 'value.currentTrack': 'uri123' } },
        { runValidators: true, setDefaultsOnInsert: true, upsert: true }
      )
      expect(response).toEqual('uri123')
    })

    it('handles errors', () => {
      expect.assertions(2)
      const uri = 'uri123'
      jest.spyOn(Setting, 'findOneAndUpdate').mockRejectedValue(new Error('boom'))

      updateCurrentTrack(uri)

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(Setting.findOneAndUpdate).toHaveBeenCalledWith(
            { key: 'state' },
            { $set: { 'value.currentTrack': 'uri123' } },
            { runValidators: true, setDefaultsOnInsert: true, upsert: true }
          )
          expect(logger.error).toHaveBeenCalledWith('updateCurrentTrack: boom')
          resolve()
        }, 0)
      })
    })
  })

  describe('updateTracklist', () => {
    it('sets state as expected', async () => {
      expect.assertions(2)
      const uris = ['uri123']
      jest.spyOn(Setting, 'findOneAndUpdate').mockResolvedValue(undefined)

      const response = await updateTracklist(uris)
      expect(Setting.findOneAndUpdate).toHaveBeenCalledWith(
        { key: 'state' },
        { $set: { 'value.currentTracklist': ['uri123'] } },
        { runValidators: true, setDefaultsOnInsert: true, upsert: true }
      )
      expect(response).toEqual(['uri123'])
    })

    it('handles errors', () => {
      expect.assertions(2)
      const uris = ['uri123']
      jest.spyOn(Setting, 'findOneAndUpdate').mockRejectedValue(new Error('boom'))

      updateTracklist(uris)

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(Setting.findOneAndUpdate).toHaveBeenCalledWith(
            { key: 'state' },
            { $set: { 'value.currentTracklist': ['uri123'] } },
            { runValidators: true, setDefaultsOnInsert: true, upsert: true }
          )
          expect(logger.error).toHaveBeenCalledWith('updateTracklist: boom')
          resolve()
        }, 0)
      })
    })
  })

  describe('removeFromSeeds', () => {
    it('sets state as expected', async () => {
      expect.assertions(2)
      const uri = 'uri123'
      jest.spyOn(Setting, 'findOneAndUpdate').mockResolvedValue(undefined)

      const response = await removeFromSeeds(uri)
      expect(Setting.findOneAndUpdate).toHaveBeenCalledWith(
        { key: 'state' },
        { $pull: { 'value.trackSeeds': 'uri123' } },
        { runValidators: true, setDefaultsOnInsert: true, upsert: true }
      )
      expect(response).toEqual('uri123')
    })

    it('handles errors', () => {
      expect.assertions(2)
      const uri = 'uri123'
      jest.spyOn(Setting, 'findOneAndUpdate').mockRejectedValue(new Error('boom'))

      removeFromSeeds(uri)

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(Setting.findOneAndUpdate).toHaveBeenCalledWith(
            { key: 'state' },
            { $pull: { 'value.trackSeeds': 'uri123' } },
            { runValidators: true, setDefaultsOnInsert: true, upsert: true }
          )
          expect(logger.error).toHaveBeenCalledWith('removeFromSeeds: boom')
          resolve()
        }, 0)
      })
    })
  })

  describe('getSeedTracks', () => {
    it('sets state as expected', async () => {
      expect.assertions(2)
      jest.spyOn(Setting, 'findOne').mockResolvedValue({
        value: {
          trackSeeds: ['uri123']
        }
      } as any)

      const response = await getSeedTracks()
      expect(Setting.findOne).toHaveBeenCalledWith({ key: 'state' })
      expect(response).toEqual(['uri123'])
    })

    it('handles no results', async () => {
      expect.assertions(2)
      jest.spyOn(Setting, 'findOne').mockResolvedValue({
        value: {
          trackSeeds: null
        }
      } as any)

      const response = await getSeedTracks()
      expect(Setting.findOne).toHaveBeenCalledWith({ key: 'state' })
      expect(response).toEqual([])
    })

    it('handles errors', () => {
      expect.assertions(2)
      jest.spyOn(Setting, 'findOne').mockRejectedValue(new Error('boom'))

      getSeedTracks()

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(Setting.findOne).toHaveBeenCalledWith({ key: 'state' })
          expect(logger.error).toHaveBeenCalledWith('getSeedTracks: boom')
          resolve()
        }, 0)
      })
    })
  })

  describe('getTracklist', () => {
    it('sets state as expected', async () => {
      expect.assertions(2)
      jest.spyOn(Setting, 'findOne').mockResolvedValue({
        value: {
          currentTracklist: ['uri123']
        }
      } as any)

      const response = await getTracklist()
      expect(Setting.findOne).toHaveBeenCalledWith({ key: 'state' })
      expect(response).toEqual(['uri123'])
    })

    it('handles no result', async () => {
      expect.assertions(2)
      jest.spyOn(Setting, 'findOne').mockResolvedValue({
        value: {
          currentTracklist: null
        }
      } as any)

      const response = await getTracklist()
      expect(Setting.findOne).toHaveBeenCalledWith({ key: 'state' })
      expect(response).toEqual([])
    })

    it('handles errors', () => {
      expect.assertions(2)
      jest.spyOn(Setting, 'findOne').mockRejectedValue(new Error('boom'))

      getTracklist()

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(Setting.findOne).toHaveBeenCalledWith({ key: 'state' })
          expect(logger.error).toHaveBeenCalledWith('getTracklist: boom')
          resolve()
        }, 0)
      })
    })
  })
})
