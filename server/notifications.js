import admin from 'firebase-admin';
import logger from './logger';

const serviceAccount = require('./firebase.json'); // eslint-disable-line

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://yak-chat-779ce.firebaseio.com',
});

export const subscribeToChannel = (channelId, token) => {
  admin.messaging().subscribeToTopic(token, channelId)
    .then(response => {
      logger('Successfully subscribed to topic:', response);
    })
    .catch(error => {
      logger('Error subscribing to topic:', error);
    });
};

export const unsubscribeFromChannel = (channelId, token) => {
  admin.messaging().unsubscribeFromTopic(token, channelId)
    .then(response => {
      logger('Successfully unsubscribed from topic:', response);
    })
    .catch(error => {
      logger('Error unsubscribing from topic:', error);
    });
};

export const notifyChannel = (channelId, msg) => {
  admin.messaging().sendToTopic(channelId, msg)
    .then(response => {
      logger('Successfully sent message:', response);
    })
    .catch(error => {
      logger('Error sending message:', error);
    });
};

export const foo = 'bar';
