import Setting from '../models/setting'
import { JBTrackInterface, JBAddedByInterface } from '../models/track'
import logger from '../config/logger'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)

const slackFind = { key: 'slack' }
const options = { upsert: true, runValidators: true, setDefaultsOnInsert: true }
const voteNormaliser = (v: number) => Math.round((v / 10) - 5) // 100 is max a user can vote per play
const simplePluralize = (count: number, noun: string, suffix = 's') => {
  return `${count} ${noun}${count !== 1 ? suffix : ''}`
}
const timeAgo = new TimeAgo('en-GB')
const lastPlayed = (addedBy: JBAddedByInterface) => {
  return {
    type: 'mrkdwn',
    text: `*Last Played:* ${timeAgo.format(addedBy.addedAt)}`
  }
}

const NowPlaying = {
  addTrack: (track: JBTrackInterface) => {
    return new Promise((resolve) => {
      const metrics = [
        {
          type: 'mrkdwn',
          text: `*Rating:* ${voteNormaliser(track.metrics.votesAverage)}`
        },
        {
          type: 'mrkdwn',
          text: `*Voted by:* ${simplePluralize(track.metrics.votes, 'user')}`
        },
        {
          type: 'mrkdwn',
          text: `*Played:* ${simplePluralize(track.metrics.plays, 'time')}`
        }
      ]
      if (track.addedBy[1]) metrics.push(lastPlayed(track.addedBy[1]))

      const payload = {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Now Playing:'
            }
          },
          {
            type: 'divider'
          },
          {
            type: 'section',
            block_id: 'section1',
            text: {
              type: 'mrkdwn',
              text: `*${track.name}* \n ${track.artist.name} \n ${track.album.name} (${track.year})`
            },
            accessory: {
              type: 'image',
              image_url: track.image,
              alt_text: track.artist.name
            }
          },
          {
            type: 'divider'
          },
          {
            type: 'section',
            block_id: 'section2',
            fields: metrics
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Added by ${track.addedBy[0].user.fullname} ${timeAgo.format(track.addedBy[0].addedAt)}`
              }
            ]
          }
        ]
      }

      const updateValue = { $set: { 'value.currentTrack': payload } }
      return Setting.findOneAndUpdate(slackFind, updateValue, options)
        .then(() => resolve(payload))
        .catch((error) => logger.error(`NowPlaying.addTrack: ${error.message}`))
    })
  }
}

export default NowPlaying
