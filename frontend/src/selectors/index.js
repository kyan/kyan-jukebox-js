import { createSelector } from 'reselect'
import { findImageInCache } from '../utils/images'

const getCurrentTrack = (state) => state.track
const getTrackList = (state) => state.tracklist
const getAssets = (state) => state.assets

export const getCurrentTrackImageInCache = createSelector(
  [getCurrentTrack, getAssets],
  (track, cache) => {
    if (!track) { return null }
    return findImageInCache(track.album.uri, cache)
  }
)

export const getTracklistImagesInCache = createSelector(
  [getTrackList, getAssets],
  (tracklist, cache) => {
    const images = {}
    tracklist.forEach(track => {
      images[track.album.uri] = findImageInCache(track.album.uri, cache)
    })
    return images
  }
)
