import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import jukeboxMiddleware from './containers/jukebox-middleware'
import jukeboxApp from './reducers'
import { Container } from 'semantic-ui-react'
import Dashboard from './containers/dashboard'

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['settings']
}
const persistedReducer = persistReducer(persistConfig, jukeboxApp)
const store = createStore(persistedReducer, applyMiddleware(jukeboxMiddleware))
const persistor = persistStore(store)

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Container fluid>
        <Dashboard />
      </Container>
    </PersistGate>
  </Provider>
)

export default App
