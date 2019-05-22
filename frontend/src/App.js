import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import Notifications from 'react-notify-toast'
import { PersistGate } from 'redux-persist/integration/react'
import ErrorBoundary from './components/error-boundary'
import jukeboxMiddleware from './containers/jukebox-middleware'
import jukeboxApp from './reducers'
import { Container } from 'semantic-ui-react'
import Dashboard from './containers/dashboard'

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['settings']
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const persistedReducer = persistReducer(persistConfig, jukeboxApp)
const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(jukeboxMiddleware)))
const persistor = persistStore(store)

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Container fluid>
        <ErrorBoundary>
          <Notifications />
          <Dashboard />
        </ErrorBoundary>
      </Container>
    </PersistGate>
  </Provider>
)

export default App
