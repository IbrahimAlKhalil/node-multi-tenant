import joi from 'joi';

export interface PasswordResetInput {
  username: string;
  code: string;
  type: string;
}

export const passwordResetSchema = joi.object<PasswordResetInput>({
  username: joi.string().required(),
  code: joi.string().required(),
  type: joi.string().required(),
});
