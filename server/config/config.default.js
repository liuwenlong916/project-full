/* eslint valid-jsdoc: "off" */

'use strict'

const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1614170409366_1421'

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }
  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public')
  //允许上传文件
  config.multipart = {
    mode: 'file',
    whitelist: () => true,
  }

  return {
    ...config,
    ...userConfig,
    //关闭csrf
    security: {
      csrf: {
        enable: false,
      },
    },
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/kkbhub',
        options: {},
      },
    },
    jwt: {
      secret: '@Kaikeba!123Abc!:',
    },
  }
}
