const assets = (state = {}, action) => {
  switch (action.type) {
    case 'NEW_IMAGE':
      return { ...state, [action.key]: { ref: action.uri } }
    case 'RESOLVE_IMAGE':
      let key, img;

      Object.keys(state).forEach(k => {
        const ref = action.data[state[k].ref]

        if (ref) {
          img = ref[1]
          key = k
        }
      })

      return img ? { ...state, [key]: img } : state
    default:
      return state
  }
}

export default assets
