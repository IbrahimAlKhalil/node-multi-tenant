import { defineModel } from '../define-model.js';

export default defineModel<'activity'>({
  kinds: {
    POWER: {
      read: true,
    },
  },
});
