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
// import routes from './routes';

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
mongoose.connect('mongodb://mongodb/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  logger.info('Mongo connection open');
});

// Attach app to chat io instance
chat.attach(app);

app._io.on('connection', sock => {
  logger.info('socket connected!');

  sock.on('SEND_CHAT_MESSAGE', ({ channelId, msg }) => {
    msg.name = channelId;
    // TODO: error handling
    Message.create(msg, (err, createdMessage) => {
      Channel.findOneAndUpdate(
        { name: channelId },
        { $push: { messages: createdMessage._id } },
        { upsert: true, new: true },
        (channelErr, updatedChannel) => {
          console.log('message inserted ', channelErr, updatedChannel);
          // Send message to channel
          sock.to(channelId).emit('CHAT_MESSAGE', { channelId, msg });
        }
      );
    });
  });

  sock.on('JOIN_CHANNEL', channelId => {
    sock.join(channelId);

    // This should be possible to do with findOneAndUpdate
    // but it didn't work for some reason
    Channel.findOne({ name: channelId })
      .populate('messages')
      .exec((err, foundChannel) => {
        if (!foundChannel) {
          Channel.create({ name: channelId }, (err2, createdChannel) => {
            logger.info('Created channel ', err2, createdChannel);
          });
        } else {
          sock.emit('CHAT_MESSAGE_HISTORY', {
            channelId,
            messages: foundChannel.messages
          });
        }
      });
  });

  sock.on('LEAVE_CHANNEL', channelId => {
    sock.leave(channelId);
  });
});

// Logging handler: log errors only in prod
app.on('error', (err, ctx) => {
  logger.error({ err, req: ctx.req, res: ctx.res }, 'Caught unhandled exception.');
});

// Start the server.
app.listen(config.API_PORT, config.API_BINDADDR, () => {
  logger.info(`Server started at ${config.API_BINDADDR}:${config.API_PORT}`);
});

export default app;
