const FindImageInCache = (uri, cache) => {
  const index = cache.findIndex(asset => asset.ref === uri)
  if (cache[index]) { return cache[index].uri }
}

export default FindImageInCache
