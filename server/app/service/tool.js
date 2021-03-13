const { Service } = require('egg')
const nodemailer = require('nodemailer')
const path = require('path')
const fse = require('fs-extra')

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
  async mergeFile(filepPath, filehash, size) {
    const chunkdDir = path.resolve(this.config.UPLOAD_DIR, filehash) // 切片的文件夹
    let chunks = await fse.readdir(chunkdDir)
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
    chunks = chunks.map(cp => path.resolve(chunkdDir, cp))
    await this.mergeChunks(chunks, filepPath, size, filehash)
  }
  async mergeChunks(files, dest, size, filehash) {
    const pipStream = (filePath, writeStream) =>
      new Promise(resolve => {
        const readStream = fse.createReadStream(filePath)
        readStream.on('end', () => {
          fse.unlinkSync(filePath)
          resolve()
        })
        readStream.pipe(writeStream)
      })
    //报错？
    // await Promise.all()
    await files.forEach((file, index) => {
      pipStream(
        file,
        fse.createWriteStream(dest, {
          start: index * size,
          end: (index + 1) * size,
        }),
      )
    })
    // fse.unlinkSync(filehash)
  }
}

module.exports = ToolService
