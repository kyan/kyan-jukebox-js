import Types from '../../constants'

const assets = (state = [], action) => {
  switch (action.type) {
    case Types.NEW_IMAGE:
      return (state.find(a => a.ref === action.uri))
        ? state
        : [ ...state, { ref: action.uri } ]
    case Types.RESOLVE_IMAGE:
      return state.map(asset =>
        (action.data[asset.ref] && action.data[asset.ref][1])
          ? { ...asset, uri: action.data[asset.ref][1].uri }
          : asset
      ).slice(0, 50)
    default:
      return state
  }
}

export default assets
