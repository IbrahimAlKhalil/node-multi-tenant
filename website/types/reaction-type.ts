type valueTypes = 'like' | 'wow' | 'sad' | 'angry';

type ReactionType = {
  id: number;
  type: string;
  value: valueTypes;
};

type PostReactionType = {
  id: number;
  date_created: string;
  reaction: {
    value: valueTypes;
  };
  post: {
    id: number;
  };
};

export { ReactionType, PostReactionType };
