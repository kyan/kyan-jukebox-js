import TransformTrack from '../../../transformers/mopidy/track'

const Tracklist = (json) => {
  return json.map(data => {
    return TransformTrack(data)
  })
}

export default Tracklist
