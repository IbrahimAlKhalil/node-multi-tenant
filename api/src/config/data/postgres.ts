import { getEnv, getEnvNum } from '../get-env.js';

export default function () {
  return {
    host: getEnv('POSTGRES_HOST'),
    port: getEnvNum('POSTGRES_PORT', 5432),
    database: getEnv('POSTGRES_DATABASE', 'postgres'),
    user: getEnv('POSTGRES_USER'),
    password: getEnv('POSTGRES_PASSWORD'),
  };
}
