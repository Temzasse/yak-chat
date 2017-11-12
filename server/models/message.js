const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content: String,
  sender: {
    nickname: String
  }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
