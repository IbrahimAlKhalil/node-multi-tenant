import { Activity } from '../../../prisma/client';
import { defineModel } from '../define-model.js';

export default defineModel<Activity, 'activity'>({
  roles: {
    POWER: {
      read: true,
    },
  },
});
