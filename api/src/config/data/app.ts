import { getEnv, getEnvNum } from '../get-env.js';

export default function () {
  return {
    env: getEnv('NODE_ENV') as nodeEnv,
    port: getEnvNum('API_PORT'),
    secret: getEnv('API_SECRET'),
    clusterHost: getEnv('CLUSTER_HOST'),
    clusterId: getEnv('CLUSTER_ID'),
    clusterSecret: getEnv('CLUSTER_SECRET'),
    websiteHost: getEnv('WEBSITE_HOST'),
  };
}

type nodeEnv = 'development' | 'production' | 'test' | 'staging';
