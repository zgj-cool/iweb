// 处理所有以/teacher开头的请求
const express = require('express')
const pool = require('../pool.js')
let router = express.Router()
module.exports = router

/* 获取讲师列表
/teacher/list?format=short
请求方式GET
请求查询字符串参数
format	short或full	选填	
	short：默认值，返回简短的讲师列表（不包含经验和风格）
	full：返回完整的讲师列表（包含经验和风格） */
router.get('/list', (req, res, next) => {
	// 获取客户端提交的数据
	let format = req.query.format;
	if (format != 'full') {
		format = 'short'
	}
	let sql=null
	if(format==='short'){
		sql = 'select tid,tname,maincourse,tpic from teacher'
	}else{
		sql = 'select tid,tname,maincourse,tpic,experience,style from teacher'
	}
	pool.query(sql, (err, reslut) => {
		if (err) {
			//将错误转交给中间件链中的下一个错误处理中间件
			next(err)
			return //退出当前路由，只跳转到错误处理中间件
		}
		res.send(reslut)
	})

})
