import { defineModel } from '../define-model.js';

export default defineModel({
  accessControl: true,
  kinds: {
    ALL: {
      read: {
        fields: true,
      },
    },
    POWER: true,
  },
});
