/* 登录检查中间件 */
module.exports = (req, res, next) => {
  // 验证是否登录
  if (!req.session.userInfo) {
    res.send({
      code: 409,
      msg: "login required"
    })
    return
  }
  next()  // 放行，继续执行后续的路由/中间件
}
