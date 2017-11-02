import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from './assets/theme.json';

import './index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import createSocket from './services/websocket';
import store from './store';

createSocket();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);

registerServiceWorker();
