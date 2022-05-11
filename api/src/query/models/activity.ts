import { Activity } from '../../../prisma/client';
import { defineModel } from '../define-model.js';

export default defineModel<Activity, 'activity'>({
  kinds: {
    POWER: {
      read: true,
    },
  },
});
