import Mopidy from 'mopidy'
import { Schema, model, Model, Document } from 'mongoose'
import User from '../models/user'
import EventLogger from '../utils/event-logger'
import logger from '../config/logger'
import {
  JBUser,
  JBTrack,
  JBAddedBy,
  JBVotes,
  JBPlayed,
  JBMetrics,
  JBAlbum,
  JBArtist,
  MopidyTrackExt,
  SpotifyTrackObjectFullExt
} from '../types/database'

// Re-export shared types for backwards compatibility
export type {
  JBUser,
  JBTrack,
  JBAddedBy,
  JBVotes,
  JBPlayed,
  JBMetrics,
  JBAlbum,
  JBArtist,
  MopidyTrackExt,
  SpotifyTrackObjectFullExt
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

export interface JBWTrack {
  track: JBTrack
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
