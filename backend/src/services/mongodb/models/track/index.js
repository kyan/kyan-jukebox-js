import mongoose from 'mongoose'
import User from 'services/mongodb/models/user'
import EventLogger from 'utils/event-logger'
import logger from 'config/winston'
import VotingHelper from 'utils/voting'

const trackSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.String,
  addedBy: [{
    _id: false,
    user: { type: mongoose.Schema.Types.String, ref: 'User' },
    addedAt: mongoose.Schema.Types.Date,
    played: [{
      _id: false,
      at: mongoose.Schema.Types.Date
    }],
    votes: [{
      _id: false,
      user: { type: mongoose.Schema.Types.String, ref: 'User' },
      vote: mongoose.Schema.Types.Number,
      at: mongoose.Schema.Types.Date
    }]
  }],
  metrics: {
    _id: false,
    plays: { type: mongoose.Schema.Types.Number, default: 0 },
    votes: { type: mongoose.Schema.Types.Number, default: 0 },
    votesTotal: { type: mongoose.Schema.Types.Number, default: 0 },
    votesAverage: { type: mongoose.Schema.Types.Number, default: 0 }
  }
}, { _id: false })
const Track = mongoose.model('Track', trackSchema)

const brh = {
  _id: '1ambigrainbowhead',
  fullname: 'BRH',
  picture: 'https://cdn-images-1.medium.com/fit/c/200/200/1*bFBXYvskkPFI9nPx6Elwxg.png'
}

const findTracks = (uris) => {
  return new Promise((resolve, reject) => {
    Track.find({ _id: { $in: uris } })
      .populate({ path: 'addedBy.user' })
      .populate({ path: 'addedBy.votes.user' })
      .then(tracks => {
        if (tracks.length > 0) EventLogger.info('FOUND CACHED TRACKS', { data: uris })
        return resolve(tracks)
      })
      .catch(err => reject(err))
  })
}

const findOrUseBRH = (user) => {
  if (user) return Promise.resolve(user)

  return User.findOneAndUpdate(
    { _id: brh._id },
    brh,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}

const addTracks = (uris, user) => {
  return new Promise((resolve) => {
    findOrUseBRH(user).then((returnUser) => {
      const requests = uris.map((uri) => (
        Track.findOneAndUpdate(
          { _id: uri },
          { $push: { addedBy: { $each: [{ user: returnUser, addedAt: new Date() }], $position: 0 } } },
          { upsert: true, runValidators: true, setDefaultsOnInsert: true }
        ).exec()
      ))

      Promise.all(requests)
        .then(() => resolve({ uris, user: returnUser }))
        .catch((error) => logger.error('addTracks:Track.updateOne', { message: error.message }))
    }).catch((error) => logger.error('addTracks:findOrUseBRH', { message: error.message }))
  })
}

const updateTrackPlaycount = (uri) => {
  return new Promise((resolve) => {
    Track.findById(uri)
      .populate({ path: 'addedBy.user' })
      .populate({ path: 'addedBy.votes.user' })
      .then((track) => {
        if (track && track.addedBy[0]) {
          track.addedBy[0].played.unshift({ at: new Date() })
          track.metrics.plays = track.metrics.plays + 1
          return track.save()
        }

        return Promise.resolve(track)
      })
      .then((track) => resolve(track))
      .catch((error) => logger.error('updateTrackPlaycount', { message: error.message }))
  })
}

const updateTrackVote = (uri, user, vote) => {
  return new Promise((resolve) => {
    findOrUseBRH(user).then((returnUser) => {
      Track.findById(uri)
        .populate({ path: 'addedBy.user' })
        .populate({ path: 'addedBy.votes.user' })
        .then((track) => {
          if (track && track.addedBy[0]) {
            const currentVote = VotingHelper.voteNormalised(vote)
            const currentVoteData = { _id: false, at: new Date(), vote: currentVote, user: returnUser }
            const votes = track.addedBy[0].votes
            const currentVoteIndex = votes.findIndex(vote => vote.user._id === returnUser._id)

            if (currentVoteIndex !== -1) {
              votes[currentVoteIndex].vote = currentVote
            } else {
              votes.unshift(currentVoteData)
              track.metrics.votes = VotingHelper.calcVoteCount(track.addedBy)
            }
            track.metrics.votesTotal = VotingHelper.calcVoteTotal(track.addedBy)
            track.metrics.votesAverage = VotingHelper.calcVoteAverage(track.addedBy)

            return track.save()
          }

          return Promise.resolve(track)
        })
        .then((track) => resolve({ uri: track.id, addedBy: track.addedBy, metrics: track.metrics }))
        .catch((error) => logger.error('updateTrackVote:findById', { message: error.message }))
    }).catch((error) => logger.error('updateTrackVote:findOrUseBRH', { message: error.message }))
  })
}

export default Track
export { findTracks, addTracks, updateTrackPlaycount, updateTrackVote }
