import { types } from 'mobx-state-tree';
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
  });

export default Chat;
