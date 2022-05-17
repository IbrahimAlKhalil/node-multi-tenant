type author = {
  name: string;
  email?: string;
  url?: string;
  avatar: string;
};

export type comment = {
  postId: number;
  id: string;
  author: author;
  createdAt: string;
  content: string;
  liked: number;
  disliked: number;
  replies: comment[];
};