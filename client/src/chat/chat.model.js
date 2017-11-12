import { types, getParent } from 'mobx-state-tree';
import storage from '../services/storage';
import User from '../user/user.model';
import Channel from '../channel/channel.model';
import { alphabetically } from '../services/utils';

const Chat = types
  .model({
    activeChannel: types.maybe(types.reference(Channel)),
    channels: types.optional(types.map(Channel), {}),
    generatedChannelId: types.maybe(types.string),
  })
  .actions(self => ({
    fetchChannels() {
      const activeChannel = storage.getActiveChannel();
      const channels = storage.getChannels();

      if (activeChannel) self.joinChannel(activeChannel);

      channels.forEach(channelId => {
        const channel = Channel.create({ id: channelId });
        self.channels.put(channel);
      });
    },

    // TODO: is there any difference between joinChannel and createChannel?
    joinChannel(channelId) {
      const channel = Channel.create({ id: channelId });
      self.channels.put(channel);
      self.activeChannel = channelId;
      storage.setActiveChannel(channelId);
      /**
       * NOTE:
       * Messages are fetched automatically with `onPatch` listener
       * in /services/websocket.
       */
    },

    createChannel(channelId) {
      const channel = Channel.create({ id: channelId });
      self.channels.put(channel);
      self.activeChannel = channelId;
      storage.setActiveChannel(channelId);
      storage.addChannel(channelId);
      /**
       * NOTE:
       * Messages are fetched automatically with `onPatch` listener
       * in /services/websocket.
       */
    },

    setActiveChannel(channelId) {
      self.activeChannel = channelId;
      storage.setActiveChannel(channelId);
    },

    receiveMessage({ channelId, msg }) {
      const { content, sender, timestamp = Date.now(), type = 'message' } = msg;
      const u = User.create({ ...sender });
      const channel = self.channels.get(channelId);
      channel.messages.push({ content, sender: u, timestamp, type });

      const { user } = getParent(self);

      // Show "You have new messages" thingy if someone else than the current
      // user added a new message.
      if (channel === self.activeChannel) {
        if (!self.activeChannel.followingMessages && sender.id !== user.id) {
          channel.unseenMessages = true;
        }
      } else {
        // Or show a red dot in the sidebar if the channel that received
        // the message wasn't the active channel.
        channel.unseenMessages = true;
      }
    },

    addMessage({ content, sender, timestamp = Date.now(), type = 'message' }) {
      const u = User.create({ ...sender });
      const msg = { content, sender: u, timestamp, type };
      self.activeChannel.messages.push(msg);
    },

    updateGeneratedChannelId(channelId) {
      self.generatedChannelId = channelId;
    }
  }))
  .views(self => ({
    getMessages() {
      return self.activeChannel.messages;
    },

    getChannels() {
      return self.channels.values().sort(alphabetically);
    }
  }));

export default Chat;
