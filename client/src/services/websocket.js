/*
///////////////////////
// WEBSOCKET SERVICE //
///////////////////////
*/

import { onAction, onPatch } from 'mobx-state-tree'
import io from 'socket.io-client';
import config from '../config';

const createSocket = store => {
  const socket = io(config.API_URL, {
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.debug('[SOCKET] connected!');
  });

  socket.on('CHAT_MESSAGE', msg => {
    console.debug('[SOCKET] CHAT_MESSAGE received', msg);
    if (store.chat.activeChannel) {
      store.chat.receiveMessage(msg);
    }
  });

  socket.on('CHAT_MESSAGE_HISTORY', messages => {
    console.debug('[SOCKET] CHAT_MESSAGE_HISTORY', messages);
    if (store.chat.activeChannel && messages.length > 0) {
      messages.forEach(m => store.chat.receiveMessage(m));
    }
  });

  socket.on('disconnect', () => {
    console.debug('[SOCKET] disconnected!');
  });

  onAction(store, ({ name, args }) => {
    switch (name) {
    case 'addMessage': {
      const msg = args[0];
      socket.emit('SEND_CHAT_MESSAGE', {
        msg,
        channelId: store.chat.activeChannel,
      });
      break;
    }
    case 'leaveChannel': {
      const channelId = args[0] || store.chat.activeChannel;
      socket.emit('LEAVE_CHANNEL', channelId);
      break;
    }
    default:
      break;
    }
  });

  onPatch(store.chat, ({ path, value }) => {
    if (path === '/activeChannel' && value) {
      console.debug('[JOIN CHANNEL]', value);
      socket.emit('JOIN_CHANNEL', value);
    }
  });
};

export default createSocket;
