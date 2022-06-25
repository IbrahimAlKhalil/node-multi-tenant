import { ItemsService } from 'directus';
import express from 'express';

const newsletter = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (!req.body) next();

  const { email } = req.body;

  const newsletterService = new ItemsService('newsletter', {
    schema: (req as any)?.schema,
  });
  const subscription = await newsletterService.createOne({ email });

  if (!subscription) next();
  res.status(200).send({ data: subscription });
};

export default newsletter;
