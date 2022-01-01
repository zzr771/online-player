// 引入path模块, 创把@解析为src
const path = require("path")

module.exports = {
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
      // "http://m10.music.126.net/": {
      //   target: "http://m10.music.126.net/",
      //   changeOrigin: true,
      //   secure: false,
      // },
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
