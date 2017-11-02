import { types } from 'mobx-state-tree';
import storage from 'store';
import Chat from './chat/chat.model';
import User from './user/user.model';

const RootStore = types
  .model({
    user: types.maybe(User),
    userFetched: false,
    chat: types.optional(Chat, {}),
    foo: ''
  })
  .actions(self => ({
    fetchUser() {
      const user = storage.get('user');

      if (user) {
        self.user = User.create(user);
      }

      self.userFetched = true;
    },
    setUser(user) {
      storage.set('user', user);
      self.user = User.create(user);
    },
    updateFoo() {
      self.foo = 'bar';
    }
  }))
  // Same as Redux selectors
  .views(self => ({
    getUser() {
      return self.user;
    },
  }));

export default RootStore.create({});
