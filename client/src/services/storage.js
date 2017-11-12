import store from 'store';

const storage = {
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
    channels.push(channelId);
    store.set('channels', channels);
  },

  removeChannel(channelId) {
    const channels = store.get('channels') || [];
    const newChannels = channels.filter(c => c !== channelId);
    store.set('channels', newChannels);
  }
};

export default storage;
