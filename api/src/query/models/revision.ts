import { defineModel } from '../define-model.js';

export default defineModel<'revision'>({
  kinds: {
    POWER: {
      read: true,
    },
  },
});
