import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import jukeboxMiddleware from './containers/jukebox-middleware'
import jukeboxApp from './reducers'
import { Container } from 'semantic-ui-react'
import Dashboard from './containers/dashboard'

const store = createStore(
  jukeboxApp,
  applyMiddleware(jukeboxMiddleware)
)

const App = () => (
  <Provider store={store}>
    <Container fluid>
      <Dashboard/>
    </Container>
  </Provider>
)

export default App
