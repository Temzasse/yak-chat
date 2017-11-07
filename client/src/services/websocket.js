/*
///////////////////////
// WEBSOCKET SERVICE //
///////////////////////
*/

import { onAction } from 'mobx-state-tree'
import io from 'socket.io-client';
import config from '../config';

const createSocket = store => {
  const socket = io(config.API_URL, {
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.debug('[SOCKET] connected!');
    // Todo: trigger join event when user joins in channel
    socket.emit('JOIN', { channel: 'default-channel' });
    store.updateFoo();
  });

  socket.on('CHAT_MESSAGE', msg => {
    console.debug('[SOCKET] CHAT_MESSAGE received', msg);
    if (store.chat.activeChannel) {
      store.chat.receiveMessage(msg);
    }
  });

  socket.on('CHAT_MESSAGE_HISTORY', msg => {
    console.debug('[SOCKET] CHAT_MESSAGE_HISTORY', msg);
    if (store.chat.activeChannel && msg.length > 0) {
      // Todo: How to do this with fetchMessages in chat.model.js?
      msg.forEach(m => store.chat.receiveMessage(m));
    }
  });

  socket.on('disconnect', () => {
    console.debug('[SOCKET] disconnected!');
  });

  onAction(store, call => {
    if (call.name === 'addMessage') {
      socket.emit('SEND_CHAT_MESSAGE', call.args[0]);
    }
  });
};

export default createSocket;
