// 引入path模块, 创建resolve函数, 然后把@解析为src
const path = require("path")
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  devServer: {
    open: true,
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
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
