import { getEnv, getEnvNum } from '../get-env.js';

export default function () {
  return {
    longTokenLifetime: getEnvNum('AUTH_TOKEN_LONG_LIFETIME', 1.8e6),
    shortTokenLifetime: getEnvNum('AUTH_TOKEN_SHORT_LIFETIME', 4.32e7),
    csrfTokenLength: getEnvNum('AUTH_CSRF_TOKEN_LENGTH', 16),
    cookieKey: getEnv('AUTH_TOKEN_COOKIE_KEY'),
  };
}
