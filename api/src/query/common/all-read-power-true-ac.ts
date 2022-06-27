import { defineModel } from '../define-model.js';

export default defineModel({
  accessControl: true,
  access: {
    ALL: {
      read: {
        fields: true,
      },
    },
    POWER: true,
  },
});
