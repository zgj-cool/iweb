// 处理所有以/orders开头的请求
const express=require('express')
const pool=require('../pool.js')
let router=express.Router()
module.exports=router

/* 提交订单
/orders/add
请求方式POST
请求主体参数
uid		必需-用户编号
	从session中读取登录的用户编号即可
cid		必需-课程编号 */
router.post('/add',(req,res,next)=>{
	let uid=req.session.userInfo.uid
	let cid=req.body.cid.slice(1,-1).split(',')
	let time=Date.now()
	if(!cid[0]){
		res.send({code:401,msg:'cid required'})
		return
	}
	let sql1='INSERT INTO orders (userId,courseId,time) VALUES '
	for(let key in cid){
		sql1+=`(${uid},${cid[key]},${time}),`
	}
	let sql=sql1.slice(0,-1)
	pool.query(sql,(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		if(reslut.affectedRows>0){
			res.send({code:200,msg:'order add success'})
		}else{
			res.send({code:400,msg:'order add err'})
		}
	})
})

/* 查询订单提交页面信息
/orders/settList
请求方式POST
请求主体参数
uid		必需-用户编号
	从session中读取登录的用户编号即可
cid		必需-课程编号 */
router.post('/settList',(req,res,next)=>{
	let uid=req.session.userInfo.uid
	let cid=req.body.cid
	if(!cid){
		res.send({code:401,msg:'cid required'})
		return
	}
	let sql=`select uname,phone,title,cLength,pic,tname,price from course AS c,teacher AS t,user where c.teacherId=t.tid AND cid in (${cid}) AND uid=?`
	pool.query(sql,uid,(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		res.send(reslut)
	})
})

/* 查询是否已购买
/orders/sel
请求方式GET
请求查询字符串参数
uid		必需-用户编号
	从session中读取登录的用户编号即可
cid		必需-课程编号 */
router.get('/sel',(req,res,next)=>{
	let uid=req.session.userInfo.uid
	let cid=req.query.cid
	if(!cid){
		res.send({code:401,msg:'cid required'})
		return
	}
	let sql='SELECT odid FROM orders WHERE userId=? AND courseId=?'
	pool.query(sql,[uid,cid],(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		res.send(reslut)
	})
})

/* 查询订单列表
/orders/list
请求方式GET
请求查询字符串参数
uid		必需-用户编号
	从session中读取登录的用户编号即可 */
router.get('/list',(req,res,next)=>{
	let uid=req.session.userInfo.uid
	let sql='SELECT title,pic,tname,cLength,time FROM orders o,course c,teacher t WHERE o.courseId=c.cid AND t.tid=c.teacherId AND userId=? order by time desc'
	pool.query(sql,uid,(err,reslut)=>{
		if(err){
			console.log(err)
			next(err)
			return
		}
		res.send(reslut)
	})
})
