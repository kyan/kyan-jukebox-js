import Mopidy from 'mopidy'
import { Schema, model, Model, Document } from 'mongoose'
import User, { JBUser } from '../models/user'
import EventLogger from '../utils/event-logger'
import logger from '../config/logger'
import VotingHelper from '../utils/voting'

export interface JBVotes {
  user: JBUser
  vote: number
  at: Date
}

interface JBPlayed {
  at: Date
}

export interface JBAddedBy {
  user: JBUser
  addedAt: Date
  played: JBPlayed[]
  votes: JBVotes[]
}

interface JBMetrics {
  plays: number
  votes: number
  votesTotal: number
  votesAverage: number
}

interface Track extends Document {
  _id: string
  uri: string
  addedBy: JBAddedBy[]
  metrics: JBMetrics
}

const TrackSchema = new Schema(
  {
    _id: {
      type: Schema.Types.String,
      alias: 'uri'
    },
    addedBy: [
      {
        _id: false,
        user: { type: Schema.Types.String, ref: 'User' },
        addedAt: Schema.Types.Date,
        played: [
          {
            _id: false,
            at: Schema.Types.Date
          }
        ],
        votes: [
          {
            _id: false,
            user: { type: Schema.Types.String, ref: 'User' },
            vote: Schema.Types.Number,
            at: Schema.Types.Date
          }
        ]
      }
    ],
    metrics: {
      _id: false,
      plays: { type: Schema.Types.Number, default: 0 },
      votes: { type: Schema.Types.Number, default: 0 },
      votesTotal: { type: Schema.Types.Number, default: 0 },
      votesAverage: { type: Schema.Types.Number, default: 0 }
    }
  },
  { _id: false }
)

export interface MopidyImageExt extends Mopidy.models.Image {
  url: string
}

export interface MopidyAlbumExt extends Mopidy.models.Album {
  images: MopidyImageExt[]
}

export interface MopidyTrackExt extends Mopidy.models.Track {
  album: MopidyAlbumExt
  addedBy?: JBAddedBy[]
  metrics?: JBMetrics
  image?: string
  genres?: string[]
  duration_ms?: number
  explicit?: boolean
}

export interface SpotifyTrackObjectFullExt extends SpotifyApi.TrackObjectFull {
  addedBy: JBAddedBy[]
  metrics: JBMetrics
}

export interface JBWTrack {
  track: JBTrack
}

export interface JBArtist {
  uri: string
  name: string
}

export interface JBAlbum {
  uri: string
  name: string
  year: string
}

export interface JBTrack {
  uri: string
  name: string
  length: number
  year?: string
  image?: string
  album?: JBAlbum
  artist?: JBArtist
  addedBy?: any
  metrics?: any
  explicit?: boolean
  genres?: string[]
}

const brh = {
  _id: '1ambigrainbowhead',
  fullname: 'BRH',
  picture: 'https://cdn-images-1.medium.com/fit/c/200/200/1*bFBXYvskkPFI9nPx6Elwxg.png'
}

TrackSchema.statics.findTracks = (uris: string[]): Promise<Track[]> =>
  new Promise((resolve, reject) => {
    Track.find({ _id: { $in: uris } })
      .populate({ path: 'addedBy.user' })
      .populate({ path: 'addedBy.votes.user' })
      .then((tracks) => {
        if (tracks.length > 0) EventLogger.info('FOUND CACHED TRACKS', { data: uris })
        resolve(tracks)
      })
      .catch((err) => reject(err))
  })

TrackSchema.statics.findOrUseBRH = (user?: JBUser): Promise<any> => {
  if (user) return Promise.resolve(new User(user).toObject())

  return User.findOneAndUpdate({ _id: brh._id }, brh, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  }).exec()
}

TrackSchema.statics.addTracks = (
  uris: ReadonlyArray<string>,
  user?: JBUser
): Promise<any> =>
  new Promise((resolve) => {
    Track.findOrUseBRH(user)
      .then((returnUser: any) => {
        const requests = uris.map((uri) =>
          Track.findOneAndUpdate(
            { _id: uri },
            {
              $push: {
                addedBy: {
                  $each: [
                    {
                      user: returnUser,
                      addedAt: new Date(),
                      played: [],
                      votes: []
                    }
                  ],
                  $position: 0
                }
              }
            },
            { upsert: true, runValidators: true, setDefaultsOnInsert: true }
          ).exec()
        )

        Promise.all(requests)
          .then(() => resolve({ uris, user: returnUser }))
          .catch((error) =>
            logger.error('addTracks:Track.updateOne', { message: error.message })
          )
      })
      .catch((error: any) =>
        logger.error('addTracks:findOrUseBRH', { message: error.message })
      )
  })

const updateTrackPlaycount = (uri: string): Promise<Track> =>
  new Promise((resolve) => {
    Track.findById(uri)
      .populate({ path: 'addedBy.user' })
      .populate({ path: 'addedBy.votes.user' })
      .then((track) => {
        if (track && track.addedBy[0]) {
          const played: JBPlayed = { at: new Date() }
          track.addedBy[0].played.unshift(played)
          track.metrics.plays = track.metrics.plays + 1
          return track.save()
        }

        return Promise.resolve(track)
      })
      .then((track) => resolve(track))
      .catch((error) => logger.error('updateTrackPlaycount', { message: error.message }))
  })

const updateTrackVote = (uri: string, user: JBUser, vote: number) =>
  new Promise((resolve) => {
    Track.findOrUseBRH(user)
      .then((vUser: any) => {
        Track.findById(uri)
          .populate({ path: 'addedBy.user' })
          .populate({ path: 'addedBy.votes.user' })
          .then((track) => {
            if (track && track.addedBy[0]) {
              const currentVote = VotingHelper.voteNormalised(vote)
              const newVote: JBVotes = {
                at: new Date(),
                vote: currentVote,
                user: vUser
              }
              const votes = track.addedBy[0].votes
              const currentVoteIndex = votes.findIndex(
                (vote) => vote.user._id === vUser._id
              )

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
          .then((track) =>
            resolve({ uri: track.id, addedBy: track.addedBy, metrics: track.metrics })
          )
          .catch((error) =>
            logger.error('updateTrackVote:findById', { message: error.message })
          )
      })
      .catch((error: { message: string }) =>
        logger.error('updateTrackVote:findOrUseBRH', { message: error.message })
      )
  })

interface DBTrackStatics extends Model<Track> {
  /**
   * Lookup tracks in MongoDB
   *
   * @param uris - A list of Track uris
   */
  findTracks(uris: ReadonlyArray<string>): Promise<Track[]>
  findOrUseBRH(user?: JBUser): Promise<any>
  addTracks(uris: ReadonlyArray<string>, user?: JBUser): Promise<any>
}

const Track = model<Track, DBTrackStatics>('Track', TrackSchema)

export default Track
export { updateTrackPlaycount, updateTrackVote }
