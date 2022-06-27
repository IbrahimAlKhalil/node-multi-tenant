import { defineModel } from '../define-model.js';

export default defineModel<'revision'>({
  access: {
    POWER: {
      read: true,
    },
  },
});
