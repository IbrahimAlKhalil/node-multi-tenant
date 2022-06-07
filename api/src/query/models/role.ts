import { defineModel } from '../define-model.js';

export default defineModel<'role'>({
  accessControl: true,
  kinds: {
    POWER: true,
  },
});
