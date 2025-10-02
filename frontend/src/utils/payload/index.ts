export interface User {
  email: string
  fullname?: string
}

export interface PayLoadInterface {
  user?: User
  key: string
  data: any
}

const Payload = {
  decode: (payload: string): PayLoadInterface => JSON.parse(payload),
  encodeToJson: ({ user, key, data }: PayLoadInterface): string =>
    JSON.stringify({ user, key, data })
}

export default Payload
