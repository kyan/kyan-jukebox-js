import { createSelector } from 'reselect'

const getCurrentTrack = (state) => state.track
const getTrackList = (state) => state.tracklist
const getAssets = (state) => state.assets

export const getCurrentTrackImageInCache = createSelector(
  [getCurrentTrack, getAssets],
  (track, cache) => {
    if (!track) { return null }
    return track.album.image || cache[track.album.uri]
  }
)

export const getTracklistImagesInCache = createSelector(
  [getTrackList, getAssets],
  (tracklist, cache) => {
    const images = {}
    tracklist.forEach(track => {
      images[track.album.uri] = track.album.image || cache[track.album.uri]
    })
    return images
  }
)
