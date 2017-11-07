import Koa from 'koa';
import IO from 'koa-socket';
import koaConvert from 'koa-convert';
import koaBetterBody from 'koa-better-body';
import cors from 'kcors';
import redis from 'redis';
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
    rClient.rpush(channelId, JSON.stringify(msg));
    // rClient.ltrim('messages', 0, 5);

    // Send message to channel
    sock.to(channelId).emit('CHAT_MESSAGE', msg);
  });

  sock.on('JOIN_CHANNEL', channelId => {
    sock.join(channelId);

    rClient.lrange(channelId, 0, -1, (err, reply) => {
      let messages;

      try {
        messages = reply.map(msg => JSON.parse(msg));
      } catch (error) {
        logger.error('Failed to parse messages for channel', channelId, error);
      }

      if (messages.length > 0) {
        // logger.info(`Messages for channel: ${channelId}`, messages);
        sock.emit('CHAT_MESSAGE_HISTORY', messages);
      }
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
