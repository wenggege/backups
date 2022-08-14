const defaultSettings = require('./src/settings')
// gzip压缩插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 可视化打包插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// 打包压缩zip插件
//const FileManagerPlugin = require('filemanager-webpack-plugin')

const path = require('path')
const { name } = require('./package')

function resolve (direct) {
  return path.resolve(direct)
}

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

// 外部资源引用
const cdn = {
  // 忽略打包的第三方库
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT'
  },
  // 通过cdn方式使用
  js: [
    isProd ? 'js/vue.min.js' : 'js/vue.js',
    'js/vue-router.min.js',
    'js/element-ui.js',
    'js/moment.min.js'
  ],
  css: [
    'css/normalize.css',
    'css/element-ui.css'
  ]
}

module.exports = {
  publicPath: './',
  outputDir: './dist',
  lintOnSave: isDev,
  productionSourceMap: false,
  configureWebpack: config => {
    config.resolve.alias = {
      '@': resolve('src'),
      '@assets': resolve('src/assets/'),
      '@styles': resolve('src/assets/styles'),
      '@imgs': resolve('src/assets/imgs'),
      '@components': resolve('src/components'),
      '@views': resolve('src/views')
    }

    config.externals = cdn.externals

    if (isProd) {
      // 为生产环境修改配置...
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
        // 开启gzip压缩
        new CompressionWebpackPlugin(
          {
            filename: info => {
              return `${info.path}.gz${info.query}`
            },
            algorithm: 'gzip',
            threshold: 10240, // 只有大小大于该值的资源会被处理 10240
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
            deleteOriginalAssets: false // 删除原文件
          }
        )
      )
      // config.plugins.push(
      //   new FileManagerPlugin({ // 初始化 filemanager-webpack-plugin 插件实例
      //     events: {
      //       onEnd: {
      //         delete: [ // 首先需要删除项目根目录下的dist.zip
      //           `./${name}.zip`
      //         ],
      //         archive: [ // 然后我们选择dist文件夹将之打包成dist.zip并放在根目录
      //           {
      //             source: './dist',
      //             destination: `./${name}.zip`
      //           }
      //         ]
      //       }
      //     }
      //   })
      // )
    } else {
      config.devtool = 'eval-source-map'
      // 为开发环境修改配置...
    }
  },
  chainWebpack (config) {
    // 移除 prefetch 插件
    // config.plugins.delete('prefetch')

    // 移除 preload 插件，避免加载多余的资源
    // config.plugins.delete('preload')

    // 修复HMR
    config.resolve.symlinks(true)

    // 配置cdn引入
    config.plugin('html').tap((args) => {
      args[0].cdn = cdn
      args[0].title = defaultSettings.title
      return args
    })

    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/menu-icons'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/menu-icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('source-map')
      )

    if (isProd) {
      // 清除SVG已有的所有 loader。
      // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后
      // const svgRule = config.module.rule('svg')
      // svgRule.uses.clear()

      // 将小于10KB的资源内联
      config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif)(\?.*)?$/)
        .use('url-loader')
        .loader('url-loader')
        .tap(options => Object.assign(options, { limit: 10240 }))

      // JS文件最小化处理
      config.optimization.minimize(true)

      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            name: 'main',
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      })

      // 打包资源分析
      config
        .plugin('webpack-bundle-analyzer')
        .use(BundleAnalyzerPlugin)
        .init(Plugin => new Plugin())
    }
  },
  devServer: {
    port: 8097,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        //target: 'https://pjm-logistics-api-test.porton.cn',
        target: 'https://pjm-finance-api-test.porton.cn', 
        changeOrigin: true
      },
      '/restcloud': {
        target: 'https://esb-pre.porton.cn',
        changeOrigin: true
      },
      '/publicUploadFtp': {
        target: 'https://pjm-newtect-test.porton.cn/',
        changeOrigin: true
      },
      '/account': {
        target: 'https://system-basis-sso.porton.cn/',
        changeOrigin: true
      },
      '/Authentication': {
        target: 'https://pjm-base-api-test.porton.cn/',
        changeOrigin: true
      }
    }
  }
}
