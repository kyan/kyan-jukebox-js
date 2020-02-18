import VotingHelper from './index'

describe('VotingHelper', () => {
  beforeEach(() => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => 1582020703141)
  })

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
      const data = [
        { votes: [1, 2, 3, 4, 5] }
      ]

      expect(VotingHelper.calcVoteCount(data)).toEqual(5)
    })

    it('should handle no data', () => {
      const data = []

      expect(VotingHelper.calcVoteCount(data)).toEqual(0)
    })
  })

  describe('calcVoteTotal', () => {
    it('should handle data', () => {
      const data = [
        {
          votes: [
            { vote: 10 },
            { vote: 20 },
            { vote: 30 },
            { vote: 40 }
          ]
        }
      ]

      expect(VotingHelper.calcVoteTotal(data)).toEqual(100)
    })

    it('should handle no data', () => {
      const data = []

      expect(VotingHelper.calcVoteTotal(data)).toEqual(0)
    })
  })

  describe('calcVoteAverage', () => {
    it('should handle data', () => {
      const data = [
        {
          votes: [
            { vote: 10 },
            { vote: 20 },
            { vote: 30 },
            { vote: 40 }
          ]
        }
      ]

      expect(VotingHelper.calcVoteAverage(data)).toEqual(25)
    })

    it('should handle no data', () => {
      const data = []

      expect(VotingHelper.calcVoteAverage(data)).toEqual(0)
    })
  })

  describe('calcWeightedMean', () => {
    it('should handle data', () => {
      const data = [
        {
          votes: [
            { vote: 90, at: '2020-02-05T17:08:27.000Z' },
            { vote: 80, at: '2019-08-04T17:08:27.000Z' },
            { vote: 10, at: '2019-02-03T17:08:27.000Z' },
            { vote: 10, at: '2018-08-02T17:08:27.000Z' }
          ]
        },
        {
          votes: [
            { vote: 10, at: '2020-02-06T17:08:27.000Z' },
            { vote: 10, at: '2020-02-07T17:08:27.000Z' },
            { vote: 10, at: '2018-08-08T17:08:27.000Z' },
            { vote: 60, at: '2018-08-08T17:08:27.000Z' },
            { vote: 40, at: '2016-08-09T17:08:27.000Z' }
          ]
        }
      ]

      expect(VotingHelper.calcWeightedMean(data)).toEqual(44)
    })

    it('should handle no data', () => {
      const data = []

      expect(VotingHelper.calcWeightedMean(data)).toEqual(0)
    })
  })
})
