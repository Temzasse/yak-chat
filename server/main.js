import Koa from 'koa';
import IO from 'koa-socket';
import koaConvert from 'koa-convert';
import koaBetterBody from 'koa-better-body';
import cors from 'kcors';
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

chat.on('message', ctx => {
  logger.info('message received!', ctx.data);
  chat.broadcast('response', 'foobar');
});


// TODO: remove
// Just testing sending messages to the client
let dummy;

chat.on('connection', () => {
  logger.info('socket connected!');
  let i = 0;

  if (dummy) clearInterval(dummy);

  dummy = setInterval(() => {
    i += 1;
    const msg = {
      content: `Teemu testiviesti ${i}`,
      timestamp: Date.now(),
      type: 'message',
      sender: {
        id: '99',
        nickname: 'Julle',
      }
    };

    chat.broadcast('CHAT_MESSAGE', msg);
  }, 5000);
});

chat.on('join', (ctx, data) => {
  logger.info('join event fired', data);
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
