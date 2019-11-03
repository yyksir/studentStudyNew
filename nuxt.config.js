module.exports = {
  router:{
    base:"/engStudy" // 此为根目录，如果有具体目录需求按实际情况写
  },
  generate: {
    routes: [
      '/test/courseTest/1',
      '/test/courseTest/2',
      '/test/courseTest/3'
    ]
  },
  //mode:'spa',
  mode: 'universal',
  // Headers of the page
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  // Customize the progress-bar color
  loading: { color: '#dd4b39' },
  // Global CSS
  css: [
    'ant-design-vue/dist/antd.css',
    '@/assets/iconfont/iconfont.css'
  ],
  // Plugins to load before mounting the App
  plugins: [
    '@/plugins/antd-ui',
    '~plugins/api',
    '~plugins/echarts',
    '~plugins/moment.js',
    '~plugins/jsCookie.js',
    { src: '~plugins/lodash.js', ssr: false },
  ],
  // Nuxt.js dev-modules
  buildModules: [],
  // Nuxt.js modules
  modules: [],
  // You can extend webpack config here, Build configuration
  build: {
    extractCSS: true,
    devtools: false,
    // 可能造成某些页面 没有 layout 布局
    /*splitChunks: {
      layouts: false,
      pages: true,
      commons: true
    },*/
    // 打包分析的代码就别 上传了, 自己本地修改
    /*analyze: true,
    analyze: {
      analyzerMode: 'static'
    },*/
    optimization: {
      noEmitOnErrors: true,
      mangleWasmImports: true,
      removeAvailableModules: true,
      removeEmptyChunks: true,
      mergeDuplicateChunks: true,
      flagIncludedChunks: true,
      usedExports: true,
      sideEffects: true,
      // minimize: true,
      // minimizer: [],
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '~',
        name: false,
        minSize: 50000,
        maxSize: 100000, // 2M 100000
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
          'antdui': {
            test: /node_modules[\\/]ant-design-vue/,
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
            filename: 'antdui.[hash].js'
          },
          'echarts': {
            test: /node_modules[\\/]echarts/,
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
            filename: 'echarts.[hash].js'
          },
          'lodash': {
            test: /node_modules[\\/]lodash/,
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
            filename: 'lodash.[hash].js'
          },
          'moment': {
            test: /node_modules[\\/]moment/,
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
            filename: 'moment.[hash].js'
          },
          'jscookie': {
            test: /node_modules[\\/]js-cookie/,
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
            filename: 'jsCookie.[hash].js'
          },
          default: {
            minChunks: 1,
            priority: 10,
            reuseExistingChunk: true, // [true: 如果一个文件已经被打包过了, 又发现有引用的地方, 就忽略这次打包, 直接复用之前的打包]
            filename: 'default.[hash].js'
          }
        },
      },
    },
    // extend (config, ctx) {},
    productionSourceMap:false,
    extend (config, { isClient }) {
      if (isClient) {
        config.devtool = 'cheap-module-eval-source-map'
      }
    }
  },
  vue: {
    config: {
      keyCodes: {
        backSpace: 8,
        space: 32
      }
    }
    //
  }
}
