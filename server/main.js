import Koa from 'koa';
import IO from 'koa-socket';
import koaConvert from 'koa-convert';
import koaBetterBody from 'koa-better-body';
import mongoose from 'mongoose';
import cors from 'kcors';
import Message from './models/message';
import Channel from './models/channel';
// import Boom from 'boom';
// import koaRouter from 'koa-router';

import config from './config';
import logger from './logger';
import { notifyChannel, subscribeToChannel } from './notifications';
// import routes from './routes';

import generateChannelId from './generator/generate';

const app = new Koa();
const chat = new IO();

// Use Cors
app.use(cors());

// Parse body payloads (json, form data etc)
app.use(koaConvert(koaBetterBody({
  // uploadDir: config.UPLOAD_PATH,
  encoding: 'utf-8',
  keepExtensions: true,
  jsonLimit: '10mb'
})));

// Mongoose
logger.info(`> Connecting mongodb to ${config.MONGO_URL}...`);
mongoose.connect(`mongodb://${config.MONGO_URL}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  logger.info('> Mongo connection open');
});

// Attach app to chat io instance
chat.attach(app);

app._io.on('connection', sock => {
  logger.info('> socket connected!');

  sock.on('SEND_CHAT_MESSAGE', ({ channelId, msg }) => {
    msg.name = channelId;
    // TODO: error handling
    Message.create(msg, (err, createdMessage) => {
      Channel.findOneAndUpdate(
        { name: channelId },
        { $push: { messages: createdMessage._id } },
        { upsert: true, new: true },
        (channelErr, updatedChannel) => {
          // Send message to channel
          sock.to(channelId).emit('CHAT_MESSAGE', { channelId, msg });
        }
      );
    });

    notifyChannel(channelId, {
      title: msg.sender.nickname,
      body: msg.content.length > 30
        ? `${msg.content.substring(0, 30)}...`
        : msg.content,
    });
  });

  sock.on('JOIN_CHANNEL', ({ channelId, fcmToken }) => {
    if (!channelId) return;
    sock.join(channelId);

    // Emit updated user count to other clients
    logger.info(`GET_CHANNEL_USER_COUNT: ${channelId}`);
    const roomData = sock.adapter.rooms[channelId];
    const count = roomData ? roomData.length : 0;
    app._io.in(channelId).emit('CHANNEL_USER_COUNT', { channelId, count });

    // Handle notifications
    if (fcmToken) subscribeToChannel(channelId, fcmToken);

    // This should be possible to do with findOneAndUpdate
    // but it didn't work for some reason
    Channel.findOne({ name: channelId })
      .populate('messages')
      .exec((err, foundChannel) => {
        if (!foundChannel) {
          Channel.create({ name: channelId }, (err2, createdChannel) => {
            logger.info('> Created channel ', err2, createdChannel);
            sock.emit('CHAT_MESSAGE_HISTORY', {
              channelId,
              messages: createdChannel.messages
            });
          });
        } else {
          sock.emit('CHAT_MESSAGE_HISTORY', {
            channelId,
            messages: foundChannel.messages
          });
        }
      });
  });

  sock.onclose = function(reason) {
    const rooms = Object.keys(sock.rooms);
    rooms.forEach(channelId => {
      sock.leave(channelId);
      // Emit updated user count to other clients
      logger.info(`GET_CHANNEL_USER_COUNT: ${channelId}`);
      const roomData = sock.adapter.rooms[channelId];
      const count = roomData ? roomData.length : 0;
      app._io.in(channelId).emit('CHANNEL_USER_COUNT', { channelId, count });
    });
  };

  sock.on('LEAVE_CHANNEL', channelId => {
    sock.leave(channelId);

    // Emit updated user count to other clients
    logger.info(`GET_CHANNEL_USER_COUNT: ${channelId}`);
    const roomData = sock.adapter.rooms[channelId];
    const count = roomData ? roomData.length : 0;
    sock.emit('CHANNEL_USER_COUNT', { channelId, count });
  });

  sock.on('GET_CHANNEL_USER_COUNT', channelId => {
    logger.info(`GET_CHANNEL_USER_COUNT: ${channelId}`);
    const roomData = sock.adapter.rooms[channelId];
    const count = roomData ? roomData.length : 0;
    sock.emit('CHANNEL_USER_COUNT', { channelId, count });
  });

  sock.on('GENERATE_CHANNEL_ID', () => {
    sock.emit('GENERATED_CHANNEL_ID', generateChannelId());
  });
});

// Logging handler: log errors only in prod
app.on('error', (err, ctx) => {
  logger.error(
    { err, req: ctx.req, res: ctx.res },
    'Caught unhandled exception.'
  );
});

// Start the server.
app.listen(config.API_PORT, config.API_BINDADDR, () => {
  logger.info(`> Server started at ${config.API_BINDADDR}:${config.API_PORT}`);
});

export default app;
