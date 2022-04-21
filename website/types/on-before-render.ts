import { PageContextBuiltIn } from 'vite-plugin-ssr';
import { PageContext } from '#types/page-context';

type Context = { pageContext: Partial<Omit<PageContext, 'Page'>> };

export type OnBeforeRender = (
  ctx: PageContextBuiltIn & PageContext,
) => Promise<Context | void> | Context | void;
