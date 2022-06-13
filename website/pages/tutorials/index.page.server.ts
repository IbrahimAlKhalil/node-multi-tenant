import { OnBeforeRender } from '#types/on-before-render';
import { ItemsService } from 'directus';

export { onBeforeRender };

const onBeforeRender: OnBeforeRender = async (pageContext) => {
  const tutorialCategoriesService = new ItemsService('tutorial_category', {
    schema: (pageContext as any)?.schema,
  });
  //   tutorialsService
  const tutorialsService = new ItemsService('tutorial', {
    schema: (pageContext as any)?.schema,
  });

  const tutorialCategories = await tutorialCategoriesService.readByQuery({
    filter: {
      parent: {
        _null: true,
      },
    },
    fields: [
      'id',
      'name',
      'slug',
      'parent',
      'children.name',
      'children.slug',
      'children.children.name',
      'children.children.slug',
      'children.children.children.name',
      'children.children.children.slug',
    ],
  });

  const tutorials = await tutorialsService.readByQuery({
    fields: ['id', 'status', 'title', 'slug', 'content', 'categories'],
  });

  return {
    pageContext: {
      pageProps: {
        tutorialCategories,
        tutorials,
      },
    },
  };
};
