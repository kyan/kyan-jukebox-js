import { Schema, model, Document, DocumentQuery } from 'mongoose'
import User, { DBUserInterface, JBUserInterface } from '../models/user'
import EventLogger from '../utils/event-logger'
import logger from '../config/logger'
import VotingHelper from '../utils/voting'

export interface JBArtistInterface {
  uri: string
  name: string
}

export interface JBAlbumInterface {
  uri: string
  name: string
  year: string
}

export interface JBVotesInterface {
  user: DBUserInterface
  vote: number
  at: Date
}

export interface JBPlayedInterface {
  at: Date
}

export interface JBAddedByInterface {
  user: DBUserInterface
  addedAt: Date
  played: JBPlayedInterface[]
  votes: JBVotesInterface[]
}

export interface JBTrackInterface {
  uri: string
  name: string
  length: number
  year?: string
  image?: string
  album?: JBAlbumInterface
  artist?: JBArtistInterface
  addedBy?: any
  metrics?: any
  explicit?: boolean
}

interface DBMetricsInterface {
  plays: number
  votes: number
  votesTotal: number
  votesAverage: number
}

type PromiseLikeDBUser = Promise<DBUserInterface> | DocumentQuery<DBUserInterface, DBUserInterface>

export interface DBTrackInterface extends Document {
  _id: any
  addedBy: JBAddedByInterface[]
  metrics: DBMetricsInterface
}

const trackSchema = new Schema({
  _id: Schema.Types.String,
  addedBy: [{
    _id: false,
    user: { type: Schema.Types.String, ref: 'User' },
    addedAt: Schema.Types.Date,
    played: [{
      _id: false,
      at: Schema.Types.Date
    }],
    votes: [{
      _id: false,
      user: { type: Schema.Types.String, ref: 'User' },
      vote: Schema.Types.Number,
      at: Schema.Types.Date
    }]
  }],
  metrics: {
    _id: false,
    plays: { type: Schema.Types.Number, default: 0 },
    votes: { type: Schema.Types.Number, default: 0 },
    votesTotal: { type: Schema.Types.Number, default: 0 },
    votesAverage: { type: Schema.Types.Number, default: 0 }
  }
}, { _id: false })
const Track = model<DBTrackInterface>('Track', trackSchema)

const brh = {
  _id: '1ambigrainbowhead',
  fullname: 'BRH',
  picture: 'https://cdn-images-1.medium.com/fit/c/200/200/1*bFBXYvskkPFI9nPx6Elwxg.png'
}

const findTracks = (uris: string[]): Promise<DBTrackInterface[]> => (
  new Promise((resolve, reject) => {
    Track.find({ _id: { $in: uris } })
      .populate({ path: 'addedBy.user' })
      .populate({ path: 'addedBy.votes.user' })
      .then(tracks => {
        if (tracks.length > 0) EventLogger.info('FOUND CACHED TRACKS', { data: uris })
        resolve(tracks)
      })
      .catch(err => reject(err))
  })
)

const findOrUseBRH = (user?: JBUserInterface): PromiseLikeDBUser => {
  if (user) return Promise.resolve(new User(user).toObject())

  return User.findOneAndUpdate(
    { _id: brh._id },
    brh,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}

const addTracks = (uris: string[], user?: DBUserInterface): Promise<any> => (
  new Promise((resolve) => {
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
    }).catch((error: any) => logger.error('addTracks:findOrUseBRH', { message: error.message }))
  })
)

const updateTrackPlaycount = (uri: string): Promise<DBTrackInterface> => (
  new Promise((resolve) => {
    Track.findById(uri)
      .populate({ path: 'addedBy.user' })
      .populate({ path: 'addedBy.votes.user' })
      .then((track) => {
        if (track && track.addedBy[0]) {
          const played: JBPlayedInterface = { at: new Date() }
          track.addedBy[0].played.unshift(played)
          track.metrics.plays = track.metrics.plays + 1
          return track.save()
        }

        return Promise.resolve(track)
      })
      .then((track) => resolve(track))
      .catch((error) => logger.error('updateTrackPlaycount', { message: error.message }))
  })
)

const updateTrackVote = (uri: string, user: JBUserInterface, vote: number) => (
  new Promise((resolve) => {
    findOrUseBRH(user).then((vUser) => {
      Track.findById(uri)
        .populate({ path: 'addedBy.user' })
        .populate({ path: 'addedBy.votes.user' })
        .then((track) => {
          if (track && track.addedBy[0]) {
            const currentVote = VotingHelper.voteNormalised(vote)
            const newVote: JBVotesInterface = { at: new Date(), vote: currentVote, user: vUser }
            const votes = track.addedBy[0].votes
            const currentVoteIndex = votes.findIndex(vote => vote.user._id === vUser._id)

            if (currentVoteIndex !== -1) {
              votes[currentVoteIndex].vote = currentVote
            } else {
              votes.unshift(newVote)
              track.metrics.votes = VotingHelper.calcVoteCount(track.addedBy)
            }

            track.metrics.votesTotal = VotingHelper.calcVoteTotal(track.addedBy)
            track.metrics.votesAverage = VotingHelper.calcWeightedMean(track.addedBy)

            return track.save()
          }

          return Promise.resolve(track)
        })
        .then((track) => resolve({ uri: track.id, addedBy: track.addedBy, metrics: track.metrics }))
        .catch((error) => logger.error('updateTrackVote:findById', { message: error.message }))
    }).catch((error) => logger.error('updateTrackVote:findOrUseBRH', { message: error.message }))
  })
)

export default Track
export { findTracks, addTracks, updateTrackPlaycount, updateTrackVote }
