const { Service } = require('egg')
const nodemailer = require('nodemailer')

const userEmail = 'shengxinjing@126.com'
const transporter = nodemailer.createTransport({
  service: '126',
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: 'a316783812',
  },
})

class ToolService extends Service {
  async sendMail(email, subject, text, html) {
    const mailOptions = {
      from: userEmail,
      to: email,
      cc: userEmail,
      subject,
      text,
      html,
    }
    try {
      await transporter.sendMail(mailOptions)
      return true
    } catch (e) {
      console.log('send email error', e)
      return false
    }
  }
}

module.exports = ToolService
