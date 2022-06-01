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
      update: true,
      create: {
        fields: true,
        preset: {
          name: 'Preset Test',
        },
      },
      delete: {
        permission: {
          where: {
            classId: {
              not: 27,
            },
          },
        },
      },
    },
  },
});
