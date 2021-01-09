import type { Plugin } from 'rollup';
import {} from '@rollup/pluginutils';
import path from 'path';

const renderHtml = (opts: { content: string; css: string }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <title>So</title>
    <style>${opts.css}</style>
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="stylesheet" href="./bundle.css" />
  </head>

  <body>
    <div id="app">${opts.content}</div>

    <script defer async src="https://daief.tech/js/daief/ga.js"></script>
    <script defer src="./bundle.js"></script>
  </body>
</html>`;

const ssrpath = path.resolve(process.cwd(), 'public/ssr.js');

export const staticRenderPlugin = (): Plugin => {
  return {
    name: 'staticRenderPlugin',
    async generateBundle(opts, bundle) {
      delete require.cache[ssrpath];
      const ssrJs = require(ssrpath);
      const result = ssrJs.app.render();

      const { html, css, head } = result;

      this.emitFile({
        type: 'asset',
        source: renderHtml({ content: html, css: '' }),
        name: 'Rollup HTML Asset',
        fileName: 'index.html',
      });
    },
  };
};
