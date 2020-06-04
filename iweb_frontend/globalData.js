// 整个项目中的全局数据
export let globalData={ 
	apiServer:'http://coolweb.applinzi.com/',
	// apiServer:'http://127.0.0.1:5050/',
	//获取最新课程API
	courseNewest(count){
		if(!count){
			var count=4
		}
		return this.apiServer+'course/newest?count='+count
	},
	//获取热门课程API
	courseHottest(count){
		if(!count){
			var count=4
		}
		return this.apiServer+'course/hottest?count='+count
	},
	//获取讲师列表API
	teacherList(format){
		if(format!='full'){
			var format='short'
		}
		return this.apiServer+'teacher/list?format='+format
	},
	//获取轮播图
	banner(){
		return this.apiServer+'banner'
	},
	//获取课程列表
	courseList(pageNum,typeId){
		let url=this.apiServer+'course/list?'
		if(pageNum){
			url+='pageNum='+pageNum+'&'
		}
		if(typeId!=0){
			url+='typeId='+typeId
		}
		return url
	},
	//获取课程详情
	courseDetail(cid){
		return this.apiServer+'course/detail?cid='+cid
	},
	//获取校区列表
	campus(pageNum){
		if(!pageNum){
			var pageNum=1
		}
		return this.apiServer+'campus?pageNum='+pageNum
	},
	//用户注册
	register(){
		return this.apiServer+'user/register'
	},
	//用户登录
	login(){
		return this.apiServer+'user/login'
	},
	//获取用户信息
	userInfo(uid){
		return this.apiServer+'user/userInfo?uid='+uid
	},
	//查询邮箱是否存在
	checkUname(uname){
		return this.apiServer+'user/check_uname?uname='+uname
	},
	//查询手机号是否存在
	checkPhone(phone){
		return this.apiServer+'user/check_phone?phone='+phone
	},
	//修改用户信息
	updateUserInfo(){
		return this.apiServer+'user/update/userInfo'
	},
	//修改用户密码
	updateUserUpwd(){
		return this.apiServer+'user/update/upwd'
	},
	//上传头像
	uploadAvatar(){
		return this.apiServer+'user/upload/avatar'
	},
	//修改头像
	updateAvatar(){
		return this.apiServer+'user/update/avatar'
	},
	//退出登录
	logout(){
		return this.apiServer+'user/logout'
	},
	//收藏查询
	favoriteSel(cid){
		return this.apiServer+'favorite/sel?cid='+cid
	},
	//收藏列表
	favoriteList(){
		return this.apiServer+'favorite/list'
	},
	//添加收藏
	favoriteAdd(){
		return this.apiServer+'favorite/add'
	},
	//取消收藏
	favoriteDel(){
		return this.apiServer+'favorite/del'
	},
	//删除收藏列表
	favoriteDelList(){
		return this.apiServer+'favorite/del/list'
	},
	//加入购物车
	cartAdd(cid){
		return this.apiServer+'cart/add?cid='+cid
	},
	//删除购物车
	cartDel(){
		return this.apiServer+'cart/del'
	},
	//查询是否加入购物车
	cartSel(cid){
		return this.apiServer+'cart/Sel?cid='+cid
	},
	//查询购物车数量
	cartCountSel(){
		return this.apiServer+'cart/countSel'
	},
	//查询购物车列表
	cartList(){
		return this.apiServer+'cart/list'
	},
	//检查后台session
	loginCheck(){
		return this.apiServer+'user/loginCheck'
	},
	//添加订单
	orderAdd(){
		return this.apiServer+'orders/add'
	},
	//查询订单课程信息
	orderSettList(){
		return this.apiServer+'orders/settList'
	},
	//查询是否已购买
	orderSel(cid){
		return this.apiServer+'orders/sel?cid='+cid
	},
	//查询我的课程
	orderList(){
		return this.apiServer+'orders/list'
	}
}
