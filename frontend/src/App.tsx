import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import ReactNotification from 'react-notifications-component'
import { useGoogleLogin } from 'react-use-googlelogin'
import ErrorBoundary from 'components/error-boundary'
import GoogleAuthContext from 'contexts/google'
import jukeboxMiddleware from 'middleware/jukebox-middleware'
import jukeboxApp from 'reducers'
import { Container } from 'semantic-ui-react'
import DashboardContainer from 'containers/dashboard-container'
import 'react-notifications-component/dist/theme.css'

const store = createStore(jukeboxApp, composeWithDevTools(applyMiddleware(jukeboxMiddleware)))

const App = () => {
  const googleAuth = useGoogleLogin({
    clientId: process.env.REACT_APP_CLIENT_ID as string,
    hostedDomain: process.env.GOOGLE_AUTH_DOMAIN
  })

  return (
    <Provider store={store}>
      <ReactNotification />
      <Container fluid>
        <GoogleAuthContext.Provider value={googleAuth}>
          <ErrorBoundary>
            <DashboardContainer />
          </ErrorBoundary>
        </GoogleAuthContext.Provider>
      </Container>
    </Provider>
  )
}

export default App
