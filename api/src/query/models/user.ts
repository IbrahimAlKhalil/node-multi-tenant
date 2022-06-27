import { defineModel } from '../define-model.js';

export default defineModel<'user'>({
  accessControl: true,
  access: {
    ALL: {
      read: {
        fields: true,
        permission(session) {
          return {
            id: session.uid,
          };
        },
      },
    },
    POWER: true,
  },
});
