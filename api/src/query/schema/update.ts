import Joi from 'joi';
// prettier-ignore
export const update = Joi.object({
  data   : Joi.object().required(),
  where  : Joi.object().required(),
  include: Joi.object().optional(),
  select : Joi.object().optional(),
}).required();
