import Types from 'constants/common'

const initalState = {}

const assets = (state = initalState, action) => {
  switch (action.type) {
    case Types.RESOLVE_IMAGE:
      return { ...state, ...action.image }
    default:
      return state
  }
}

export default assets
