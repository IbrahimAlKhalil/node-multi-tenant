import joi from 'joi';

export interface VerifyInput {
  id: number;
  type: 'PASSWORD_RESET' | 'MOBILE' | 'EMAIL';
  key?: string;
  token?: number;
}

export const verifySchema = joi.object<VerifyInput>({
  id: joi.number().required(),
  type: joi.string().allow('PASSWORD_RESET', 'MOBILE', 'EMAIL').required(),
  key: joi.string().required().allow(''),
  token: joi.when('key', {
    is: '',
    then: joi.number().required(),
    otherwise: joi.number().allow(''),
  }),
});
