import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import Notifications from 'react-notify-toast'
import { useGoogleLogin } from 'react-use-googlelogin'
import ErrorBoundary from './components/error-boundary'
import GoogleAuthContext from './contexts/google'
import jukeboxMiddleware from './containers/jukebox-middleware'
import jukeboxApp from './reducers'
import { Container } from 'semantic-ui-react'
import Dashboard from './containers/dashboard'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(jukeboxApp, composeEnhancers(applyMiddleware(jukeboxMiddleware)))

const App = () => {
  const googleAuth = useGoogleLogin({
    clientId: process.env.REACT_APP_CLIENT_ID,
    hostedDomain: 'kyanmedia.com'
  })

  return (
    <Provider store={store}>
      <Container fluid>
        <GoogleAuthContext.Provider value={googleAuth}>
          <ErrorBoundary>
            <Notifications />
            <Dashboard />
          </ErrorBoundary>
        </GoogleAuthContext.Provider>
      </Container>
    </Provider>
  )
}

export default App
