//定义基类，定制规范
const { Controller } = require('egg')

class BaseController extends Controller {
  //返回数据
  success(data) {
    this.ctx.body = {
      code: 0,
      data,
    }
  }
  //返回信息（更新操作时）
  message(message) {
    this.ctx.body = {
      code: 0,
      message,
    }
  }
  error(message, code = -1, errors = {}) {
    this.ctx.body = {
      code,
      message,
      errors,
    }
  }
}
module.exports = BaseController
