import Joi from 'joi';
// prettier-ignore
export const createMany = Joi.object({
  data          : [Joi.object(), Joi.array().items(Joi.object().required())],
  skipDuplicates: Joi.boolean().optional(),
}).required();
