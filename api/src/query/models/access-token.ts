import { defineModel } from '../define-model.js';

export default defineModel<'accessToken'>({
  access: {
    ALL: {
      read: {
        fields: true,
        permission(session) {
          return {
            userId: session.uid,
          };
        },
      },
      delete: {
        permission: 'ALL.read',
      },
    },
  },
});
