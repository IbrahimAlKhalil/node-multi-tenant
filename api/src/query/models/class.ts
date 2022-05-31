import { defineModel } from '../define-model.js';
import { Class } from '../../../prisma/client';

export default defineModel<Class, 'class'>({
  kinds: {
    ALL: {
      read: {
        fields: true,
      },
    },
    POWER: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
  },
});
