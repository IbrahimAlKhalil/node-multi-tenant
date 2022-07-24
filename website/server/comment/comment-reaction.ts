import { comment } from './../../types/comment-type';
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

  const commentReactionService = new ItemsService('comment_reaction', {
    schema: (req as any)?.schema,
  });

  try {
    /**
     * Find previous reaction
     */
    const prevReaction = await commentReactionService.readByQuery({
      filter: {
        _and: [
          {
            comment: {
              _eq: commentReaction.comment,
            },
          },
          {
            user: {
              _eq: commentReaction.user,
            },
          },
        ],
      },
    });
    if (prevReaction.length) {
      // update reaction
      await commentReactionService.updateOne(
        prevReaction[0].id,
        commentReaction,
      );
    } else {
      // Create new reaction
      await commentReactionService.createOne(commentReaction);
    }
  } catch (e) {
    console.log('Comment Error: ', e);
    return res
      .status(500)
      .json({ error: 'Server error to create comment reaction!' });
  }
  res.status(200).json({ message: 'Comment created!' });
};

export default commentReactionApi;
