import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const ChannelSchema = new mongoose.Schema({
  name: String,
  messages: [{
    type: ObjectId,
    ref: 'Message'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Channel = mongoose.model('Channel', ChannelSchema);

module.exports = Channel;
