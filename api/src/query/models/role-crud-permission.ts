import { defineModel } from '../define-model.js';

export default defineModel<'roleCrudPermission'>({
  accessControl: true,
  kinds: {
    POWER: true,
  },
});
