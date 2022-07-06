import { ItemsService } from 'directus';
import express from 'express';

const comment: express.RequestHandler = async (req, res, next) => {
  const uid = (req as any).session.uid;
  const { content, post, parent, mention } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'User not authenticated!' });
  }

  if (!content || !post) {
    return res
      .status(400)
      .json({ error: 'Required fields missing in your request!' });
  }

  const postReactionService = new ItemsService('comment', {
    schema: (req as any)?.schema,
  });

  try {
    await postReactionService.createOne({
      user: uid,
      mention,
      content,
      parent,
      post,
    });
  } catch (e) {
    return res.status(500).json({ error: 'Server error!' });
  }

  res.status(200).json({ message: 'Comment created!' });
};

export default comment;
