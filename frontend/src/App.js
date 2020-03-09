import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import ReactNotification from 'react-notifications-component'
import { useGoogleLogin } from 'react-use-googlelogin'
import ErrorBoundary from 'components/error-boundary'
import GoogleAuthContext from 'contexts/google'
import jukeboxMiddleware from 'middleware/jukebox-middleware'
import jukeboxApp from 'reducers'
import DashboardContainer from 'containers/dashboard-container'
import 'react-notifications-component/dist/theme.css'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(jukeboxApp, composeEnhancers(applyMiddleware(jukeboxMiddleware)))

const App = () => {
  const googleAuth = useGoogleLogin({
    clientId: process.env.REACT_APP_CLIENT_ID,
    hostedDomain: 'kyanmedia.com'
  })

  return (
    <Provider store={store}>
      <ReactNotification />
      <div className="c-app">
        <GoogleAuthContext.Provider value={googleAuth}>
          <ErrorBoundary>
            <DashboardContainer />
          </ErrorBoundary>
        </GoogleAuthContext.Provider>
      </div>
    </Provider>
  )
}

export default App
