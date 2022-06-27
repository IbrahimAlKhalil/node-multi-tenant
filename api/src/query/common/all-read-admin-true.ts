import { defineModel } from '../define-model.js';

export default defineModel({
  access: {
    ALL: {
      read: {
        fields: true,
      },
    },
    ADMIN: true,
  },
});
