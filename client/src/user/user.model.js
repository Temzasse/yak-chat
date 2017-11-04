import { types } from 'mobx-state-tree';

const User = types
  .model({
    id: types.identifier(types.string),
    nickname: '',
  });

export default User;
