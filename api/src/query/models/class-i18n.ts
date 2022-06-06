import { defineModel } from '../define-model.js';

export default defineModel<'classI18n'>({
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
          classId: {
            not: 27,
          },
        },
      },
    },
  },
});
