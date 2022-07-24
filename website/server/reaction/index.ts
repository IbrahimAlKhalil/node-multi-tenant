import { ItemsService } from 'directus';
import express from 'express';

const reaction: express.RequestHandler = async (req, res, next) => {
  const { uid } = (req as any).session;
  const { instituteId } = req as any;

  if (!uid || !instituteId) {
    return res.status(400).json({ error: 'User not authenticated!' });
  }

  if (!req.body.reaction) {
    return res.status(400).json({ error: 'Reaction missing in your request!' });
  }

  const postReactionService = new ItemsService('post_reaction', {
    schema: (req as any)?.schema,
  });

  try {
    /**
     * Find previous reaction
     */
    const prevReaction = await postReactionService.readByQuery({
      filter: {
        _and: [
          {
            post: {
              _eq: Number(req.body.post),
            },
          },
          {
            user_id: {
              _eq: uid,
            },
          },
        ],
      },
    });
    if (prevReaction.length) {
      // update reaction
      await postReactionService.updateOne(prevReaction[0].id, {
        reaction: Number(req.body.reaction),
        post: Number(req.body.post),
        user_id: uid,
        institute: instituteId,
      });
    } else {
      // Create new reaction
      await postReactionService.createOne({
        reaction: Number(req.body.reaction),
        post: Number(req.body.post),
        user_id: uid,
        institute: instituteId,
      });
    }
  } catch (e) {
    console.error('Reaction create error', e);
    return res
      .status(500)
      .json({ error: 'Server error to creating reaction!' });
  }

  res.status(200).json({ message: 'Reaction created!' });
};

export default reaction;
