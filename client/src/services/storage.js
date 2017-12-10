import store from 'store';

const storage = {
  setUser(user) {
    store.set('user', user);
  },

  getUser() {
    return store.get('user');
  },

  setActiveChannel(channelId) {
    store.set('activeChannel', channelId);
  },

  getActiveChannel() {
    return store.get('activeChannel');
  },

  getChannels() {
    return store.get('channels') || [];
  },

  addChannel(channelId) {
    const channels = store.get('channels') || [];

    if (!channels.includes(channelId)) {
      channels.push(channelId);
      store.set('channels', channels);
    }
  },

  removeChannel(channelId) {
    const channels = store.get('channels') || [];
    const newChannels = channels.filter(c => c !== channelId);
    store.set('channels', newChannels);
  },

  getMessages(channelId) {
    return store.get(`messages-${channelId}`) || [];
  },

  addMessage(channelId, message) {
    const newMessages = store.get(`messages-${channelId}`) || [];
    if (newMessages.filter(msg => msg.id === message.id).length > 0) {
      return;
    }
    newMessages.push(message);
    store.set(`messages-${channelId}`, newMessages);
  },
};

export default storage;
