type PostCategoryType = {
  name: string;
  slug: string;
};

type PostCategoryArrayOfObject = {
  id: number;
  post_id: {
    slug: string;
  };
  post_category_id: PostCategoryType;
};

type PostType = {
  id: number;
  status: 'published' | 'draft' | 'archived';
  title: string;
  slug: string;
  short_content?: string;
  date_created: string;
  content: any;
  featured_image: string;
  is_featured: boolean;
  user_created: {
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  categories: PostCategoryArrayOfObject[];
  primary_category: PostCategoryType | null;
  tags?: number[];
  comments?: number[];
};

export default PostType;
