import VotingHelper from '../../src/utils/voting'
import { JBAddedByInterface, JBVotesInterface } from '../../src/models/track'

describe('VotingHelper', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('voteNormalised', () => {
    it('should handle data', () => {
      expect(VotingHelper.voteNormalised(2)).toEqual(20)
    })
  })

  describe('calcVoteCount', () => {
    it('should handle data', () => {
      const vote1 = { vote: 1 } as JBVotesInterface
      const vote2 = { vote: 3 } as JBVotesInterface
      const vote3 = { vote: 4 } as JBVotesInterface
      const addBy = {
        votes: [vote1, vote2, vote3]
      } as JBAddedByInterface
      const data: JBAddedByInterface[] = [addBy]

      expect(VotingHelper.calcVoteCount(data)).toEqual(3)
    })

    it('should handle no data', () => {
      const data: JBAddedByInterface[] = []

      expect(VotingHelper.calcVoteCount(data)).toEqual(0)
    })
  })

  describe('calcVoteTotal', () => {
    it('should handle data', () => {
      const vote1 = { vote: 10 } as JBVotesInterface
      const vote2 = { vote: 20 } as JBVotesInterface
      const vote3 = { vote: 30 } as JBVotesInterface
      const vote4 = { vote: 40 } as JBVotesInterface
      const addBy = {
        votes: [vote1, vote2, vote3, vote4]
      } as JBAddedByInterface
      const data = [addBy]

      expect(VotingHelper.calcVoteTotal(data)).toEqual(100)
    })

    it('should handle no data', () => {
      const data: JBAddedByInterface[] = []

      expect(VotingHelper.calcVoteTotal(data)).toEqual(0)
    })
  })

  describe('calcVoteAverage', () => {
    it('should handle data', () => {
      const vote1 = { vote: 10 } as JBVotesInterface
      const vote2 = { vote: 20 } as JBVotesInterface
      const vote3 = { vote: 30 } as JBVotesInterface
      const vote4 = { vote: 40 } as JBVotesInterface
      const addBy = {
        votes: [vote1, vote2, vote3, vote4]
      } as JBAddedByInterface
      const data = [addBy]

      expect(VotingHelper.calcVoteAverage(data)).toEqual(25)
    })

    it('should handle no data', () => {
      const data: JBAddedByInterface[] = []

      expect(VotingHelper.calcVoteAverage(data)).toEqual(0)
    })
  })

  describe('calcWeightedMean', () => {
    it('should handle an above mid average', () => {
      const vote1 = {
        vote: 90,
        at: new Date('2020-02-05T17:08:27.000Z')
      } as JBVotesInterface
      const vote2 = {
        vote: 80,
        at: new Date('2019-08-04T17:08:27.000Z')
      } as JBVotesInterface
      const vote3 = {
        vote: 10,
        at: new Date('2019-02-03T17:08:27.000Z')
      } as JBVotesInterface
      const vote4 = {
        vote: 10,
        at: new Date('2018-08-02T17:08:27.000Z')
      } as JBVotesInterface
      const vote5 = {
        vote: 10,
        at: new Date('2020-02-06T17:08:27.000Z')
      } as JBVotesInterface
      const vote6 = {
        vote: 100,
        at: new Date('2020-02-07T17:08:27.000Z')
      } as JBVotesInterface
      const vote7 = {
        vote: 10,
        at: new Date('2018-08-08T17:08:27.000Z')
      } as JBVotesInterface
      const vote8 = {
        vote: 60,
        at: new Date('2018-08-08T17:08:27.000Z')
      } as JBVotesInterface
      const vote9 = {
        vote: 40,
        at: new Date('2016-08-09T17:08:27.000Z')
      } as JBVotesInterface
      const addBy1 = {
        votes: [vote1, vote2, vote3, vote4]
      } as JBAddedByInterface
      const addBy2 = {
        votes: [vote5, vote6, vote7, vote8, vote9]
      } as JBAddedByInterface
      const data = [addBy1, addBy2]
      const mockDate = new Date(1582020703141)

      // @ts-ignore
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
      expect(VotingHelper.calcWeightedMean(data)).toEqual(54)
    })

    it('should handle a below mid average', () => {
      const vote1 = {
        vote: 90,
        at: new Date('2020-02-05T17:08:27.000Z')
      } as JBVotesInterface
      const vote2 = {
        vote: 80,
        at: new Date('2019-08-04T17:08:27.000Z')
      } as JBVotesInterface
      const vote3 = {
        vote: 10,
        at: new Date('2019-02-03T17:08:27.000Z')
      } as JBVotesInterface
      const vote4 = {
        vote: 10,
        at: new Date('2018-08-02T17:08:27.000Z')
      } as JBVotesInterface
      const vote5 = {
        vote: 10,
        at: new Date('2020-02-06T17:08:27.000Z')
      } as JBVotesInterface
      const vote6 = {
        vote: 100,
        at: new Date('2020-02-07T17:08:27.000Z')
      } as JBVotesInterface
      const vote7 = {
        vote: 10,
        at: new Date('2018-08-08T17:08:27.000Z')
      } as JBVotesInterface
      const vote8 = {
        vote: 60,
        at: new Date('2018-08-08T17:08:27.000Z')
      } as JBVotesInterface
      const vote9 = {
        vote: 40,
        at: new Date('2016-08-09T17:08:27.000Z')
      } as JBVotesInterface
      const addBy1 = {
        votes: [vote1, vote2, vote3, vote4]
      } as JBAddedByInterface
      const addBy2 = {
        votes: [vote5, vote6, vote7, vote8, vote9]
      } as JBAddedByInterface
      const data = [addBy1, addBy2]
      const mockDate = new Date(1782020703141)

      // @ts-ignore
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
      expect(VotingHelper.calcWeightedMean(data)).toEqual(46)
    })

    it('should handle no data', () => {
      const data: JBAddedByInterface[] = []

      expect(VotingHelper.calcWeightedMean(data)).toEqual(0)
    })
  })
})
