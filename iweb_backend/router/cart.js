// 处理所有以/cart开头的请求
const express=require('express')
const pool=require('../pool.js')
let router=express.Router()
module.exports=router

/* 加入购物车
/cart/add
请求方式GET
请求字符串参数
uid		必需-用户编号
	从session中读取登录的用户编号即可
cid		必需-课程编号 */
router.get('/add',(req,res,next)=>{
	//获取请求数据
	let uid=req.session.userInfo.uid
	let cid=req.query.cid
	if(!cid){
		res.send({code:402,msg:'cid required'})
		return
	}
	let sql='INSERT INTO cart VALUES (null,?,?)'
	pool.query(sql,[uid,cid],(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		if(reslut.affectedRows>=1){
			res.send({code:200,msg:'cart add success'})
		}else{
			res.send({code:400,msg:'cart add err'})
		}
	})
})

/* 删除购物车
/cart/del
请求方式POST
请求字符串参数
uid		必需-用户编号
	从session中读取登录的用户编号即可
ctid	必需-购物车编号 */
router.post('/del',(req,res,next)=>{
	//获取请求数据
	let uid=req.session.userInfo.uid
	let ctid=req.body.ctid
	if(!ctid[0]){
		res.send({code:402,msg:'ctid required'})
		return
	}
	let sql=`DELETE FROM cart WHERE userId=? AND ctid in (${ctid})`
	pool.query(sql,uid,(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		if(reslut.affectedRows>=1){
			res.send({code:200,msg:'cart del success'})
		}else{
			res.send({code:400,msg:'cart del err'})
		}
	})
})


/* 查询是否加入购物车
/cart/sel
请求方式GET
请求字符串参数
uid		必需-用户编号
	从session中读取登录的用户编号即可
cid		必需-课程编号 */
router.get('/sel',(req,res,next)=>{
	//获取请求数据
	let uid=req.session.userInfo.uid
	let cid=req.query.cid
	if(!cid){
		res.send({code:402,msg:'cid required'})
		return
	}
	let sql='SELECT ctid FROM cart WHERE userId=? AND courseId=?'
	pool.query(sql,[uid,cid],(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		res.send(reslut)
	})
})

/* 购物车数量查询
/cart/countSel
请求方式GET
请求字符串参数
uid		必需-用户编号
	从session中读取登录的用户编号即可 */
router.get('/countSel',(req,res,next)=>{
	let uid=req.session.userInfo.uid
	let sql='SELECT COUNT(ctid) as c FROM cart WHERE userId=?'
	pool.query(sql,uid,(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		res.send(reslut)
	})
})
	
/* 购物车列表
/cart/list
请求方式GET
请求字符串参数
uid		必需-用户编号
	从session中读取登录的用户编号即可 */
router.get('/list',(req,res,next)=>{
	let uid=req.session.userInfo.uid
	let sql='SELECT title,pic,price,cid,cLength,tname,ctid FROM course AS c,cart AS ct,teacher AS t WHERE c.cid=ct.courseId AND t.tid=c.teacherId AND userId=? ORDER BY ctid DESC'
	pool.query(sql,uid,(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		res.send(reslut)
	})
})	

