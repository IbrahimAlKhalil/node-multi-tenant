import Joi from 'joi';

export const update = Joi.object({
  data: Joi.object().required(),
  where: Joi.object().optional(),
  include: Joi.object().optional(),
  select: Joi.object().optional(),
}).required();
