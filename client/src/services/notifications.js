import * as firebase from 'firebase';

firebase.initializeApp({
  apiKey: 'AIzaSyCBI49-UdKW6iyayFhOnGnq4gBthx-2xe8',
  authDomain: 'yak-chat-779ce.firebaseapp.com',
  databaseURL: 'https://yak-chat-779ce.firebaseio.com',
  projectId: 'yak-chat-779ce',
  storageBucket: 'yak-chat-779ce.appspot.com',
  messagingSenderId: '812078557420'
});

const messaging = firebase.messaging();

export async function getNotificationToken() {
  try {
    const token = await messaging.getToken();
    return token;
  } catch (e) {
    console.log('Failed to get token...', e);
  }
  return null;
}

const initNotifications = () => {
  messaging.requestPermission()
    .then(() => {
      console.log('> Notification permission granted.');

      messaging.onMessage(payload => {
        console.log('> Message received', payload);
      });
      
      // Handle token refresh
      messaging.onTokenRefresh(() => {
        messaging.getToken()
          .then(refreshedToken => {
            console.log('Token refreshed.', refreshedToken);
          })
          .catch(err => {
            console.log('Unable to retrieve refreshed token ', err);
          });
      });
    })
    .catch(err => {
      console.log('Unable to get permission to notify.', err);
    });
};

export default initNotifications;
