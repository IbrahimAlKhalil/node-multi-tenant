import { prisma } from '../prisma';
import express from 'express';

const router = express.Router();

const fields = {
  id: true,
  name: true,
  slug: true,
  database: true,
  clusterId: true,
};

router.get('/:id', (req, res) => {
  prisma.institute
    .findUnique({
      where: {
        id: req.params.id,
      },
      select: fields,
    })
    .then((institute) => {
      if (institute) {
        return res.json(institute);
      }
      return res.status(404).send();
    })
    .catch(() => {
      res.status(404).send();
    });
});

router.get('/by-slug/:slug', (req, res) => {
  prisma.institute
    .findUnique({
      where: {
        slug: req.params.slug,
      },
      select: fields,
    })
    .then((institute) => {
      if (institute) {
        return res.json(institute);
      }
      return res.status(404).send();
    })
    .catch(() => {
      res.status(404).send();
    });
});

router.get('/by-cluster-id/:clusterId', (req, res) => {
  prisma.institute
    .findMany({
      where: {
        clusterId: req.params.clusterId,
      },
      select: fields,
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

router.get('/', (req, res) => {
  prisma.institute
    .findMany({
      select: fields,
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
