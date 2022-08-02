import joi from 'joi';

export interface RequestResetPasswordInput {
  username: string;
  code: string;
}

export const requestResetPasswordSchema = joi.object<RequestResetPasswordInput>(
  {
    username: joi.string().required(),
    code: joi.string().required(),
  },
);
