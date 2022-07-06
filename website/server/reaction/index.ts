import { ItemsService } from 'directus';
import express from 'express';

const reaction: express.RequestHandler = async (req, res, next) => {
  const uid = (req as any).session.uid;

  if (!uid) {
    return res.status(400).json({ error: 'User not authenticated!' });
  }

  if (!req.body.reaction) {
    return res.status(400).json({ error: 'Reaction missing in your request!' });
  }

  const postReactionService = new ItemsService('post_reaction', {
    schema: (req as any)?.schema,
  });

  try {
    await postReactionService.createOne({
      reaction: Number(req.body.reaction),
      post: Number(req.body.post),
      user_id: uid,
    });
  } catch (e) {
    return res.status(500).json({ error: 'Server error!' });
  }

  res.status(200).json({ message: 'Reaction created!' });
};

export default reaction;
