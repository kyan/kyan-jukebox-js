export default function (json) {
  let payload = {
    uri: json.uri,
    name: json.name,
    year: json.date,
    length: json.length,
    album: {
      uri: json.album.uri,
      name: json.album.name
    }
  }

  if (json.artists.length > 0) {
    payload.artist = json.artists[0]
  }

  return { track: payload }
}
