import path from 'path';

// Configs

const required = [
  'API_BINDADDR',
  'API_PORT',
  'ENV',
  'DEBUG',
  'APP_NAME',
];

const config = {};

function mapBool(input) {
  if (input === '0' || input === 'false' || input === 'f') return false;
  return !!input;
}

config.ENV = process.env.ENV;
config.DEBUG = mapBool(process.env.DEBUG);
config.APP_NAME = 'yak-server';
config.API_PORT = process.env.API_PORT;
config.API_BINDADDR = process.env.API_BINDADDR;

// Check requirements
required.forEach(req => {
  if (config[req] === undefined) {
    throw new Error(
      `FATAL: Configuration problem: param "${req}" undefined.
      Maybe missing ENV var?`
    );
  }
});

export default config;