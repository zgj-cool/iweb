// 处理所有以/favorite开头的请求
const express=require('express')
const pool=require('../pool.js')
let router=express.Router()
module.exports=router

/* 添加收藏
/favorite/add
请求方式POST
请求 Content-Type
application/json
请求Body参数
uid		必填	-用户id 
    从服务器端session中读取登录的用户编号
cid		必填	-课程id */
router.post('/add',(req,res,next)=>{
    // 获取请求数据
    // 从session会话中获得登录后的用户id
    let uid=req.session.userInfo.uid
    // 从请求主体中获取课程id
    let cid=req.body.cid
    if(!cid){
        res.send({code:403,msg:"cid required"})
        return
    }
    // 执行数据库操作
    // TODO: sql1:查询当前用户id是否收藏过当前课程
    // TODO: sql2:如果未添加该收藏，执行INSERT
    // 如果已收藏则返回已收藏响应
    let sql='INSERT INTO favorite VALUES(null,?,?)'
    pool.query(sql,[uid,cid],(err,reslut)=>{
        if(err){
            next(err)
            return
        }
        // 发送响应消息
		if(reslut.affectedRows>=1){
			res.send({code:200,msg:"favorite added success"})
		}else{
			res.send({code:400,msg:"favorite added err"})
		}
    })
})

/* 取消收藏
/favorite/del
请求方式POST
请求Body参数
uid		必填	-用户id 
    从服务器端session中读取登录的用户编号
cid		必填	-课程id */
router.post('/del',(req,res,next)=>{
    // 获取请求数据
    // 从session会话中获得登录后的用户id
    let uid=req.session.userInfo.uid
    // 从请求主体中获取课程id
    let cid=req.body.cid
    if(!cid){
        res.send({code:403,msg:"cid required"})
        return
    }
    // 执行数据库操作
    let sql='DELETE FROM favorite WHERE userId=? AND courseId=?'
    pool.query(sql,[uid,cid],(err,reslut)=>{
        if(err){
            next(err)
            return
        }
        // 发送响应消息
		if(reslut.affectedRows>=1){
			res.send({code:200,msg:"favorite delete success"})
		}else{
			res.send({code:400,msg:"favorite delete err"})
		}
    })
})
/* 多项删除收藏
/favorite/del/list
请求方式POST
请求字符串参数
uid		必需-用户编号
	从session中读取登录的用户编号即可
fid		必需-收藏夹编号 */
router.post('/del/list',(req,res,next)=>{
	//获取请求数据
	let uid=req.session.userInfo.uid
	let fid=req.body.fid
	if(!fid){
		res.send({code:402,msg:'fid required'})
		return
	}
	let sql='DELETE FROM favorite WHERE userId=? AND fid in (?)'
	pool.query(sql,[uid,fid],(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		if(reslut.affectedRows>=1){
			res.send({code:200,msg:'favorite del success'})
		}else{
			res.send({code:400,msg:'favorite del err'})
		}
	})
})

/* 收藏列表
/favorite/list
请求方式GET
请求查询字符串参数
uid		必需	-用户id
    从session中读取登录的用户编号即可 */
router.get('/list',(req,res,next)=>{
    // 获取请求数据
    let uid=req.session.userInfo.uid
    // 执行数据库操作
	let sql='SELECT title,pic,price,cid,fid,cLength,tname FROM course AS c,favorite AS f,teacher AS t WHERE c.cid=f.courseId AND t.tid=c.teacherId AND userId=? ORDER BY fid DESC'
    pool.query(sql,uid,(err,reslut)=>{
        if(err){
            next(err)
            return
        }
        // 发送响应消息
        res.send(reslut)
    })
})

/* 收藏查询
/favorite/sel
请求方式GET
请求查询字符串参数
uid		必需	-用户id
    从session中读取登录的用户编号即可
cid  	必需	-课程编号 */
router.get('/sel',(req,res,next)=>{
    // 获取请求数据
    let uid=req.session.userInfo.uid
	let cid=req.query.cid
    // 执行数据库操作
	let sql='SELECT fid FROM favorite WHERE userId=? AND courseId=?'
    pool.query(sql,[uid,cid],(err,reslut)=>{
        if(err){
            next(err)
            return
        }
        // 发送响应消息
        res.send(reslut)
    })
})
