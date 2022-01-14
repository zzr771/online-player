// 引入path模块, 创把@解析为src
const path = require("path")

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/online-player/" : "/",
  lintOnSave: false,
  devServer: {
    open: true,
    proxy: {
      "/netease-api": {
        target: "https://netease-cloud-music-api-ten-gamma.vercel.app",
        pathRewrite: { "^/netease-api": "" },
        changeOrigin: true,
        secure: false,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.join(__dirname, "src"),
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        appendData: `@import '@/style/variables.less';`,
      },
    },
  },
}
