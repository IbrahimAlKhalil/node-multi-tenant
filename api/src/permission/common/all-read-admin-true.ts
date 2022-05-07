import { defineModel } from '../define-model.js';

export default defineModel({
  roles: {
    ALL: {
      read: {
        fields: true,
      },
    },
    ADMIN: true,
  },
});
