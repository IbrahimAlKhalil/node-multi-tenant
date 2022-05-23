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
  reactions: {
    like: number;
    dislike: number;
    sad: number;
    angry: number;
  };
  replies: comment[];
};
