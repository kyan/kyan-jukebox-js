import gaxios from 'gaxios'
import logger from '../../../config/winston'

const HttpService = {
  post: async ({ url, data }) => {
    try {
      await gaxios.request({
        url: url,
        method: 'POST',
        data
      })
    } catch (err) {
      logger.error(`Something went wrong with ${url}`, { message: err.message })
    }
  }
}

export default HttpService
