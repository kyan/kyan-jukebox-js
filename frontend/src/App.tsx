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
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
            fontSize: '14px',
            fontWeight: '500'
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--success))',
              secondary: 'hsl(var(--card))'
            }
          },
          error: {
            iconTheme: {
              primary: 'hsl(var(--destructive))',
              secondary: 'hsl(var(--card))'
            }
          },
          loading: {
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--card))'
            }
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
