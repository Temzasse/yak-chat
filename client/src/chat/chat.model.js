import { types, getParent, getEnv, flow } from 'mobx-state-tree';
import storage from '../services/storage';
import User from '../user/user.model';
import Channel from '../channel/channel.model';
import { alphabetically } from '../services/utils';
import { getNotificationToken } from '../services/notifications';

const Chat = types
  .model({
    activeChannel: types.maybe(types.reference(Channel)),
    channels: types.optional(types.map(Channel), {}),
    generatedChannelId: types.maybe(types.string),
  })
  .actions(self => ({
    fetchChannels() {
      // Get persisted data
      const activeChannel = storage.getActiveChannel();
      const channels = storage.getChannels();

      channels.forEach(channelId => {
        const channel = Channel.create({ id: channelId });
        self.channels.put(channel);

        // For some reason this is not working without setTimeout?
        setTimeout(() => {
          self.loadLocalMessages(channelId);
        });
      });

      if (activeChannel) self.joinChannel(activeChannel);
    },

    notifyChannelJoin: flow(function* notifyChannelJoin(channelId) {
      const { socket } = getEnv(self);
      const fcmToken = yield getNotificationToken();
      socket.emit('JOIN_CHANNEL', { channelId, fcmToken });
    }),

    joinChannel(channelId) {
      const channel = Channel.create({ id: channelId });

      self.channels.put(channel);
      self.activeChannel = channelId;
      self.notifyChannelJoin(channelId);

      storage.setActiveChannel(channelId);
      storage.addChannel(channelId);
    },

    createChannel(channelId) {
      self.joinChannel(channelId);
    },

    setActiveChannel(channelId) {
      self.activeChannel = channelId;
      self.notifyChannelJoin(channelId);
      storage.setActiveChannel(channelId);
    },

    loadLocalMessages(channelId) {
      const messages = storage.getMessages(channelId);

      messages.forEach(msg => {
        const {
          id,
          content,
          sender,
          timestamp = new Date().toISOString(),
          type = 'message'
        } = msg;

        const u = User.create({ ...sender });
        const mchannel = self.channels.get(channelId);

        mchannel.messages.push({ id, content, sender: u, timestamp, type });
      });
    },

    receiveMessage({ channelId, msg }) {
      const {
        id,
        content,
        sender,
        timestamp = new Date().toISOString(),
        type = 'message'
      } = msg;

      const u = User.create({ ...sender });
      const channel = self.channels.get(channelId);

      // If the message is already in channel.messages, do not add it
      if (channel.messages.filter(m => m.id === msg.id).length > 0) {
        return;
      }

      channel.messages.push({ id, content, sender: u, timestamp, type });
      storage.addMessage(channelId, msg);
      const { user } = getParent(self);

      // Show "You have new messages" thingy if someone else than the current
      // user added a new message.
      if (user && channel === self.activeChannel) {
        if (!self.activeChannel.followingMessages && sender.id !== user.id) {
          channel.unseenMessages = true;
        }
      } else {
        // Or show a red dot in the sidebar if the channel that received
        // the message wasn't the active channel.
        channel.unseenMessages = true;
      }
    },

    addMessage(message) {
      const {
        id,
        content,
        sender,
        timestamp = new Date().toISOString(),
        type = 'message'
      } = message;

      const u = User.create({ ...sender });
      const msg = { id, content, sender: u, timestamp, type };
      self.activeChannel.messages.push(msg);
      storage.addMessage(self.activeChannel.id, msg);

      const { socket } = getEnv(self);
      socket.emit('SEND_CHAT_MESSAGE', {
        msg,
        channelId: self.activeChannel.id,
      });
    },

    updateGeneratedChannelId(channelId) {
      self.generatedChannelId = channelId;
    },

    generateChannelId() {
      const { socket } = getEnv(self);
      socket.emit('GENERATE_CHANNEL_ID');
    },

    updateChannelUserCount({ channelId, count }) {
      const channel = self.channels.get(channelId);
      if (channel) channel.updateUserCount(count);
    }
  }))
  .views(self => ({
    getMessages() {
      return self.activeChannel
        ? self.activeChannel.messages
        : [];
    },

    getChannels() {
      return self.channels
        ? self.channels.values().sort(alphabetically)
        : [];
    }
  }));

export default Chat;
