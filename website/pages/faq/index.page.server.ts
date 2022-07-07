import { OnBeforeRender } from '#types/on-before-render';
import { ItemsService } from 'directus';
import { loadData } from './load-data';
import url from 'url';

export { onBeforeRender };

const onBeforeRender: OnBeforeRender = async (pageContext) => {
  const queryObj = url.parse(pageContext.url, true);
  const page = Number(queryObj.query?.page);
  const search =
    typeof queryObj.query?.sq === 'object' && Array.isArray(queryObj.query?.sq)
      ? queryObj.query?.sq.toString()
      : queryObj.query?.sq;
  const questionService = new ItemsService('question', {
    schema: pageContext.schema,
  });

  return {
    pageContext: {
      pageProps: {
        ...(await loadData(questionService, page, search)),
        searchText: search,
      },
    },
  };
};
