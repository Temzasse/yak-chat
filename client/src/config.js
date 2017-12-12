const IS_PROD = process.env.NODE_ENV === 'production';
const IS_DEMO = process.env.REACT_APP_DEMO === 'true';

let API_URL = IS_PROD
  ? 'http://0.0.0.0:3332'
  : `http://${window.location.host}/`;

if (IS_DEMO) API_URL = 'https://0a4910cb.ngrok.io';

const config = {
  IS_PROD,
  API_URL,
};

export default config;
