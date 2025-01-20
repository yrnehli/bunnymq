const http = require("http");
const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer({});

http
  .createServer(function (req, res) {
    const url = new URL(`http://localhost/${req.url}`);
    const target = url.searchParams.get("proxy");

    if (target === null) {
      res.end();
      return;
    }

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    proxy.web(req, res, {
      target: target,
      changeOrigin: true,
    });
  })
  .listen(5174);
