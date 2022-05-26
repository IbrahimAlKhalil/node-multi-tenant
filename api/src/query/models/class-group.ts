import { ClassGroup } from '../../../prisma/client';
import { defineModel } from '../define-model.js';

export default defineModel<ClassGroup, 'classGroup'>({
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
        fields: new Set(['id', 'classId']),
        preset: {
          classId: 2,
        },
      },
      update: {
        fields: 'POWER.create',
        preset: 'POWER.create',
      },
    },
  },
});
