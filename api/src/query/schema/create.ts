import Joi from 'joi';

export const create = Joi.object({
  data: Joi.object().required(),
  include: Joi.object().optional(),
  select: Joi.object().optional(),
}).required();
