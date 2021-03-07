const md5 = require('md5')
const jwt = require('jsonwebtoken')
const BaseController = require('./base')

const HashSalt = ':kaikeba'
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
  async login() {
    const { ctx, app } = this
    const { email, passwd, captcha } = ctx.request.body
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      this.error('验证码错误')
    }
    const user = await ctx.model.User.findOne({
      email,
      passwd: md5(passwd + HashSalt),
    })
    if (!user) {
      return this.error('用户密码错误!')
    }
    //用户信息加密token
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      app.config.jwt.secret, //加密字符串.
      {
        expiresIn: '1h', //过期时间
      },
    )

    this.success({ token, email, nickname: user.nickname })
  }
  async register() {
    const { ctx } = this
    try {
      //校验传递参数
      ctx.validate(createRule)
    } catch (e) {
      //bases基类方法。
      return this.error('参数校验失败', -1, e.errors)
    }

    const { email, nickname, passwd, captcha } = ctx.request.body

    console.log(email, nickname, passwd, captcha)
    if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
      if (await this.checkEmail(email)) {
        this.error('邮箱重复了')
      } else {
        const ret = await this.ctx.model.User.create({
          email,
          nickname,
          passwd: md5(passwd + HashSalt),
        })
        if (ret._id) {
          this.message('插入成功')
        }
      }
    } else {
      this.error('验证码错误')
    }
  }
  async checkEmail(email) {
    const user = this.ctx.model.User.findOne({ email })
    return user
  }
  async verify() {
    // 校验用户名是否存在
  }
  async info() {
    const { ctx } = this
    const { email } = ctx.state
    const user = await this.checkEmail(email)
    console.log(user)
    this.success(user)
  }
}

module.exports = UserController
