import { Logger } from 'tslog'

process.env.EXPLICIT_CONTENT

const log: Logger = new Logger({
  colorizePrettyLogs: process.env.NODE_ENV === 'production' ? false : true
})

export default log
