import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = new mongoose.Schema({
  // channel: ObjectId,
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
// MessageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 10 });

const Message = mongoose.model('Message', MessageSchema);


module.exports = Message;
