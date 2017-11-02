import { types } from 'mobx-state-tree';
import store from 'store';
import Chat from './chat/chat.model';
import User from './user/user.model';

const RootStore = types
  .model({
    user: types.optional(User, {}),
    userFetched: false,
    userFound: true,
    chat: types.optional(Chat, {}),
  })
  .actions(self => ({
    fetchUser: () => {
      const user = store.get('user');

      if (user) {
        self.user = user;
      } else {
        self.userFound = false;
      }

      self.userFetched = true;
    }
  }));

export default RootStore.create({});
