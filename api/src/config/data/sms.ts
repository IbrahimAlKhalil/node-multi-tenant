import { getEnv } from '../get-env.js';

export default function () {
  return {
    api: getEnv('SMS_API'),
    apiKey: getEnv('SMS_API_KEY'),
    senderId: getEnv('SMS_SENDER_ID'),
  };
}
