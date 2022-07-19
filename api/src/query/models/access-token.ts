import { defineModel } from '../define-model.js';

export default defineModel<'accessToken'>({
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
      delete: {
        permission: 'AUTHENTICATED.read',
      },
    },
  },
});
