const withCSS = require('@zeit/next-css')
module.exports = withCSS({
  publicRuntimeConfig: {
    // WEBSOCKET_URL: process.env.WEBSOCKET_URL
  }
})
