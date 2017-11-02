import { types } from 'mobx-state-tree';
import storage from 'store';
import User from '../user/user.model';

const Message = types
  .model({
    content: '',
    timestamp: types.optional(types.Date, () => new Date().getTime()),
    sender: types.reference(types.late(() => User)),
  });

const Chat = types
  .model({
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
    }
  }));

export default Chat;
