import joi from 'joi';

export interface ChangePasswordInput {
  userId?: number;
  oldPassword: string;
  newPassword: string;
}

export const changePasswordSchema = joi.object<ChangePasswordInput>({
  userId: joi.number().optional(),
  oldPassword: joi.string().required(),
  newPassword: joi.string().required(),
});