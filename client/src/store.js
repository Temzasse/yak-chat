import { types } from 'mobx-state-tree';
import storage from './services/storage';
import Chat from './chat/chat.model';
import User from './user/user.model';

const RootStore = types
  .model({
    user: types.maybe(User),
    userFetched: false,
    chat: types.optional(Chat, {}),
  })
  .actions(self => ({
    fetchUser() {
      const user = storage.getUser();
      if (user) self.user = User.create(user);
      self.userFetched = true;
    },

    setUser(u) {
      const user = { ...u, id: Date.now().toString() };
      storage.setUser(user);
      self.user = User.create(user);
    },
  }))
  // Same as Redux selectors
  .views(self => ({
    getUser() {
      return self.user;
    },
  }));

const createStore = (deps = {}) => {
  return RootStore.create({}, { ...deps });
};

export default createStore;
