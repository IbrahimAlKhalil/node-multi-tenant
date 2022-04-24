import { prisma } from '../prisma';
import express from 'express';

const router = express.Router();

router.get('/:id', (req, res) => {
  prisma.cluster
    .findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        host: true,
      },
    })
    .then((cluster) => {
      if (cluster) {
        return res.json(cluster);
      }
      return res.status(404).send();
    })
    .catch(() => {
      res.status(404).send();
    });
});

export default router;
