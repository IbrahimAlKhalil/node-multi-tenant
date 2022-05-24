import Joi from 'joi';

export const updateMany = Joi.object({
  data: Joi.object().required(),
  where: Joi.object().optional(),
}).required();
