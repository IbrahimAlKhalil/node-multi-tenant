import Joi from 'joi';

export const count = Joi.object({
  where: Joi.object().optional(),
  cursor: Joi.object().optional(),
  distinct: Joi.array().items(Joi.string()).optional(),
  select: Joi.object().optional(),
  orderBy: Joi.object().optional(),
  skip: Joi.number().optional(),
  take: Joi.number().optional(),
}).required();
