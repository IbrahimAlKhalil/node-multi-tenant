type author = {
  name: string;
  email?: string;
  url?: string;
  avatar: string;
};

export type comment = {
  post: number;
  status: 'published' | 'hold' | 'review' | 'trashed';
  id: number;
  author: author;
  date_created: string;
  content: string;
  reactions: {
    like: number;
    dislike: number;
    sad: number;
    angry: number;
  };
  replies: comment[];
};
