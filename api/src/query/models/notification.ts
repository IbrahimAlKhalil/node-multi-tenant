import { defineModel } from '../define-model.js';

export default defineModel<'notification'>({
  accessControl: true,
  access: {
    AUTHENTICATED: {
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
        permission: 'AUTHENTICATED.read',
        preset: {
          read: true,
        },
      },
    },
    POWER: true,
  },
});
