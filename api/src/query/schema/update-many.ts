import Joi from 'joi';
// prettier-ignore
export const updateMany = Joi.object({
  data : Joi.object().required(),
  where: Joi.object().optional(),
}).required();
