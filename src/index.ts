import * as dotenv from 'dotenv'
dotenv.config()

import configLocal from './config/local.js';
import configProduction from './config/production.js';

import app from './server.js';

const config = process.env.NODE_ENV === 'production'
  ? configProduction
  : configLocal;

app.listen(config.port, () => {
  console.log(`hello on http://localhost:${config.port}`);
});

