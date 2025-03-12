'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const axios = require('axios')
const bodyParser = require('body-parser')

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(app) {
      app.use(bodyParser.urlencoded({ extended: true }))
      const querystring = require('querystring')

      app.get('/api/getDiscList', function(req, res) {
        const url =
          'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios
          .get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          })
          .then(response => {
            res.json(response.data)
          })
          .catch(e => {
            console.log(e)
          })
      })

      app.get('/api/getCdInfo', function(req, res) {
        const url =
          'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios
          .get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          })
          .then(response => {
            let ret = response.data
            if (typeof ret === 'string') {
              const reg = /^\w+\(({.+})\)$/
              const matches = ret.match(reg)
              if (matches) {
                ret = JSON.parse(matches[1])
              }
            }
            res.json(ret)
          })
          .catch(e => {
            console.log(e)
          })
      })

      app.get('/api/lyric', function(req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        axios
          .get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          })
          .then(response => {
            let ret = response.data
            if (typeof ret === 'string') {
              const reg = /^\w+\(({.+})\)$/
              const matches = ret.match(reg)
              if (matches) {
                ret = JSON.parse(matches[1])
              }
            }
            res.json(ret)
          })
          .catch(e => {
            console.log(e)
          })
      })

      app.get('/api/getPurlUrl', function(req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios
          .get(url, {
            params: {
              format: 'json',
              sign: 'zzannc1o6o9b4i971602f3554385022046ab796512b7012',
              data:
                '{"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"filename":["M500002xTzGb2UBQRk002xTzGb2UBQRk.mp3","M500001Z6FlV2jgdwx001Z6FlV2jgdwx.mp3"],"guid":"493384754","songmid":["002xTzGb2UBQRk","001Z6FlV2jgdwx"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"loginUin":"0","comm":{"uin":"0","format":"json","ct":24,"cv":0}}'
            },
            g_tk: 1124214810,
            loginUin: '0',
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 0,
            headers: {
              referer: 'https://y.qq.com/portal/player.html',
              host: 'u.y.qq.com',
              'content-type': 'application/x-www-form-urlencoded',
              cookie: '',
              cookies: ''
            }
          })
          .then(response => {
            res.json(response.data)
          })
          .catch(e => {
            console.log(e)
          })
      })
    },
    historyApiFallback: true,
    hot: true,
    host: process.env.HOST || config.dev.host,
    port: process.env.PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? {
          warnings: false,
          errors: true
        }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${config.dev.host}:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
