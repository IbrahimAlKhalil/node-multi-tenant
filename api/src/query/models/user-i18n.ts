import { defineModel } from '../define-model.js';

export default defineModel<'userI18n'>({
  accessControl: true,
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
    },
    POWER: true,
  },
});
