import { compileTemplate } from '@vue/compiler-sfc';
import { optimize as optimizeSvg } from 'svgo';
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

      let svg = await fs.readFile(path, 'utf-8');

      if (query === 'raw') {
        return `export default ${JSON.stringify(svg)}`;
      }

      if (query === 'plain') {
        svg = (optimizeSvg(svg) as any).data;
      } else {
        const optimized = optimizeSvg(svg, {
          plugins: [
            {
              name: 'preset-default',
            },
            {
              name: 'addClassesToSVGElement',
              params: {
                classNames: ['fa-icon'],
              },
            } as any,
          ],
        });

        svg = (optimized as any).data;
      }

      const { code } = compileTemplate({
        id: JSON.stringify(id),
        source: svg,
        filename: path,
        transformAssetUrls: false,
      });

      return `${code}\nexport default { render: render }`;
    },
  };
}
