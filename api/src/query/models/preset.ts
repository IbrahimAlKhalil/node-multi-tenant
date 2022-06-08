import { defineModel } from '../define-model.js';

export default defineModel<'preset'>({
  accessControl: true,
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
        permission: 'POWER.read',
      },
      delete: {
        permission: 'POWER.read',
      },
    },
  },
});
