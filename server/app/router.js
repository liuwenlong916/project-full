'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  const jwt = app.middleware.jwt({ app }) //返回一个路由中间件

  router.get('/', controller.home.index)
  //验证码
  router.get('/captcha', controller.util.captcha)
  //发送邮箱验证码
  router.get('/sendcode', controller.util.sendcode)
  //上传文件
  router.post('/uploadfile', jwt, controller.util.uploadfile)
  router.post('/mergefile', jwt, controller.util.mergefile)
  router.post('/checkfile', jwt, controller.util.checkfile)

  //user/register
  // /user/login
  // /user/follow
  // router.post('/user/register', controller.user.register)
  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, register, login, verify } = controller.user
    router.post('/register', register)
    router.post('/login', login)
    router.get('/info', jwt, info)
    router.get('/verify', verify)
  })
}
