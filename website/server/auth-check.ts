import axios from 'axios';
import * as https from 'https';
import express from 'express';

const authCheck: express.RequestHandler = async (req, res, next) => {
  const csrfToken = req.header('x-csrf-token');
  const cookie = req.header('cookie');
  const cluster = req.body.cluster;

  if (!cluster) {
    return res.status(400).json({ error: 'Must sent a cluster!' });
  }

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
    return next();
  } catch (e) {
    //
  }

  return res.status(500).json({ error: 'Server error!' });
};

export default authCheck;
