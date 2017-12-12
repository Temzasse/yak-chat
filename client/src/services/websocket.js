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
    console.debug('[SOCKET] connected!');
  });

  socket.on('CHAT_MESSAGE', ({ channelId, msg }) => {
    console.debug('[CHAT_MESSAGE]', channelId, msg);
    store.chat.receiveMessage({ channelId, msg });
  });

  socket.on('CHAT_MESSAGE_HISTORY', ({ channelId, messages }) => {
    console.debug('[CHAT_MESSAGE_HISTORY]', channelId, messages);
    messages.forEach(msg => store.chat.receiveMessage({ channelId, msg }));
    // store.chat.activeChannel.setLoading(false);
  });

  socket.on('GENERATED_CHANNEL_ID', channelId => {
    store.chat.updateGeneratedChannelId(channelId);
  });

  socket.on('disconnect', () => {
    console.debug('[SOCKET] disconnected!');
  });
};

export default createSocket;
