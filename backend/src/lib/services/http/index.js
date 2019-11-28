import gaxios from 'gaxios'
import logger from '../../../config/winston'

const HttpService = {
  post: async ({ url, data }) => {
    try {
      console.log('GET HERE')
      await gaxios.request({
        url: url,
        method: 'POST',
        data
      })
      console.log('AND HERE')
    } catch (err) {
      logger.error(`Something went wrong with ${url}`, { message: err.message })
    }
  }
}

export default HttpService
