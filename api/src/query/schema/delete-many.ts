import Joi from 'joi';

export const deleteMany = Joi.object({
  where: Joi.object().required(),
  select: Joi.object().optional(),
  include: Joi.object().optional(),
}).required();
