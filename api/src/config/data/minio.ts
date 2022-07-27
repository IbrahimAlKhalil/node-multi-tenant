import { getEnv, getEnvNum } from '../get-env.js';

export default function () {
  return {
    endpoint: getEnv('MINIO_ENDPOINT'),
    port: getEnvNum('MINIO_PORT'),
    username: getEnv('MINIO_ROOT_USER'),
    password: getEnv('MINIO_ROOT_PASSWORD'),
    useSSL:
      process.env.MINIO_USE_SSL === 'false'
        ? false
        : !!process.env.MINIO_USE_SSL,
  };
}
