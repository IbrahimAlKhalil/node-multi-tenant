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
      read: {
        fields: 'ALL.read',
      },
      create: {
        fields: new Set(['order']),
      },
    },
  },
});
