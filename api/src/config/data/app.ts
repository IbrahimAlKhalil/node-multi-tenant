import { getEnv, getEnvNum } from '../get-env.js';

export default function () {
  return {
    env: getEnv('NODE_ENV') as nodeEnv,
    port: getEnvNum('API_PORT'),
    secret: getEnv('API_SECRET'),
    clusterId: getEnv('CLUSTER_ID'),
    clusterSecret: getEnv('CLUSTER_SECRET'),
    clusterHost: getEnv('CLUSTER_HOST'),
    clusterOrigin: new URL(`https://${getEnv('CLUSTER_HOST')}`).origin,
    websiteHost: getEnv('WEBSITE_HOST'),
    websiteOrigin: new URL(`https://${getEnv('WEBSITE_HOST')}`).origin,
  };
}

type nodeEnv = 'development' | 'production' | 'test' | 'staging';
