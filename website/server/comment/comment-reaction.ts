import { ItemsService } from 'directus';
import express from 'express';

const commentReactionApi: express.RequestHandler = async (req, res) => {
  const { uid } = (req as any).session;
  const { instituteId } = req as any;
  const { commentId, reactionId } = req.body;

  if (!uid || !instituteId) {
    return res.status(400).json({ error: 'User not authenticated!' });
  }

  if (!commentId || !reactionId) {
    return res
      .status(400)
      .json({ error: 'Required fields missing in your request!' });
  }

  const commentReaction: any = {};
  commentReaction.institute = instituteId;
  commentReaction.comment = commentId;
  commentReaction.reaction = reactionId;
  commentReaction.user = uid;

  const commentReactionService = new ItemsService('comment-reaction', {
    schema: (req as any)?.schema,
  });

  try {
    await commentReactionService.createOne(commentReaction);
  } catch (e) {
    console.log('Comment Error: ', e);
    return res.status(500).json({ error: 'Server error!' });
  }
  res.status(200).json({ message: 'Comment created!' });
};

export default commentReactionApi;
