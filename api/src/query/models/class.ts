import { defineModel } from '../define-model.js';

export default defineModel<'class'>({
  kinds: {
    ALL: {
      read: {
        fields: true,
      },
    },
    POWER: {
      read: true,
      create: {
        fields: true,
        preset: {
          order: 10,
        },
      },
      update: true,
      delete: true,
    },
  },
});
