/*
///////////////////////
// WEBSOCKET SERVICE //
///////////////////////
*/

import { onAction, onPatch } from 'mobx-state-tree';
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
    if (store.chat.activeChannel) {
      store.chat.receiveMessage(msg);
    }
  });

  socket.on('CHAT_MESSAGE_HISTORY', messages => {
    if (store.chat.activeChannel && messages.length > 0) {
      messages.forEach(m => store.chat.receiveMessage(m));
    }
  });

  socket.on('disconnect', () => {
    console.debug('[SOCKET] disconnected!');
  });

  /**
   * Listen to store actions and changes and emit socket messages accordingly
   *
   * NOTE: onAction does not fire for actions called inside other actions
   * which is why we need to use onPatch for some use cases.
   */

  onAction(store, ({ name, args }) => {
    switch (name) {
    case 'addMessage': {
      socket.emit('SEND_CHAT_MESSAGE', {
        msg: args[0],
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
      socket.emit('JOIN_CHANNEL', value);
    }
  });
};

export default createSocket;
