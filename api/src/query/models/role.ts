import { defineModel } from '../define-model.js';

export default defineModel<'role'>({
  accessControl: true,
  access: {
    POWER: true,
  },
});
