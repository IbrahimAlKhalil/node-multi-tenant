import { defineModel } from '../define-model.js';

export default defineModel<'user'>({
  accessControl: true,
  access: {
    ALL: {
      read: true,
    },
    POWER: true,
  },
});
