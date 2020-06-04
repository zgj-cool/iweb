// 处理所有以/type开头的请求
const express=require('express')
const pool=require('../pool.js')
let router=express.Router()
module.exports=router

/* 获取课程分类
/type
请求方式GET */
router.get('',(req,res,next)=>{
	// 执行数据库操作
	let sql='select tpid,tpname from type'
	pool.query(sql,(err,reslut)=>{
		if(err){
			//将错误转交给中间件链中的下一个错误处理中间件
			next(err)
			return	//退出当前路由，只跳转到错误处理中间件
		}
		res.send(reslut)
	})
})




