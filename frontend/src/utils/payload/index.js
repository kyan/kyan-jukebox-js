const Payload = {
  decode: payload => JSON.parse(payload),
  encodeToJson: (jwt, key, data) => JSON.stringify({ jwt, key, data })
}

export default Payload
