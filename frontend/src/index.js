import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import jukeboxMiddleware from './containers/jukebox-middleware';
import jukeboxApp from './reducers'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

let store = createStore(
  jukeboxApp,
  applyMiddleware(jukeboxMiddleware)
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
