const BaseController = require('./base')

const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  passwd: { type: 'string' },
  captcha: { type: 'string' },
}
class UserController extends BaseController {
  // constructor() {
  //   this.
  // }
  async login() {}
  async register() {
    console.log('register')
    const { ctx } = this
    try {
      //校验传递参数
      ctx.validate(createRule)
    } catch (e) {
      //bases基类方法。
      return this.error('参数校验失败', -1, e.errors)
    }

    const { email, nickname, passwd, captcha } = ctx.request.body

    if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
      this.success({ name: 'kkb' }) //bases基类方法。
    } else {
      this.error('验证码错误')
    }
  }
  async verify() {
    // 校验用户名是否存在
  }
  async info() {}
}

module.exports = UserController
