export default function (json) {
  if (!json) return { track: null }

  let payload = {
    uri: json.uri,
    name: json.name,
    length: json.length || json.duration_ms
  }

  if (json.album) {
    payload.album = {
      uri: json.album.uri,
      name: json.album.name,
      year: json.album.date
    }

    if (json.album.images && json.album.images.length > 0) {
      payload.image = json.album.images[0].url
    }
  }

  if (json.composers && json.composers.length > 0) {
    payload.composer = {
      uri: json.composers[0].uri,
      name: json.composers[0].name
    }
    payload.genre = json.genre
  }

  payload.artist = {
    uri: json.artists[0].uri,
    name: json.artists[0].name
  }

  if (json.date) {
    payload.year = json.date
  }

  return { track: payload }
}
