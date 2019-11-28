import { request } from 'gaxios'
import logger from '../../../config/winston'

const HttpService = {
  post: ({ url, data }) => {
    request({
      url: url,
      method: 'POST',
      data
    })
      .then(logger.info(`Posted to ${url}`, { message: JSON.stringify(data) }))
      .catch(err => {
        logger.error(`Something went wrong with ${url}`, { message: err.message })
      })
  }
}

export default HttpService
