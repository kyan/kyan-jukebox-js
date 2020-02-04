import Vote from 'votes/constants'

export const vote = (uri, vote) => {
  return {
    type: Vote.VOTE,
    key: Vote.CAST_VOTE,
    params: { uri, vote }
  }
}
