import joi from 'joi';

export interface VerificationInput {
  emailOrMobile: string;
  type: 'PASSWORD_RESET' | 'MOBILE' | 'EMAIL';
  target: string;
}

export const verificationSchema = joi.object<VerificationInput>({
  emailOrMobile: joi.string().when('type', {
    is: 'PASSWORD_RESET',
    then: joi.required(),
  }),
  type: joi.string().allow('PASSWORD_RESET', 'MOBILE', 'EMAIL').required(),
  target: joi.string().when('type', {
    is: joi.string().valid('EMAIL', 'MOBILE'),
    then: joi.required(),
  }),
});
