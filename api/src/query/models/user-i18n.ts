import { defineModel } from '../define-model.js';

export default defineModel<'userI18n'>({
  accessControl: true,
  access: {
    ALL: {
      read: true,
    },
    POWER: true,
  },
});
