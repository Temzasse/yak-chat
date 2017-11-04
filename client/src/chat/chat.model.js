import { types, flow } from 'mobx-state-tree';
import storage from 'store';
import User from '../user/user.model';

const Message = types
  .model({
    content: '',
    type: types.optional(types.string, 'message'),
    timestamp: types.optional(types.number, () => Date.now()),
    sender: types.reference(types.late(() => User)),
  });

const Chat = types
  .model({
    loading: false,
    messages: types.optional(types.array(Message), []),
    activeChannel: types.maybe(types.string),
  })
  .actions(self => ({
    fetchChannel() {
      const activeChannel = storage.get('activeChannel');
      if (activeChannel) self.activeChannel = activeChannel;
      // TODO: fetch messages
    },

    joinChannel(channelId) {
      self.activeChannel = channelId;
      storage.set('activeChannel', channelId);
      // TODO: fetch messages
    },

    createChannel(channelId) {
      self.activeChannel = channelId;
      storage.set('activeChannel', channelId);
    },

    addMessage({ content, sender }) {
      const timestamp = Date.now();
      self.messages.push({
        content,
        sender,
        timestamp,
        type: 'message',
      });
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
