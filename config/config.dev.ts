import { defineConfig } from 'umi';

export default defineConfig({
  plugins: ['react-dev-inspector/plugins/umi/react-inspector'],
  define: {
    'process.env.HTTP_URL': 'https://p4010174-u848-6abfd459.app.run.fish',
  },
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
});
