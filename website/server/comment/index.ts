import { ItemsService } from 'directus';
import express from 'express';

const comment: express.RequestHandler = async (req, res) => {
  const { uid } = (req as any).session;
  const { instituteId } = req as any;
  const { content, post, parent, mention } = req.body;

  if (!uid || !instituteId) {
    return res.status(400).json({ error: 'User not authenticated!' });
  }

  if (!content || !post) {
    return res
      .status(400)
      .json({ error: 'Required fields missing in your request!' });
  }

  const commentData: any = {};
  commentData.institute = instituteId;
  commentData.content = content;
  commentData.post = post;
  commentData.user = uid;
  if (parent) {
    commentData.parent = parent;
  }
  if (mention) {
    commentData.mention = mention;
  }

  const commentService = new ItemsService('comment', {
    schema: (req as any)?.schema,
  });

  try {
    await commentService.createOne(commentData);
  } catch (e) {
    return res.status(500).json({ error: 'Server error!' });
  }
  res.status(200).json({ message: 'Comment created!' });
};

export default comment;
