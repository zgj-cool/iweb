// 处理所有以/user开头的请求
const express=require('express')
const pool=require('../pool.js')
const multer=require('multer')
const fs=require('fs')
let router=express.Router()
module.exports=router


/* 用户注册
/user/register
请求方式POST
Content-Type:application/json
请求Body参数
uname		必填	-用户名
upwd		必填	-密码
phone		必填	-手机号
captcha	必填	-验证码 */
router.post('/register',(req,res,next)=>{
	//接收客户端提交的数据
	let obj=req.body;
	if(!obj.uname){
		res.send({code:401,msg:'uname required'})
		return
	}
	if(!obj.upwd){
		res.send({code:402,msg:'upwd required'})
		return
	}
	if(!obj.phone){
		res.send({code:403,msg:'phone required'})
		return
	}
	if(!obj.captcha){
		res.send({code:404,msg:'captcha required'})
		return
	}
	if(obj.captcha.toLowerCase()!=req.session.captcha.register){
		res.send({code:405,msg:'captcha err'})
		return
	}
	// TODO:插入数据前应该想检查uname和phone是否被占用
	// let sql='SELECT uid FROM user WHERE uname=? OR phone=?'
	//操作数据库
	let sql='INSERT INTO user(uname, upwd, phone) VALUES(?,?,?)';
	pool.query(sql,[obj.uname,obj.upwd,obj.phone],(err,reslut)=>{
		if(err){
			//将错误转交给中间件链中的下一个错误处理中间件
			next(err)
			return	//退出当前路由，只跳转到错误处理中间件
		}
		//向客户端发送响应消息
		if(reslut.affectedRows>0){
			res.send({code:200,msg:"register",
			uid:reslut.insertId})
		}else{
			res.send({code:400,msg:'register err'})
		}
	})
})

/* 用户登录
/user/login
请求方式POST
Content-Type:application/json 
请求Body参数
uname		必填	-用户名
upwd		必填	-密码 */
router.post('/login',(req,res,next)=>{
	// 获取客户端提交的数据
	let obj=req.body;
	if(!obj.uname){
		res.send({code:401,msg:"uname required"})
		return
	}
	if(!obj.upwd){
		res.send({code:402,msg:"upwd required"})
		return
	}
	// 执行数据库操作
	let sql='select uid from user where uname=? and upwd=?';
	pool.query(sql,[obj.uname,obj.upwd],(err,reslut)=>{
		if(err){
			//将错误转交给中间件链中的下一个错误处理中间件
			next(err)
			return	//退出当前路由，只跳转到错误处理中间件
		}
		// 向客户端发送响应消息
		if(reslut.length==0){
			res.send({code:400,msg:"uname or upwd err"})
		}else{
			//HTTP是无状态的协议，此处使用session技术存储客户端访问数据
			//每个客户端在服务器存储的数据都要根据客户端请求出示的id来查找
			req.session.userInfo=reslut[0]
			res.send({code:200,msg:"login success",
				userInfo:reslut[0]})
		}
	})
})
/* 退出登录
/user/logout
 请求方式GET */
 router.get('/logout',(req,res,next)=>{
	 req.session.destroy((err)=>{
	 })
	 res.send({code:200,msg:'logout success'})
 })


/* 检测用户名是否存在
/user/check_uname
请求方式GET 
请求查询字符串参数
uname		必填	-用户名 */
router.get('/check_uname',(req,res,next)=>{
	// 接收客户端提交数据
	let uname=req.query.uname;
	if(!uname){
		let output={
			code:400,
			msg:'uname required'
		}
		res.send(output)
		return
	}
	// 执行数据库操作
	let sql='SELECT uid FROM user WHERE uname=?'
	pool.query(sql,uname,(err,result)=>{
		if(err){
			//将错误转交给中间件链中的下一个错误处理中间件
			next(err)
			return	//退出当前路由，只跳转到错误处理中间件
		}
		// 向客户端输出响应消息
		if(result.length==0){//失败响应，根据指定的uname。没有查询到数据
			res.send({
				code:401,
				msg:'non-exists'
			})
		}else{				//成功响应，根据指定的uname，查询到数据
			res.send({
				code:200,
				msg:'exists'
			})
		}
	})
})

/* 检测手机号是否存在
/user/check_phone
请求方式GET
请求查询字符串参数
phone		必填	-手机号 */
router.get('/check_phone',(req,res,next)=>{
	//接收客户端提交数据
	let phone=req.query.phone;
	if(!phone){
		res.send({
			code:400,
			msg:'phone required'
		})
		return
	}
	//执行数据库操作
	let sql='SELECT uid FROM user WHERE phone=?';
	pool.query(sql,phone,(err,reslut)=>{
		if(err){
			//将错误转交给中间件链中的下一个错误处理中间件
			next(err)
			return	//退出当前路由，只跳转到错误处理中间件
		}
		//向客户端发送响应消息
		if(reslut.length==0){
			res.send({
				"code": 402,
				"msg": "non-exists"
			})
		}else{
			res.send({
				"code": 200,
				"msg": "exists"
			})
		}
	})
	
})

/* 获取用户信息
/user/userInfo
请求方式GET 
请求查询字符串参数
uid		必填	-用户编号 */
router.get('/userInfo',(req,res,next)=>{
	//获取请求数据
	let uid=req.query.uid
	if(!uid){
		res.send({code:401,msg:'uid required'})
		return
	}
	let sql='SELECT uid,uname,phone,nickname,sex,age,edu,job,avatar FROM user WHERE uid=?'
	pool.query(sql,uid,(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		res.send(reslut)
	})
})
/* 检查后台session用户登录状态
/user/loginCheck
请求方式GET 
请求查询字符串参数
uid		必填	-用户编号
	从session中读取登录的用户编号即可 */
router.get('/loginCheck',(req,res,next)=>{
	if (!req.session.userInfo) {
	  res.send({
	    code: 409,
	    msg: "login required"
	  })
	  return
	}
	res.send({
		code:201,
		msg:'success',
		userInfo:req.session.userInfo
	})
})


/* 注册用验证码
/user/register/captcha
请求方式GET */
router.get('/register/captcha',(req,res,next)=>{
	const svgCaptcha=require('svg-captcha')
	let captcha=svgCaptcha.create({	//创建验证码
		size:5,							//验证码长度
		ignoreChars:'o01l',	//验证码字符中排除0o1l
		noise:3,						//验证码干扰线
		color:true,					//字体是否有颜色
		background:'#c1eebd',//背景颜色
		width:120,					//宽度
		height:30,					//高度
		fontSize:40					//字体大小
	})
	
	// captcha.text 此次随机生成的验证码文字，保存在服务器等待后续验证
	req.session.captcha={
		register:captcha.text.toLowerCase()
	}
	// captcha.data 此次生成的svg图片
	res.type('svg').send(captcha.data)
})

/* 上传用户头像
/user/upload/avatar
请求方式POST
Content-Type:multipart/form-data
请求主体数据
avatar		必填	-二进制图片文件数据 */

// 使用multer中间件接收客户端上传的一张头像图片
let upload=multer({
	dest:'temp/',			//客户端上传的图片在服务器上的临时存储路径
})
router.post('/upload/avatar',upload.single('avatar'),(req,res,next)=>{
	// 把客户端上传的图片文件从临时目录，保存到静态资源托管目录
	let newFileName=generateFileName(req.file.originalname)
	fs.rename(req.file.path,'public/'+newFileName,(err)=>{
		if(err){
			next(err)
			return
		}
		// 发送响应消息
		res.send({
			code:200,
			msg:'avatar upload success',
			fileName:newFileName
		})
	})
})
/* 修改用户头像路径
/user/update/avatar
请求方式GET
请求查询字符串参数
uid				必填	-用户编号
fileName		必填	-新头像图片路径
oldFileName		必填	-旧头像图片路径*/
router.get('/update/avatar',(req,res,next)=>{
	let uid=req.query.uid
	let fileName=req.query.fileName
	let oldFileName=req.query.oldFileName
	if(!uid){
		res.send({code:401,msg:'uid required'})
		return
	}
	if(!fileName){
		res.send({code:402,msg:'fileName required'})
		return
	}
	if(oldFileName!='images/avatar/default_avatar.png'){
		if (fs.existsSync('public/'+oldFileName)) {
		  fs.unlink('public/'+oldFileName, (err) => {
		    if (err){
		  	  next(err)
		  	  return
		    }
		  });
		}
	}
	let sql='UPDATE user SET avatar=? WHERE uid=?'
	pool.query(sql,[fileName,uid],(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		if(reslut.affectedRows>=1){
			res.send({code:200,msg:'update avatar success',avatar:fileName})
		}else{
			res.send({code:400,msg:"update avatar err"})
		}
	})
})

/* 修改用户信息
/user/update/userInfo
请求方式POST
请求主体数据
uid				必填	-用户编号
updateItem		必填	-修改项
updateVal		必填	-修改内容 */
router.post('/update/userInfo',(req,res,next)=>{
	let uid=req.body.uid
	let updateItem=req.body.updateItem
	let updateVal=req.body.updateVal
	if(!updateItem){
		res.send({code:401,msg:'updateItem required'})
		return
	}
	if(!updateVal){
		res.send({code:402,msg:'updateVal required'})
		return
	}
	if(!uid){
		res.send({code:403,msg:'uid required'})
		return
	}
	let sql='UPDATE user SET '
	if(updateItem=='nickname'){
		sql+='nickname=? WHERE uid=?'
	}
	if(updateItem=='uname'){
		sql+='uname=? WHERE uid=?'
	}
	if(updateItem=='phone'){
		sql+='phone=? WHERE uid=?'
	}
	if(updateItem=='sex'){
		sql+='sex=? WHERE uid=?'
	}
	if(updateItem=='age'){
		sql+='age=? WHERE uid=?'
	}
	if(updateItem=='edu'){
		sql+='edu=? WHERE uid=?'
	}
	if(updateItem=='job'){
		sql='UPDATE user SET job=? WHERE uid=?'
	}
	pool.query(sql,[updateVal,uid],(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		if(reslut.affectedRows>=1){
			res.send({code:200,msg:'update userInfo success'})
		}else{
			res.send({code:400,msg:'update userInfo err'})
		}
	})
})

/* 修改用户密码
/user/update/upwd
请求方式POST
Content-Type:application/json 
请求主体数据
uid				必填	-用户编号
upwd			必填	-旧密码
newUpwd			必填	-新密码 */
router.post('/update/upwd',(req,res,next)=>{
	let uid=req.body.uid
	let upwd=req.body.upwd
	let newUpwd=req.body.newUpwd
	if(!upwd){
		res.send({code:401,msg:"upwd required"})
		return
	}
	if(!newUpwd){
		res.send({code:402,msg:"newUpwd required"})
		return
	}
	if(!uid){
		res.send({code:403,msg:"uid required"})
		return
	}
	let sql1='SELECT upwd FROM user WHERE uid=?'
	pool.query(sql1,uid,(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		if(reslut[0].upwd!=upwd){
			res.send({code:400,msg:"upwd err"})
			return
		}
		let sql2='UPDATE user SET upwd=? where uid=?'
		pool.query(sql2,[newUpwd,uid],(err,reslut)=>{
			if(err){
				next(err)
				return
			}
			if(reslut.affectedRows>=1){
				res.send({code:200,msg:"update upwd success"})
			}else{
				res.send({code:405,msg:"update upwd err"})
			}
		})
		
	})
})

function generateFileName(originalName){
	// 生成新的随机文件名：image/avatar+时间戳+五位随机数+原始后缀名
	let file='images/avatar/'
	file+=Date.now()
	file+=Math.floor(Math.random()*99999+10000)
	file+=originalName.substring(originalName.lastIndexOf('.'))
	return file
}
