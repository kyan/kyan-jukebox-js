import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from 'components/error-boundary'
import jukeboxMiddleware from 'middleware/jukebox-middleware'
import jukeboxApp from 'reducers'
import DashboardContainer from 'containers/dashboard-container'

const store = createStore(jukeboxApp, applyMiddleware(jukeboxMiddleware))

const App = () => {
  return (
    <Provider store={store}>
      <Toaster
        position='bottom-left'
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff'
          }
        }}
      />
      <ErrorBoundary>
        <DashboardContainer />
      </ErrorBoundary>
    </Provider>
  )
}

export default App
