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

  socket.on('CHAT_MESSAGE', ({ channelId, msg }) => {
    store.chat.receiveMessage({ channelId, msg });
  });

  socket.on('CHAT_MESSAGE_HISTORY', ({ channelId, messages }) => {
    messages.forEach(msg => store.chat.receiveMessage({ channelId, msg }));
    store.chat.activeChannel.setLoading(false);
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
        channelId: store.chat.activeChannel.id,
      });
      break;
    }
    case 'leaveChannel': {
      const channelId = args[0] || store.chat.activeChannel.id;
      socket.emit('LEAVE_CHANNEL', channelId);
      break;
    }
    default:
      break;
    }
  });

  onPatch(store.chat, ({ path, value }) => {
    if (path === '/activeChannel' && value) {
      // Active channel has changed => join the new channel
      store.chat.activeChannel.setLoading(true);
      socket.emit('JOIN_CHANNEL', value);
    }
  });
};

export default createSocket;
