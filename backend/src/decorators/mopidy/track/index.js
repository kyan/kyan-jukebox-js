export default function (json) {
  if (!json) return { track: null }

  let payload = {
    uri: json.uri,
    name: json.name,
    length: json.length || json.duration_ms
  }

  if (json.image) {
    payload.image = json.image
  }

  if (json.album) {
    payload.album = {
      uri: json.album.uri,
      name: json.album.name,
      year: json.album.date
    }

    if (!payload.image && json.album.images && json.album.images.length > 0) {
      payload.image = json.album.images[0].url
    }
  }

  payload.artist = {
    uri: json.artists[0].uri,
    name: json.artists[0].name
  }

  if (json.date) {
    payload.year = json.date
  }

  if (json.addedBy) {
    payload.addedBy = json.addedBy
  }

  if (json.metrics) {
    payload.metrics = json.metrics
  }

  if (json.explicit) {
    payload.explicit = json.explicit
  }

  return { track: payload }
}
