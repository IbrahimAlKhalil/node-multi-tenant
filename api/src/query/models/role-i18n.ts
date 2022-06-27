import { defineModel } from '../define-model.js';

export default defineModel<'roleI18n'>({
  accessControl: true,
  access: {
    POWER: true,
  },
});
