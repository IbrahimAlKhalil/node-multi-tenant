import { defineModel } from '../define-model.js';

export default defineModel<'preset'>({
  kinds: {
    POWER: {
      read: {
        fields: true,
        permission(session) {
          return {
            id: session.uid,
          };
        },
      },
      create: {
        fields: new Set(['table', 'value']),
        preset(session) {
          return {
            id: session.uid,
          };
        },
      },
      update: {
        fields: new Set(['value']),
        permission: 'ALL.read',
      },
      delete: {
        permission: 'ALL.read',
      },
    },
  },
});
