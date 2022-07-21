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
  user: number;
  date_created: string;
  content: string;
  parent: number | null;
  mention: number | null;
  institute: {
    code?: number;
    name?: string;
    cluster: {
      host: string;
    };
  };
  reactions?: {
    like: number;
    dislike: number;
    sad: number;
    angry: number;
  };
  replies?: comment[];
};
