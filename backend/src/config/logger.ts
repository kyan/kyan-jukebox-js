import { Logger } from 'tslog'

process.env.EXPLICIT_CONTENT

const log = new Logger({
  type: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
  minLevel: 0,
  hideLogPositionForProduction: process.env.NODE_ENV === 'production'
})

export default log
