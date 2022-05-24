import Joi from 'joi';

export const upsert = Joi.object({
  create: Joi.object().optional(),
  update: Joi.object().optional(),
  where: Joi.object().optional(),
  include: Joi.object().optional(),
  select: Joi.object().optional(),
}).required();
