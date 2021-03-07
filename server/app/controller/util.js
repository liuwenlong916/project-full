// const Controller = require('egg').Controller
const BaseController = require('./base')
const svgCaptcha = require('svg-captcha')
const path = require('path')

const fse = require('fs-extra')

class UtilController extends BaseController {
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
  async sendcode() {
    const { ctx, service } = this
    const email = ctx.query.email
    let code = Math.random().toString().slice(2, 6)
    ctx.session.emailcode = code
    const subject = '开课吧验证码'
    const text = ''
    const html = `<h2>小开社区</h2><a href='https//:kaikeba.com'><span>${code}</span></a>`
    console.log(email, subject, text, html)
    const hasSend = await service.tool.sendMail(email, subject, text, html)
    if (hasSend) {
      this.message('发送成功')
    } else {
      this.error('发送失败')
    }
  }
  async uploadfile() {
    const { ctx } = this
    const file = ctx.request.files[0]
    const { name } = ctx.request.form
    console.log(name, file)
    await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename)
    this.success({
      code: 1,
      url: `/public/${file.filename}`,
    })
  }
}

module.exports = UtilController
