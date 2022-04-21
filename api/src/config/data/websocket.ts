import { getEnv, getEnvNum } from '../get-env.js';

export default function () {
  return {
    idleTimeout: getEnvNum('WEBSOCKET_IDLE_TIMEOUT', 60),
    maxBackpressure: getEnvNum('WEBSOCKET_MAX_BACKPRESSURE', 1e6),
    maxPayloadLength: getEnvNum('WEBSOCKET_MAX_PAYLOAD_LENGTH', 300000),
    maxConnections: getEnvNum('WEBSOCKET_MAX_CONNECTION', 10),
    sslKey: getEnv('WEBSOCKET_SSL_KEY', null),
    sslCert: getEnv('WEBSOCKET_SSL_CERT', null),
  };
}
