import Joi from 'joi';

export const createMany = Joi.object({
  data: Joi.object().required(),
  skipDuplicates: Joi.boolean().optional(),
}).required();
