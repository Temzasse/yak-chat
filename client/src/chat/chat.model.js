import { types, flow } from 'mobx-state-tree';
import storage from 'store';
import User from '../user/user.model';

const Message = types
  .model({
    content: '',
    type: types.optional(types.string, 'message'),
    timestamp: types.optional(types.Date, () => Date.now()),
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

    fetchMessages: flow(function* fetchMessages() {
      self.loading = true;

      try {
        // TODO: user self.activeChannel here to fetch messages
        const messages = yield fetch('/messages.json').then(res => res.json());
        self.messages = messages.map(m => ({
          ...m,
          sender: User.create(m.sender),
        }));
      } catch (e) {
        console.log('Error in fetchMessages', e);
        throw e;
      }

      self.loading = false;
    }),
  }));

export default Chat;
