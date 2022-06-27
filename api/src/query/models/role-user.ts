import { defineModel } from '../define-model.js';

export default defineModel<'roleUser'>({
  accessControl: true,
  access: {
    POWER: true,
  },
});
