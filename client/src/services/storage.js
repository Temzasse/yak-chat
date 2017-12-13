import PouchDB from 'pouchdb';
import { guid } from './utils';

let db = null;

export function initDB(name) {
  db = new PouchDB(name);
}

const storage = {
  setUser(user) {
    return db.get('user').then(doc => {
      return db.put({
        '_id': 'user',
        '_rev': doc._rev,
        'data': user,
      });
    }).catch(error => {
      if (error.name !== 'not_found') {
        console.log('error', error);
      }
      return db.put({
        '_id': 'user',
        'data': user,
      });
    });
  },

  getUser() {
    return db.get('user')
      .catch(error => {
        if (error.name !== 'not_found') {
          console.log('error', error);
        }
        return false;
      });
  },

  setActiveChannel(channelId) {
    return db.get('activeChannel').then(doc => {
      return db.put({
        '_id': 'activeChannel',
        '_rev': doc._rev,
        'channelId': channelId,
      });
    })
      .catch(error => {
        if (error.name !== 'not_found') {
          console.log('error', error);
        }
        return db.put({
          '_id': 'activeChannel',
          'channelId': channelId,
        });
      });
  },

  getActiveChannel() {
    return db.get('activeChannel')
      .then(doc => {
        return doc.channelId;
      })
      .catch(error => {
        console.log('error', error);
        return false;
      });
  },

  getChannels() {
    return db.get('channels')
      .then(channels => {
        return channels.data;
      })
      .catch(error => {
        if (error.name === 'not_found') {
          console.log('error', error);
          return db.put({
            '_id': 'channels',
            'data': [],
          });
        }
        return false;
      });
  },

  addChannel(channelId) {
    return db.get('channels')
      .then(channels => {
        const data = channels.data || [];
        if (!data.includes(channelId)) {
          data.push(channelId);
          db.put({
            '_id': 'channels',
            'data': data,
            '_rev': channels._rev,
          });
        }
      })
      .catch(error => {
        if (error.name !== 'not_found') {
          console.log('error', error);

          return db.put({
            '_id': 'channels',
            'data': [channelId],
          });
        }
        return false;
      });
  },

  removeChannel(channelId) {
    return db.get('channels')
      .then(channels => {
        const data = channels.data || [];
        if (data.includes(channelId)) {
          const newChannels = channels.filter(c => c !== channelId);
          db.put({
            '_id': 'channels',
            'data': newChannels,
            '_rev': channels._rev,
          });
        }
      })
      .catch(error => {
        if (error.name !== 'not_found') {
          console.log('error', error);
        }
      });
  },

  getMessages(channelId) {
    return db.allDocs({
      include_docs: true,
      startkey: channelId,
      endkey: `${channelId}\ufff0`,
      limit: 50,
    });
  },

  addMessage(channelId, message) {
    // const newMessages = store.get(`messages-${channelId}`) || [];
    // if (newMessages.filter(msg => msg.id === message.id).length > 0) {
    //   return;
    // }
    // newMessages.push(message);
    // store.set(`messages-${channelId}`, newMessages);
    return db.allDocs({
      startkey: `${channelId}-${message.timestamp}`,
      endkey: `${channelId}-${message.timestamp}\ufff0`,
      limit: 2,
    })
      .then(docs => {
        if (docs.length) {
          return false;
        }
        return db.put({
          '_id': `${channelId}-${message.timestamp}-${guid()}`,
          'data': message,
          'channelId': channelId,
        });
      });
  },
};

export default storage;
