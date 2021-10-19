import client_config from './rollup.config.client'
import server_config from './rollup.config.server'

import pkg from './package.json';

const watching = !!process.env.ROLLUP_WATCH;
const development = watching;
const production = !development;

const opts = { development, production, watching, pkg }

export default [
  client_config(opts),
  server_config(opts),
];
