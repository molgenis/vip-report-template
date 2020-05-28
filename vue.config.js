// vue.config.js
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    configureWebpack: {
        plugins: [
            new HtmlWebpackInlineSourcePlugin()
        ]
    },

    chainWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.plugin('html')
                .tap(args => {
                    args[0].filename = './vip-report-template.html';
                    args[0].inlineSource = '.(js|css)$' // embed all javascript and css inline
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
