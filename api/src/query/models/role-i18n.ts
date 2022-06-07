import { defineModel } from '../define-model.js';

export default defineModel<'roleI18n'>({
  accessControl: true,
  kinds: {
    POWER: true,
  },
});
