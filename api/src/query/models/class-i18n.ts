import { ClassI18n } from '../../../prisma/client';
import { defineModel } from '../define-model.js';

export default defineModel<ClassI18n, 'classI18n'>({
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
      update: {
        fields: 'ALL.read',
      },
      create: {
        fields: 'ALL.read',
      },
    },
  },
});
