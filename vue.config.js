module.exports = {
  devServer: {
    host: "localhost", // 允许外部ip访问
    port: 8080, // 端口
    https: false, // 启用https
    proxy: {
      "/api": {
        target: "http://106.12.151.73:8080",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
};
