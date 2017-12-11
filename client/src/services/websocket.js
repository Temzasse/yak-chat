/*
///////////////////////
// WEBSOCKET SERVICE //
///////////////////////
*/

import io from 'socket.io-client';

let socket = null;
let API_URL;

if (process.env.NODE_ENV === 'production') {
  // nginx will proxy it to server:3332
  API_URL = `http://${window.location.host}`;
} else {
  API_URL = 'http://0.0.0.0:3332';
}

export const createSocket = () => {
  socket = io(API_URL, { reconnectionDelay: 2000 });
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
    store.chat.activeChannel.setLoading(false);
  });

  socket.on('GENERATED_CHANNEL_ID', channelId => {
    store.chat.updateGeneratedChannelId(channelId);
  });

  socket.on('disconnect', () => {
    console.debug('[SOCKET] disconnected!');
  });
};

export default createSocket;
