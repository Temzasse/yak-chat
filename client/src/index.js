import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from './assets/theme.json';

import './index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createSocket, initSocket } from './services/websocket';
import createStore from './store';

const socket = createSocket();
const store = createStore({ socket }); // Inject dependencies

if (process.env.NODE_ENV !== 'production') {
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
