import { Handler } from 'express';

export const clusterAuth: Handler = (req, res, next) => {
  if (req.query.secret !== process.env.CLUSTER_SECRET) {
    res.status(401).send('Unauthorized');
  } else {
    next();
  }
};
