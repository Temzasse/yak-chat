import { types } from 'mobx-state-tree';
import User from '../user/user.model';

const Message = types.model({
  content: '',
  type: types.optional(types.string, 'message'),
  timestamp: types.optional(types.string, () => {
    return new Date().toISOString();
  }),
  sender: types.reference(User)
});

const Channel = types
  .model({
    id: types.identifier(types.string),
    loadingMessages: false,
    unseenMessages: false,
    followingMessages: false,
    messages: types.optional(types.array(Message), [])
  })
  .actions(self => ({
    followMessages() {
      self.followingMessages = true;
      self.unseenMessages = false;
    },

    unfollowMessages() {
      self.followingMessages = false;
    },

    setLoading(status) {
      self.loadingMessages = status;
    }
  }));

export default Channel;
