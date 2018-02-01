import TransformTrack from '../../../transformers/mopidy/track'

const Tracklist = (json) => {
  let start = Date.now()

  return json.map(data => {
    const obj = TransformTrack(data)
    start += obj.track.length
    obj.track.start_time = start

    return obj
  })
}

export default Tracklist
