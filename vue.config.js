
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

module.exports = {

  publicPath: process.env.NODE_ENV === 'production' ?  (process.env.VUE_APP_TITLE==='QY_PROD' ? 'https://c1.51jujibao.com/static/mod/qySaas' : 'https://prev-c1.51jujibao.com/static/mod/qySaas/') : '/',

  outputDir: process.env.VUE_APP_TITLE==='QY_PROD' ? 'dist' : 'dev',

  assetsDir: 'static',

  lintOnSave: process.env.NODE_ENV == 'production',

  productionSourceMap: false,

  devServer: {
    disableHostCheck: true,
    port: 8089, // 端口号
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    proxy: {
      '/api': {
        target: 'https://prev-vip.guijitech.com/',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
            '^/api': ''
        }
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true //隐藏console
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
    } else {
      // 开发环境
    }
  },
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')

    /* 添加分析工具*/
    // config.plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
 
    config.resolve.alias.set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))

    config.module
      .rule('html-loader')
      .test(/\.html$/)
      .use('html-loader')
      .loader('html-loader')
      .end()
  }
}