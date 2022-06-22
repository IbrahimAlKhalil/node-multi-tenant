import { ItemsService } from 'directus';
import express from 'express';

const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (!req.body) next();

  const { code, username, password, rememberMe } = req.body;

  const instituteService = new ItemsService('institute', {
    schema: (req as any)?.schema,
  });
  const institute = await instituteService.readByQuery({
    filter: {
      code: {
        _eq: code,
      },
    },
    fields: ['cluster.host', 'cluster.id', 'id', 'name'],
  });
  if (!institute) next();

  const data = institute[0];
  const url = `https://${data.cluster.host}//auth/login/${data.id}`;
  // Import node-fetch
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      rememberMe,
    }),
  });
  const responseData = await response.json();

  res.status(200).send({ data: responseData });
};

export default login;
