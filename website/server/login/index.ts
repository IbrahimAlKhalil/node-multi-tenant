import axios, { AxiosError, AxiosResponse } from 'axios';
import { ItemsService } from 'directus';
import * as https from 'https';
import express from 'express';

const login: express.RequestHandler = async (req, res, next) => {
  if (typeof req.body.code !== 'string') {
    return next();
  }

  const instituteService = new ItemsService('institute', {
    schema: (req as any)?.schema,
  });
  const institute = await instituteService.readByQuery({
    filter: {
      code: {
        _eq: req.body.code,
      },
    },
    fields: ['cluster.host'],
  });
  if (!institute || !institute.length) return next();

  const data = institute[0];

  let loginRes: AxiosResponse;

  try {
    loginRes = await axios.request({
      url: `https://${data.cluster.host}/auth/login`,
      data: req.body,
      method: 'POST',
      httpsAgent: new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      }),
    });

    loginRes.data.cluster = `https://${data.cluster.host}`;
  } catch (e) {
    loginRes = (e as AxiosError<any>).response!;
  }

  res
    .status(loginRes.status)
    .setHeader('set-cookie', loginRes.headers['set-cookie'] ?? '')
    .json(loginRes.data);
};

export default login;
