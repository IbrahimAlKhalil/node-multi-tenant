import Joi from 'joi';
// prettier-ignore
export const createMany = Joi.object({
  data          : [Joi.object(), Joi.array().has(Joi.object())],
  skipDuplicates: Joi.boolean().optional(),
}).required();
