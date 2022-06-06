import { getEnvNum } from '../get-env.js';

export default function () {
  return {
    maxAge: getEnvNum('PRISMA_MAX_AGE', 100 * 60 * 10), // 10 minutes in milliseconds
  };
}
