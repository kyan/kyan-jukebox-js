import Setting from 'services/mongodb/models/setting'
import logger from 'config/logger'
import ta from 'time-ago'

const slackFind = { key: 'slack' }
const options = { upsert: true, runValidators: true, setDefaultsOnInsert: true }
const voteNormaliser = (v) => Math.round((v / 10) - 5) // 100 is max a user can vote per play
const simplePluralize = (count, noun, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`
const lastPlayed = (addedBy) => {
  return {
    type: 'mrkdwn',
    text: `*Last Played:* ${ta.ago(addedBy.addedAt)}`
  }
}

const NowPlaying = {
  addTrack: (track) => {
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
                text: `Added by ${track.addedBy[0].user.fullname} ${ta.ago(track.addedBy[0].addedAt)}`
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
