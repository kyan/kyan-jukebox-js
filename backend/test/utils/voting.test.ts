import VotingHelper from '../../src/utils/voting'
import { JBAddedBy, JBVotes } from '../../src/types/database'
import { expect, test, describe, spyOn, afterEach } from 'bun:test'

describe('VotingHelper', () => {
  afterEach(() => {
    // Clear individual mocks as needed
  })

  describe('voteNormalised', () => {
    test('should handle data', () => {
      expect(VotingHelper.voteNormalised(2)).toEqual(20)
    })
  })

  describe('calcVoteCount', () => {
    test('should handle data', () => {
      const vote1 = { vote: 1 } as JBVotes
      const vote2 = { vote: 3 } as JBVotes
      const vote3 = { vote: 4 } as JBVotes
      const addBy = {
        votes: [vote1, vote2, vote3]
      } as JBAddedBy
      const data: JBAddedBy[] = [addBy]

      expect(VotingHelper.calcVoteCount(data)).toEqual(3)
    })

    test('should handle no data', () => {
      const data: JBAddedBy[] = []

      expect(VotingHelper.calcVoteCount(data)).toEqual(0)
    })
  })

  describe('calcVoteTotal', () => {
    test('should handle data', () => {
      const vote1 = { vote: 10 } as JBVotes
      const vote2 = { vote: 20 } as JBVotes
      const vote3 = { vote: 30 } as JBVotes
      const vote4 = { vote: 40 } as JBVotes
      const addBy = {
        votes: [vote1, vote2, vote3, vote4]
      } as JBAddedBy
      const data = [addBy]

      expect(VotingHelper.calcVoteTotal(data)).toEqual(100)
    })

    test('should handle no data', () => {
      const data: JBAddedBy[] = []

      expect(VotingHelper.calcVoteTotal(data)).toEqual(0)
    })
  })

  describe('calcVoteAverage', () => {
    test('should handle data', () => {
      const vote1 = { vote: 10 } as JBVotes
      const vote2 = { vote: 20 } as JBVotes
      const vote3 = { vote: 30 } as JBVotes
      const vote4 = { vote: 40 } as JBVotes
      const addBy = {
        votes: [vote1, vote2, vote3, vote4]
      } as JBAddedBy
      const data = [addBy]

      expect(VotingHelper.calcVoteAverage(data)).toEqual(25)
    })

    test('should handle no data', () => {
      const data: JBAddedBy[] = []

      expect(VotingHelper.calcVoteAverage(data)).toEqual(0)
    })
  })

  describe('calcWeightedMean', () => {
    test('should handle an above mid average', () => {
      const vote1 = {
        vote: 90,
        at: new Date('2020-02-05T17:08:27.000Z')
      } as JBVotes
      const vote2 = {
        vote: 80,
        at: new Date('2019-08-04T17:08:27.000Z')
      } as JBVotes
      const vote3 = {
        vote: 10,
        at: new Date('2019-02-03T17:08:27.000Z')
      } as JBVotes
      const vote4 = {
        vote: 10,
        at: new Date('2018-08-02T17:08:27.000Z')
      } as JBVotes
      const vote5 = {
        vote: 10,
        at: new Date('2020-02-06T17:08:27.000Z')
      } as JBVotes
      const vote6 = {
        vote: 100,
        at: new Date('2020-02-07T17:08:27.000Z')
      } as JBVotes
      const vote7 = {
        vote: 10,
        at: new Date('2018-08-08T17:08:27.000Z')
      } as JBVotes
      const vote8 = {
        vote: 60,
        at: new Date('2018-08-08T17:08:27.000Z')
      } as JBVotes
      const vote9 = {
        vote: 40,
        at: new Date('2016-08-09T17:08:27.000Z')
      } as JBVotes
      const addBy1 = {
        votes: [vote1, vote2, vote3, vote4]
      } as JBAddedBy
      const addBy2 = {
        votes: [vote5, vote6, vote7, vote8, vote9]
      } as JBAddedBy
      const data = [addBy1, addBy2]
      const mockDate = new Date(1582020703141)

      // @ts-ignore
      spyOn(global, 'Date').mockImplementation(() => mockDate)
      expect(VotingHelper.calcWeightedMean(data)).toEqual(54)
    })

    test('should handle a below mid average', () => {
      const vote1 = {
        vote: 90,
        at: new Date('2020-02-05T17:08:27.000Z')
      } as JBVotes
      const vote2 = {
        vote: 80,
        at: new Date('2019-08-04T17:08:27.000Z')
      } as JBVotes
      const vote3 = {
        vote: 10,
        at: new Date('2019-02-03T17:08:27.000Z')
      } as JBVotes
      const vote4 = {
        vote: 10,
        at: new Date('2018-08-02T17:08:27.000Z')
      } as JBVotes
      const vote5 = {
        vote: 10,
        at: new Date('2020-02-06T17:08:27.000Z')
      } as JBVotes
      const vote6 = {
        vote: 100,
        at: new Date('2020-02-07T17:08:27.000Z')
      } as JBVotes
      const vote7 = {
        vote: 10,
        at: new Date('2018-08-08T17:08:27.000Z')
      } as JBVotes
      const vote8 = {
        vote: 60,
        at: new Date('2018-08-08T17:08:27.000Z')
      } as JBVotes
      const vote9 = {
        vote: 40,
        at: new Date('2016-08-09T17:08:27.000Z')
      } as JBVotes
      const addBy1 = {
        votes: [vote1, vote2, vote3, vote4]
      } as JBAddedBy
      const addBy2 = {
        votes: [vote5, vote6, vote7, vote8, vote9]
      } as JBAddedBy
      const data = [addBy1, addBy2]
      const mockDate = new Date(1782020703141)

      // @ts-ignore
      spyOn(global, 'Date').mockImplementation(() => mockDate)
      expect(VotingHelper.calcWeightedMean(data)).toEqual(46)
    })

    test('should handle no data', () => {
      const data: JBAddedBy[] = []

      expect(VotingHelper.calcWeightedMean(data)).toEqual(0)
    })
  })
})
