import { defineModel } from '../define-model.js';

export default defineModel({
  kinds: {
    ALL: {
      read: {
        fields: true,
      },
    },
    ADMIN: true,
  },
});
