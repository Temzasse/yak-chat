import { types, getParent } from 'mobx-state-tree';
import storage from 'store';
import User from '../user/user.model';
import Channel from '../channel/channel.model';

const Chat = types
  .model({
    activeChannel: types.maybe(types.reference(Channel)),
    channels: types.optional(types.map(Channel), {}),
  })
  .actions(self => ({
    fetchActiveChannel() {
      const activeChannel = storage.get('activeChannel');
      if (activeChannel) self.joinChannel(activeChannel);
    },

    // TODO: is there any difference between joinChannel and createChannel?
    joinChannel(channelId) {
      const channel = Channel.create({ id: channelId });
      self.channels.put(channel);
      self.activeChannel = channelId;
      storage.set('activeChannel', channelId);
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
      storage.set('activeChannel', channelId);
      /**
       * NOTE:
       * Messages are fetched automatically with `onPatch` listener
       * in /services/websocket.
       */
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
  }))
  .views(self => ({
    getMessages() {
      return self.activeChannel.messages;
    }
  }));

export default Chat;
