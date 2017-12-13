/*
///////////////////////
// WEBSOCKET SERVICE //
///////////////////////
*/

import io from 'socket.io-client';
import config from '../config';

let socket = null;

export const createSocket = () => {
  console.debug('> API URL', config.API_URL);
  socket = io(config.API_URL, {
    reconnectionDelay: 2000,
    secure: config.IS_PROD,
  });
  return socket;
};

export const initSocket = ({ store }) => {
  socket.on('connect', () => {
    console.debug('> Socket connected!');
  });

  socket.on('CHAT_MESSAGE', ({ channelId, msg }) => {
    console.debug('> [CHAT_MESSAGE]', channelId, msg);
    store.chat.receiveMessage({ channelId, msg });
  });

  socket.on('CHAT_MESSAGE_HISTORY', ({ channelId, messages }) => {
    console.debug('> [CHAT_MESSAGE_HISTORY]', channelId, messages);
    messages.forEach(msg => store.chat.receiveMessage({ channelId, msg }));
  });

  socket.on('GENERATED_CHANNEL_ID', channelId => {
    store.chat.updateGeneratedChannelId(channelId);
  });

  socket.on('CHANNEL_USER_COUNT', ({ channelId, count }) => {
    console.log('> CHANNEL_USER_COUNT', { channelId, count });
    store.chat.updateChannelUserCount({ channelId, count });
  });

  socket.on('disconnect', () => {
    console.debug('> Socket disconnected!');
  });

  setInterval(() => {
    if (store.chat.activeChannel) {
      console.debug('> GET_CHANNEL_USER_COUNT');
      socket.emit('GET_CHANNEL_USER_COUNT', store.chat.activeChannel.id);
    }
  }, 10000);
};

export default createSocket;
