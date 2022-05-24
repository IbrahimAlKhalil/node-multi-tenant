import Joi from 'joi';

export const deleteMany = Joi.object({
  where: Joi.object().optional(),
}).required();
