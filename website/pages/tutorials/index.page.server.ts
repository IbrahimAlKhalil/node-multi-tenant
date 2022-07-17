import { OnBeforeRender } from '#types/on-before-render';
import { loadTutorials } from './load-tutorials';
import { loadTutorial } from './load-tutorial';
import { ItemsService } from 'directus';

export { onBeforeRender };

const onBeforeRender: OnBeforeRender = async (pageContext) => {
  const service = new ItemsService('tutorial', {
    schema: pageContext.schema,
  });

  const dirs = pageContext.urlPathname
    .split('/')
    .map((dir) => dir.trim())
    .filter((dir) => dir !== '');

  if (dirs.length > 2) {
    return {
      pageContext: {},
    };
  }

  return {
    pageContext: {
      pageProps: {
        tutorials: Object.freeze(await loadTutorials(service)),
        tutorial: await loadTutorial(service, dirs[1]),
      },
    },
  };
};
