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

// Middlewares
// TODO: if needed

// Router
// TODO: if needed
// const router = koaRouter();
// routes(router); // Inject router to all routes

// app.use(router.routes());
// app.use(router.allowedMethods({
//   throw: true,
//   notImplemented: () => Boom.notImplemented(),
//   methodNotAllowed: () => Boom.methodNotAllowed(),
// }));


// Attach app to chat io instance
chat.attach(app);

// TODO: remove
// Just testing sending messages to the client
let dummy;

// chat.on('connection', () => {
app._io.on('connection', sock => {
  logger.info('socket connected!');


  sock.on('SEND_CHAT_MESSAGE', msg => {
    rClient.rpush('messages', JSON.stringify(msg));
    //rClient.ltrim('messages', 0, 5);
    sock.to('default-channel').emit('CHAT_MESSAGE', msg);
  });

  sock.on('JOIN', data => {
    const room = data.channel;
    sock.join(room);
  });

  const rmessages = rClient.lrange('messages', 0, -1, (err, reply) => {
    const messages = reply.map(msg => JSON.parse(msg));
    logger.info('Messages from redis ', messages);
    chat.broadcast('CHAT_MESSAGE_HISTORY', messages);
  });

  // let i = 0;
  // if (dummy) clearInterval(dummy);

  // dummy = setInterval(() => {
  //   i += 1;
  //   const msg = {
  //     content: `Teemu testiviesti ${i}`,
  //     timestamp: Date.now(),
  //     type: 'message',
  //     sender: {
  //       id: '99',
  //       nickname: 'Julle',
  //     }
  //   };
  //   rClient.lpush('messages', JSON.stringify(msg));
  //   rClient.ltrim('messages', 0, 5);
  //
  //   chat.broadcast('CHAT_MESSAGE', msg);
  // }, 5000);
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
