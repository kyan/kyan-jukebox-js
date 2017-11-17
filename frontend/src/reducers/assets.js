const assets = (state = [], action) => {
  switch (action.type) {
    case 'NEW_IMAGE':
      return [ ...state, { ref: action.uri } ]
    case 'RESOLVE_IMAGE':
      return state.map(asset =>
        (action.data[asset.ref])
          ? { ...asset, uri: action.data[asset.ref][1].uri }
          : asset
      ).slice(0, 50)
    default:
      return state
  }
}

export default assets
