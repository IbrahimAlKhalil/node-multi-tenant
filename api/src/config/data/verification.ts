import { getEnvNum } from '../get-env.js';

export default function () {
  return {
    maxResend: getEnvNum('VERIFICATION_MAX_RESEND', 6),
    resendDelay: getEnvNum('VERIFICATION_RESEND_DELAY', 1.2e5), // 2 minutes
    maxItems: getEnvNum('VERIFICATION_MAX_ITEMS', 8),
  };
}
