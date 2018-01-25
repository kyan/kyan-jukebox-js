import dotenv from 'dotenv/config'
import server from './app'

const { PORT = 8000 } = process.env
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`) // eslint-disable-line no-console
})
