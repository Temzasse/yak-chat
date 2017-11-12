const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  title: String
});

module.exports = {
  channelSchema
};
