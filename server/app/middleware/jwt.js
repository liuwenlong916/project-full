//// 解析token的中间件，也可以用egg-jwt，自己封装更适合了解原理
const { consoleLevel } = require('egg-mock')
const jwt = require('jsonwebtoken')

module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    if (!ctx.request.header.authorization) {
      ctx.body = {
        code: '-666',
        message: '用户没有登录',
      }
      return
    }
    const token = ctx.request.header.authorization.replace('Bearer ', '')
    try {
      const res = jwt.verify(token, app.config.jwt.secret)
      ctx.state.email = res.email
      ctx.state.userid = res._id
      await next()
    } catch (e) {
      console.log(e)
      if (e.name == 'TokenExpiredError') {
        ctx.body = {
          code: -666,
          message: '登录过期了',
        }
      } else {
        ctx.body = {
          code: -1,
          message: '用户信息出错',
        }
      }
    }
  }
}
