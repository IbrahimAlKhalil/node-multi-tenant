import { defineModel } from '../define-model.js';

export default defineModel<'roleUser'>({
  accessControl: true,
  kinds: {
    POWER: true,
  },
});
