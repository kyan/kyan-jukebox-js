export default function (json) {
  let payload = {
    uri: json.uri,
    name: json.name,
    length: json.length
  }

  if (json.album) {
    payload.album = {
      uri: json.album.uri,
      name: json.album.name,
      year: json.album.date
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
