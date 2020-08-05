// https://open.spotify.com/track/0c41pMosF5Kqwwegcps8ES
const transformUrl = url => {
  const uri = url.replace(/^.*\/track\//, 'spotify:track:')
  return uri.match(/spotify:track/g) ? uri : null
}

module.exports = {
  transformUrl
}
