import { types, getParent, getEnv, flow } from 'mobx-state-tree';
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
    fetchChannels: flow(function* fetchChannels() {
      // Get persisted data
      const activeChannel = yield storage.getActiveChannel();
      console.log(activeChannel);
      const channels = yield storage.getChannels();
      console.log(channels);
      const { socket } = getEnv(self);

      channels.forEach(channelId => {
        const channel = Channel.create({ id: channelId });
        self.channels.put(channel);
        self.loadLocalMessages(channelId);

        if (channelId !== activeChannel) {
          // Also join other channels to receive messages etc.
          socket.emit('JOIN_CHANNEL', channelId);
        }
      });

      if (activeChannel) self.joinChannel(activeChannel);
    }),

    joinChannel: flow(function* joinChannel(channelId) {
      const channel = Channel.create({ id: channelId });
      self.channels.put(channel);
      self.activeChannel = channelId;
      yield storage.setActiveChannel(channelId);
      yield storage.addChannel(channelId);

      const { socket } = getEnv(self);
      self.activeChannel.setLoading(true);
      socket.emit('JOIN_CHANNEL', channelId);
    }),

    createChannel(channelId) {
      self.joinChannel(channelId);
    },

    setActiveChannel(channelId) {
      self.activeChannel = channelId;
      storage.setActiveChannel(channelId);
    },

    loadLocalMessages: flow(function* loadLocalMessages(channelId) {
      let messages = yield storage.getMessages(channelId);
      messages = messages.rows.map(row => row.doc.data);
      console.log(messages);

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
    }),

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
