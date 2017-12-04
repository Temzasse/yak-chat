import mongoose from 'mongoose';
import config from '../config';

const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = new mongoose.Schema({
  // channel: ObjectId,
  id: String,
  content: String,
  sender: {
    nickname: String,
    id: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
});

// Enable expiration
MessageSchema.index({ timestamp: 1 }, { expireAfterSeconds: config.MESSAGE_EXPIRY_TIME_HOURS * 3600 });

const Message = mongoose.model('Message', MessageSchema);


module.exports = Message;
