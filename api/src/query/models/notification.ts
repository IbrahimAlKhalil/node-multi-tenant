import { defineModel } from '../define-model.js';

export default defineModel<'notification'>({
  kinds: {
    ALL: {
      read: {
        fields: true,
        permission(session) {
          return {
            userId: session.uid,
          };
        },
      },
      update: {
        fields: new Set(),
        permission: 'ALL.read',
        preset: {
          read: true,
        },
      },
    },
    POWER: true,
  },
});
