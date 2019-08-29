import MopidyConsts from '../constants/mopidy'
import AuthConsts from '../constants/auth'
import TransformTrack from './transformers/mopidy/track'
import TransformTracklist from './transformers/mopidy/tracklist'
import settings from '../local-storage'
import Spotify from '../services/spotify'

export default function (key, data, mopidy) {
  let recommendTimer

  switch (key) {
    case MopidyConsts.EVENTS.PLAYBACK_STARTED:
      const payload = TransformTrack(data.tl_track.track)
      settings.addToUniqueArray('lastTracksPlayed', payload.track.uri, 10)

      recommendTimer = Spotify.canRecommend(mopidy, (recommend) => {
        const waitToRecommend = payload.track.length / 4 * 3
        const lastTracksPlayed = settings.getItem('lastTracksPlayed') || []

        recommendTimer = setTimeout(recommend, waitToRecommend, lastTracksPlayed, mopidy)
      })

      return payload
    case MopidyConsts.EVENTS.VOLUME_CHANGED:
      return data.volume
    case MopidyConsts.EVENTS.PLAYBACK_STATE_CHANGED:
      return data.new_state
    case MopidyConsts.GET_CURRENT_TRACK:
      return TransformTrack(data)
    case MopidyConsts.GET_TRACKS:
      return TransformTracklist(data)
    case MopidyConsts.TRACKLIST_ADD:
    case MopidyConsts.PLAYBACK_NEXT:
    case MopidyConsts.TRACKLIST_REMOVE:
    case MopidyConsts.TRACKLIST_CLEAR:
      clearTimeout(recommendTimer)
      return data
    case AuthConsts.AUTHENTICATE_USER:
    case AuthConsts.AUTHENTICATION_ERROR:
    case MopidyConsts.CONNECTION_ERROR:
    case MopidyConsts.EVENTS.TRACKLIST_CHANGED:
    case MopidyConsts.LIBRARY_GET_IMAGES:
    case MopidyConsts.MIXER_GET_VOLUME:
    case MopidyConsts.MIXER_SET_VOLUME:
    case MopidyConsts.PLAYBACK_GET_TIME_POSITION:
    case MopidyConsts.PLAYBACK_GET_STATE:
      return data
    default:
      return `BACKEND RESPONSE NOT HANDLED: ${key}`
  }
};
