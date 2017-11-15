const payload = (state = {}, action) => {
  switch (action.type) {
    case 'STORE_PAYLOAD':
      return JSON.parse(action.payload)
    default:
      return state
  }
}

export default payload
