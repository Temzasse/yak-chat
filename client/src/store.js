import { types, flow } from 'mobx-state-tree';
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
    fetchUser: flow(function* fetchUser() {
      try {
        const { data: user } = yield storage.getUser();
        console.log('moi', user);
        if (user) self.user = User.create(user);
        self.userFetched = true;
      } catch (error) {
        console.log(error);
        self.userFetched = true;
      }
    }),

    setUser: flow(function* setUser(u) {
      const user = { ...u, id: Date.now().toString() };
      yield storage.setUser(user);
      self.user = User.create(user);
    }),
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
