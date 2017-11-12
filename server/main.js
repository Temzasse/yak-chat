import Koa from 'koa';
import IO from 'koa-socket';
import koaConvert from 'koa-convert';
import koaBetterBody from 'koa-better-body';
import mongoose from 'mongoose';
import cors from 'kcors';
import redis from 'redis';
import Message from './models/message';
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
  jsonLimit: '10mb',
})));

// Mongoose
mongoose.connect('mongodb://mongodb/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.debug('Mongo connection open');
  // we're connected!
});

// Redis
const credentials = {
  host: 'redis',
  port: 6379
};
const rClient = redis.createClient({
  host: credentials.host,
  port: credentials.port
});

// Attach app to chat io instance
chat.attach(app);

app._io.on('connection', sock => {
  logger.info('socket connected!');

  sock.on('SEND_CHAT_MESSAGE', ({ channelId, msg }) => {
    console.debug('CHAT MSG ', msg);
    Message.create({ msg }, (err, createdMessage) => {
      console.debug('Message created? ', err, createdMessage);
    });
    rClient.rpush(channelId, JSON.stringify(msg));
    // Send message to channel
    sock.to(channelId).emit('CHAT_MESSAGE', ({ channelId, msg }));
  });

  sock.on('JOIN_CHANNEL', channelId => {
    sock.join(channelId);
    console.debug('join channel ', channelId);
    rClient.lrange(channelId, 0, -1, (err, reply) => {
      let messages;

      try {
        messages = reply.map(msg => JSON.parse(msg));
      } catch (error) {
        logger.error('Failed to parse messages for channel', channelId, error);
      }

      // Always return history even if there are no messages!
      sock.emit('CHAT_MESSAGE_HISTORY', ({ channelId, messages }));
    });
  });

  sock.on('LEAVE_CHANNEL', channelId => {
    sock.leave(channelId);
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
app.listen(
  config.API_PORT,
  config.API_BINDADDR,
  () => {
    logger.info(`Server started at ${config.API_BINDADDR}:${config.API_PORT}`);
  }
);

export default app;
