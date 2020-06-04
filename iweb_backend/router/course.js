// 处理所有以/coures开头的请求
const express=require('express')
const pool=require('../pool.js')
let router=express.Router()
module.exports=router

/* 获取课程列表
/course/list?pageNum=1&typeId=3
请求方式GET
请求查询字符串参数
pageNum		选填	-当前页码，默认为1
typeId 		选填	-课程编号 */
router.get('/list',(req,res,next)=>{
	// 获取客户端提交的数
	let pageNum=parseInt(req.query.pageNum);
	let typeId=req.query.typeId;
	if(!pageNum){//未提交，默认为1
		pageNum=1
	}
	let where=''	//SQL中的where查询条件
	let placeholders=[]	//？占位符对应的参数值
	if(typeId){
		where+=' AND typeId=? '
		placeholders.push(typeId)
	}
	let output={
		pageNum:pageNum,		//要显示的页号
		pageSize:10,					//页面大小
		pageCount:0,				//总页数
		totalCount:0,				//满足条件的总记录数
		list:[]							//满足条件的页号上的记录
	}
	// 执行数据库操作
	let sql1='select COUNT(cid) AS c from course where 1 '+where;
	pool.query(sql1,placeholders,(err,reslut)=>{
		if(err){
			//将错误转交给中间件链中的下一个错误处理中间件
			next(err)
			return	//退出当前路由，只跳转到错误处理中间件
		}
		output.totalCount=reslut[0].c
		output.pageCount=Math.ceil(output.totalCount/output.pageSize)
		let sql2='SELECT cid,typeId,title,teacherId,cLength,startTime,address,pic,price,tpid,tpname,tid,tname,maincourse,tpic FROM type,course,teacher WHERE course.typeId=type.tpid AND course.teacherId=teacher.tid '+where+' ORDER BY cid LIMIT ?,?'
		//LIMIT后的第一个？的值  从第几条开始查找
		placeholders.push((output.pageNum-1)*output.pageSize)
		//LIMIT后的第二个？的值  查找的数量
		placeholders.push(output.pageSize)
		pool.query(sql2,placeholders,(err,reslut)=>{
			if(err){
				next(err)
				return
			}
			output.list=reslut;
			res.send(output)
		})
	})
})

/* 获取课程详情
/course/detail?cid=1
请求方式GET
请求查询字符串参数
cid		必填	-课程id */
router.get('/detail',(req,res,next)=>{
	// 获取客户端发送的数据
	let cid=req.query.cid;
	if(!cid){
		res.send({code:401,msg:"cid required"})
	}
	// 执行数据库操作
	let sql='select cid,typeId,tname,title,cLength,startTime,address,pic,price,details,buyCount from course AS c,teacher AS t where c.teacherId=t.tid AND cid=?';
	pool.query(sql,[cid],(err,reslut)=>{
		if(err){
			//将错误转交给中间件链中的下一个错误处理中间件
			next(err)
			return	//退出当前路由，只跳转到错误处理中间件
		}
		res.send(reslut)
	})
})

/* 获取最新课程
/course/newest?count=4
请求方式GET
请求查询字符串参数
count		选填	-返回结果数量，默认为4 */
router.get('/newest',(req,res,next)=>{
	//获取客户端提交的数据
	let count=parseInt(req.query.count);
	if(!count){
		count=4
	}
	// 执行数据库操作
	let sql='select cid,title,pic,price,tname,buyCount from course AS c,teacher AS t WHERE c.teacherId=t.tid order by cid DESC limit ?';
	pool.query(sql,[count],(err,reslut)=>{
		if(err){
			//将错误转交给中间件链中的下一个错误处理中间件
			next(err)
			return	//退出当前路由，只跳转到错误处理中间件
		}
		res.send(reslut)
	})
})

/* 获取热门课程
/course/hottest?count=4
请求方式GET
请求查询字符串参数
count		选填	-返回结果数量，默认为4 */
router.get('/hottest',(req,res,next)=>{
	//获取客户端提交的数据
	let count=parseInt(req.query.count);
	if(!count){
		count=4
	}
	// 执行数据库操作
	let sql='select cid,title,pic,price,tname,buyCount from course AS c,teacher AS t WHERE c.teacherId=t.tid order by buyCount DESC limit ?';
	pool.query(sql,[count],(err,reslut)=>{
		if(err){
			//将错误转交给中间件链中的下一个错误处理中间件
			next(err)
			return	//退出当前路由，只跳转到错误处理中间件
		}
		res.send(reslut)
	})
})
