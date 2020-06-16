// vue.config.js
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,

    configureWebpack: {
        plugins: [
            new HtmlWebpackInlineSourcePlugin()
        ]
    },

    chainWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.plugins.delete('preload')
            config.plugins.delete('prefetch')

            config.plugin('html')
                .tap(args => {
                    args[0].filename = './vip-report-template.html';
                    args[0].inlineSource = '.(js|css)$'
                    return args
                })
        }
    },

    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: false
      }
    }
}
