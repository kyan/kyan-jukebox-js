const findImageInCache = (uri, cache) => {
  const index = cache.findIndex(asset => asset.ref === uri)
  if (cache[index]) { return cache[index].uri }
}

const findTracklistImagesInCache = (state) => {
  const images = {}
  state.tracklist.forEach(track => {
    return images[track.album.uri] = findImageInCache(track.album.uri, state.assets)
  })
  return images
}

module.exports = {
  findImageInCache,
  findTracklistImagesInCache
}
