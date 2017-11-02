/*
///////////////////////
// WEBSOCKET SERVICE //
///////////////////////
*/

import io from 'socket.io-client';
import config from '../config';

const createSocket = store => {
  const socket = io(config.API_URL, {
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.debug('[SOCKET] connected!');
    store.updateFoo();
  });

  socket.on('disconnect', () => {
    console.debug('[SOCKET] disconnected!');
  });
};

export default createSocket;
