import axios from 'axios';
import express from 'express';
import * as https from 'https';
import { ItemsService } from 'directus';

const authCheck: express.RequestHandler = async (req, res, next) => {
  const csrfToken = req.header('x-csrf-token');
  const cookie = req.header('cookie');
  const cluster = req.body.cluster;

  if (!cluster) {
    return res.status(400).json({ error: 'Must sent a cluster!' });
  }

  const instituteService = new ItemsService('institute', {
    schema: (req as any)?.schema,
  });

  try {
    const authRes = await axios.request({
      url: `${cluster}/auth/authenticate`,
      method: 'GET',
      httpsAgent: new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      }),
      headers: {
        'X-Csrf-Token': csrfToken ?? '',
        Cookie: cookie ?? '',
      },
    });
    (req as any).session = authRes.data;

    const institute = await instituteService.readByQuery({
      filter: {
        code: {
          _eq: authRes.data.iid,
        },
      },
    });

    const { id } = institute[0];

    if (!id) {
      return res.status(400).json({ error: 'Institute missing!' });
    } else {
      (req as any).instituteId = id;
    }

    return next();
  } catch (e) {
    console.error(e);
  }

  return res.status(500).json({ error: 'Server error in authenticate!' });
};

export default authCheck;
