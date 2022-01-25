import Setting from '../models/setting'
import { JBTrack } from '../models/track'
import logger from '../config/logger'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)

// This is the Settings key where we store any JSON
const slackFind = { key: 'json' }
const options = { upsert: true, runValidators: true, setDefaultsOnInsert: true }
const timeAgo = new TimeAgo('en-GB')
const voteNormaliser = (v: number) => Math.round(v / 10 - 5) // 100 is max a user can vote per play
const spotifyLink = (uri: string) => {
  const code = uri.split(':').pop()
  return `https://open.spotify.com/track/${code}`
}

const NowPlaying = {
  addTrack: (track: JBTrack): Promise<unknown> => {
    return new Promise((resolve) => {
      const payload: unknown = {
        spotify: spotifyLink(track.uri),
        title: track.name,
        artist: track.artist.name,
        album: track.album.name,
        year: track.year,
        image: track.image,
        metrics: {
          rating: voteNormaliser(track.metrics.votesAverage),
          votes: track.metrics.votes,
          plays: track.metrics.plays
        },
        added_by: track.addedBy[0].user.fullname,
        added_at: timeAgo.format(track.addedBy[0].addedAt),
        last_played: track.addedBy[1] ? timeAgo.format(track.addedBy[1].addedAt) : null
      }

      const updateValue = { $set: { 'value.currentTrack': payload } }
      return Setting.findOneAndUpdate(slackFind, updateValue, options)
        .then(() => resolve(payload))
        .catch((error) => logger.error(`NowPlaying.addTrack: ${error.message}`))
    })
  }
}

export default NowPlaying
