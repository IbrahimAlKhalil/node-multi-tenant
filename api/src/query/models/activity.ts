import { defineModel } from '../define-model.js';

export default defineModel<'activity'>({
  access: {
    POWER: {
      read: true,
    },
  },
});
