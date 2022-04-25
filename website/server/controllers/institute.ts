import { clusterAuth } from '../middlewares/cluster-auth';
import { prisma } from '../prisma';
import express from 'express';

const router = express.Router();

router.use(clusterAuth);

router.get('/by-cluster-id/:clusterId', (req, res) => {
  prisma.institute
    .findMany({
      where: {
        clusterId: req.params.clusterId,
        disabled: false,
      },
    })
    .then((institutes) => {
      if (institutes) {
        return res.json(institutes);
      }
      return res.status(404).send();
    })
    .catch(() => {
      res.status(404).send();
    });
});

export default router;
