import lodash from 'lodash'
import { JBAddedByInterface } from '../models/track'
const { flatten, mean, sumBy } = lodash

const VOTE_NORMALISER = 10 as const // asuming a vote comes in as 1-10
const AVERAGE_WEIGHT_DISTANCE_IN_MONTHS = 6.0
const AVERAGE_WEIGHT_DECIMALIZER = 10.0
const MAX_SCORE = 100

const VotingHelper = {
  voteNormalised: (vote: number): number => vote * VOTE_NORMALISER,

  calcVoteCount: (data: JBAddedByInterface[]): number => {
    return sumBy(data, i => i.votes.length)
  },

  calcVoteTotal: (data: JBAddedByInterface[]): number => {
    return sumBy(data, i => sumBy(i.votes, v => v.vote))
  },

  calcVoteAverage: (data: JBAddedByInterface[]): number => {
    const votes = data.map(i => i.votes.map(j => j.vote))
    return (votes.length > 0) ? mean(flatten(votes)) : 0
  },

  calcWeightedMean: (data: JBAddedByInterface[]): number => {
    if (data.length < 1) return 0
    const today = new Date().getTime()
    const diffInMonths = (e: number, s: number) => Math.round(Math.abs(e - s) / (2e3 * 3600 * 365.25))
    const votes = flatten(data.map(i => i.votes.map(vote => vote)))
    const arrWeights = votes.map(v => {
      const diff = diffInMonths(v.at.getTime(), today)
      return diff / AVERAGE_WEIGHT_DISTANCE_IN_MONTHS * AVERAGE_WEIGHT_DECIMALIZER
    })
    const results = votes.map(v => v.vote)
      .map((value, i) => {
        const weight = arrWeights[i]
        const midPoint = MAX_SCORE / 2

        if (value <= midPoint) {
          const sum = value + weight
          return sum > midPoint ? midPoint : sum
        } else {
          const sum = value - weight
          return sum < midPoint ? midPoint : sum
        }
      })

    return Math.round(sumBy(results) / results.length)
  }
}

export default VotingHelper
