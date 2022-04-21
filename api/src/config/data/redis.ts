import { getEnv, getEnvNum } from '../get-env.js';

export default function () {
  return {
    host: getEnv('REDIS_HOST'),
    port: getEnvNum('REDIS_PORT', 6379),
    password: getEnv('REDIS_PASSWORD', null),
  };
}
