module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  //定义mongoose字段类型
  const UserSchema = new Schema(
    {
      __v: { type: Number, select: false },
      email: { type: String, required: true },
      passwd: { type: String, required: true, select: false },
      nickname: { type: String, required: true },
      avatar: { type: String, required: false, default: '/user.png' },
      // following: {
      //   type: [{ type: Schema.Types.ObjectIfd, ref: 'User' }],
      //   default: [],
      // },
      // likeArticle: {
      //   type: [{ type: Schema.Types.ObjectIfd, ref: 'Article' }],
      //   default: [],
      // },
      // disLikeArticle: {
      //   type: [{ type: Schema.Types.ObjectIfd, ref: 'Article' }],
      //   default: [],
      // },
    },
    { timestamps: true }, //自动新增字段createtime，updatetime
  )
  return mongoose.model('User', UserSchema)
}
