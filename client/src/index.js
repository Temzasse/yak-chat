import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';

import './index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createSocket, initSocket } from './services/websocket';
import initNotifications from './services/notifications';
import createStore from './store';
import config from './config';
import theme from './assets/theme.json';

const socket = createSocket();
const store = createStore({ socket }); // Inject dependencies

initNotifications();

if (config.IS_PROD) {
  const makeInspectable = require('mobx-devtools-mst').default; // eslint-disable-line
  makeInspectable(store);
}

initSocket({ store }); // Attach event listeners and inject dependencies

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);

registerServiceWorker();
