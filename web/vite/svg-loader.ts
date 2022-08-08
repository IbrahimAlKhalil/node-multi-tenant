import { optimize as optimizeSvg, type OptimizedSvg } from 'svgo';
import { compileTemplate } from '@vue/compiler-sfc';
import fs from 'fs/promises';

export function svgLoader() {
  const svgRegex = /\.svg(\?(raw|plain))?$/;

  return {
    name: 'svg-loader',
    enforce: 'pre',

    resolveid(id: string) {
      if (id.match(svgRegex)) {
        return id;
      }
    },

    async load(id: string) {
      if (!id.match(svgRegex)) {
        return;
      }

      const [path, query] = id.split('?', 2);

      const svg = await fs.readFile(path, 'utf-8');

      if (query === 'raw') {
        return `export default ${JSON.stringify(svg)}`;
      }

      const optimizeResult = optimizeSvg(svg);

      if (optimizeResult.error) {
        throw new Error(optimizeResult.error);
      }

      const { code } = compileTemplate({
        id: JSON.stringify(id),
        source: (optimizeResult as OptimizedSvg).data,
        filename: path,
        transformAssetUrls: false,
      });

      return `${code}\nexport default { render: render }`;
    },
  };
}
