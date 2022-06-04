import Joi from 'joi';
// prettier-ignore
export const updateMany = Joi.object({
  include: Joi.object().optional(),
  select : Joi.object().optional(),
  data : Joi.object().required(),
  where: Joi.object().required(),
}).required();
