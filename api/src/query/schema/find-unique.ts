import Joi from 'joi';

export const findUnique = Joi.object({
  where: Joi.object().optional(),
  include: Joi.object().optional(),
  select: Joi.object().optional(),
});
