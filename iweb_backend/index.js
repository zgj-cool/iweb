// iWeb项目后台子API子系统的入口模块
const express=require('express');
const loginCheck=require('./middleware/loginCheck.js')
const cors=require('cors')

let app=express();
// app.listen(5050,()=>{	//使用新浪云，只能使用5050端口
// });
app.listen(process.env.PORT || 5050)

// 添加前置中间件
app.use(express.static('public/'))//托管public目录下的静态文件
const bodyParser=require('body-parser')
app.use(bodyParser.json())//解析请求消息中的JSON主体数据
const session=require('express-session')
//为客户端分配sessionId，并为每个sessionId在服务器端分配存储空间
app.use(session({
	secret:'zgj123456',//密匙，口令，用于生成随机的sessionId的种子
	saveUninitialized:true,//自动保存未经手工初始化的session吗
	resave:true,//是否自动保存，无需手工调用req.session.save()来保存数据
}))
// 解决跨域session问题
app.use(cors({
  //修改Access—Control-Allow-Origin头
  origin:["http://127.0.0.1:8080","http://localhost:8080"],
  //修改Acess-Control-Allow-Credentials头，允许客户端提交身份信息
  credentials:true
}))

// 执行业务逻辑————接收请求返回响应————由路由和路由器完成
//处理所有以'/user'开头请求的路由器
const userRouter=require('./router/user.js')	
app.use('/user',userRouter)
//处理所有以'/favorite'开头请求的路由器
const favoriteRouter=require('./router/favorite.js')
// 所有收藏夹相关路由都需要登录检查
app.use('/favorite',loginCheck)	
app.use('/favorite',favoriteRouter)
//处理所有以'/type'开头请求的路由器
const typeRouter=require('./router/type.js')	
app.use('/type',typeRouter)
//处理所有以'/course'开头请求的路由器
const courseRouter=require('./router/course.js')	
app.use('/course',courseRouter)
//处理所有以'/cart'开头请求的路由器
const cartRouter=require('./router/cart.js')
// 所有购物车相关路由都需要登录检查
app.use('/cart',loginCheck)		
app.use('/cart',cartRouter)
const ordersRouter=require('./router/orders.js')
// 所有订单相关路由都需要登录检查
app.use('/orders',loginCheck)		
app.use('/orders',ordersRouter)
//处理所有以'/teacher'开头请求的路由器
const teacherRouter=require('./router/teacher.js')	
app.use('/teacher',teacherRouter)
//处理所有以'/banner'开头请求的路由器
const bannerRouter=require('./router/banner.js')	
app.use('/banner',bannerRouter)
//处理所有以'/campus'开头请求的路由器
const campusRouter=require('./router/campus.js')	
app.use('/campus',campusRouter)

// 添加后置中间件
//Express默认提供了一个错误处理中间件，形如：app.use(err,req,res,next=>{})
//自定义错误处理中间件，覆盖Express提供的默认错误处理中间件
app.use((err,req,res,next)=>{	//错误处理中间件第一个参数是err
		res.status(500)
		res.send({
			code:500,
			msg:"服务器运行出错！请稍后重试！",
			err:err
		})
})

