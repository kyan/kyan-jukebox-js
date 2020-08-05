import * as workerTimers from 'worker-timers'

const checkForTokenInMilliseconds = 2700000

const SignInToken = {
  refresh: (googleApi, success) => {
    return workerTimers.setTimeout(() => {
      googleApi.reloadAuthResponse().then(
        response => {
          console.info('Token refreshed OK')
          return success(response.id_token)
        },
        err => console.warn('Token un-refreshable: ', err.message)
      )
    }, checkForTokenInMilliseconds)
  },
  clear: id => {
    if (id) workerTimers.clearTimeout(id)
  }
}

export default SignInToken
