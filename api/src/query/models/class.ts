import { defineModel } from '../define-model.js';
import Joi from 'joi';

export default defineModel<'class'>({
  schema: Joi.object({
    order: Joi.number().integer().max(100),
  }),
  kinds: {
    POWER: {
      read: true,
      create: true,
      update: true,
    },
  },
});
