import { defineModel } from '../define-model.js';

export default defineModel<'setting'>({
  access: {
    ADMIN: true,
  },
});
