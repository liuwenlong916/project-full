const Controller = require('egg').Controller
const svgCaptcha = require('svg-captcha')
class UtilController extends Controller {
  async index() {
    const { ctx } = this
    ctx.body = 'hi, egg'
  }
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3,
    })
    // console.log(captcha)
    // this.ctx.body = 'captcha'
    this.ctx.session.captcha = captcha.text
    this.ctx.response.type = 'image/svg+xml'
    this.ctx.body = captcha.data
  }
}

module.exports = UtilController
