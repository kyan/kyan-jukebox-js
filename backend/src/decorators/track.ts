import { JBTrack } from '../models/track'

export default function (json: any): JBTrack {
  if (!json) throw new Error('DecorateTrack passed no data!')

  const payload: JBTrack = {
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

  if (process.env.EXPLICIT_CONTENT === 'false' && json.explicit) {
    payload.explicit = true
  }

  return payload
}
