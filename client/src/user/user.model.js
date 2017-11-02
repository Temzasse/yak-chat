import { types } from 'mobx-state-tree';

const User = types
  .model({
    nickname: '',
  });

export default User;
