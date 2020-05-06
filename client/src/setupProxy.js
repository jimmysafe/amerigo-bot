const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware("/files", { target: "http://localhost:9000" }));
    app.use(createProxyMiddleware("/api", { target: "http://localhost:9000" }));
};