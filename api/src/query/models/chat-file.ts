import { defineModel } from '../define-model.js';

export default defineModel<'chatFile'>({
  access: {
    POWER: {
      read: {
        fields: true,
        permission(session) {
          return {
            Chat: {
              userId: session.uid,
            },
          };
        },
      },
    },
  },
});
