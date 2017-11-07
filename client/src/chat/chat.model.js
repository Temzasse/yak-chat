import { types, flow, getParent } from 'mobx-state-tree';
import storage from 'store';
import User from '../user/user.model';

const Message = types
  .model({
    content: '',
    type: types.optional(types.string, 'message'),
    timestamp: types.optional(types.number, () => Date.now()),
    sender: types.reference(User),
  });

const Chat = types
  .model({
    loading: false,
    unseenMessages: false,
    followingMessages: false,
    messages: types.optional(types.array(Message), []),
    activeChannel: types.maybe(types.string),
  })
  .actions(self => ({
    fetchChannel() {
      const activeChannel = storage.get('activeChannel');
      if (activeChannel) self.joinChannel(activeChannel);
    },

    joinChannel(channelId) {
      console.debug('[channelId]', channelId);
      self.activeChannel = channelId;
      storage.set('activeChannel', channelId);
      // TODO: fetch messages
    },

    createChannel(channelId) {
      self.activeChannel = channelId;
      storage.set('activeChannel', channelId);
    },

    receiveMessage({ content, sender, timestamp = Date.now(), type = 'message' }) {
      const u = User.create({ ...sender });
      const msg = { content, sender: u, timestamp, type };
      self.messages.push(msg);

      /*
       * Show "You have new messages" thingy if someone else than the current
       * user added a new message.
       */
      const { user } = getParent(self);

      if (!self.followingMessages && sender.id !== user.id) {
        self.unseenMessages = true;
      }
    },

    addMessage({ content, sender, timestamp = Date.now(), type = 'message' }) {
      const u = User.create({ ...sender });
      const msg = { content, sender: u, timestamp, type };
      self.messages.push(msg);

      /*
       * Show "You have new messages" thingy if someone else than the current
       * user added a new message.
       */
      const { user } = getParent(self);

      if (!self.followingMessages && sender.id !== user.id) {
        self.unseenMessages = true;
      }
    },

    followMessages() {
      self.followingMessages = true;
      self.unseenMessages = false;
    },

    unfollowMessages() {
      self.followingMessages = false;
    },

    fetchMessages: flow(function* fetchMessages() {
      self.loading = true;

      try {
        // TODO: user self.activeChannel here to fetch messages
        const messages = yield fetch('/messages.json').then(res => res.json());
        self.messages = messages
          .map(msg => ({ ...msg, sender: User.create(msg.sender) }))
          .sort((a, b) => a.timestamp - b.timestamp);
      } catch (e) {
        console.log('Error in fetchMessages', e);
        throw e;
      }

      self.loading = false;
    }),
  }));

export default Chat;
