const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://p4010174-u848-6abfd459.api.tiancai.run',
      changeOrigin: true,
      secure: false,
    }),
  );
};
