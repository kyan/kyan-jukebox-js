import Types from '../../constants'

const initalState = []
const MAX_IMAGES_IN_CACHE = 200

const assets = (state = initalState, action) => {
  switch (action.type) {
    case Types.NEW_IMAGE:
      return (state.find(a => action.uri && a.ref === action.uri))
        ? state
        : [ ...state, { ref: action.uri } ]
    case Types.RESOLVE_IMAGE:
      return state.map(asset =>
        (action.data[asset.ref] && action.data[asset.ref][1])
          ? { ...asset, uri: action.data[asset.ref][1].uri }
          : asset
      ).slice(0, MAX_IMAGES_IN_CACHE)
    default:
      return state
  }
}

export default assets
