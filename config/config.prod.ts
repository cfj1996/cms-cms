// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.HTTP_URL': 'https://platypus-adminapi.platypus.art',
  },
});
