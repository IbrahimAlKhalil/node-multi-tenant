export type comment = {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  title: string;
  content: string;
  react: number;
  replies: comment[];
};
