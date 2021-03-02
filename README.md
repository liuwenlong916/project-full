# 前端配置代理

nuxt.config.js

```javascript
 modules: [
    "@nuxtjs/proxy"
  ],
  proxy: {
    "/api/": {
      target: "http://localhost:7001",
      secure: false,
      pathRewrite: {
        "^/api": ""
      }
    }
  }
```
