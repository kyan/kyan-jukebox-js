export interface PayLoadInterface {
  jwt: string
  key: string
  data: any
}

const Payload = {
  decode: (payload: string): PayLoadInterface => JSON.parse(payload),
  encodeToJson: ({ jwt, key, data }:PayLoadInterface): string => JSON.stringify({ jwt, key, data })
}

export default Payload
