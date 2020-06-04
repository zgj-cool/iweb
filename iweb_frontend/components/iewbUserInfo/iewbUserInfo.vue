<template>
	<view>
		<uni-list>
			<uni-list-item @click="open('nickname')" :showArrow="false" class="item" note="">
				<view><text>昵称</text><text v-text="nickname"></text></view>
				<uni-popup ref="nickname" type="dialog">
					<uni-popup-dialog mode="input" title="修改昵称" :value="nickname" @close="close" @confirm="confirmNickName"></uni-popup-dialog>
				</uni-popup>
			</uni-list-item>
			<uni-list-item @click="open('uname')" :showArrow="false" class="item" note="">
				<view><text>邮箱</text><text v-text="uname"></text></view>
				<uni-popup ref="uname" type="dialog">
					<uni-popup-dialog mode="input" title="修改邮箱" :value="uname" @close="close" @confirm="confirmUname"></uni-popup-dialog>
				</uni-popup>
			</uni-list-item>
			<uni-list-item @click="open('phone')" :showArrow="false" class="item" note="">
				<view><text>手机</text><text v-text="phone"></text></view>
				<uni-popup ref="phone" type="dialog">
					<uni-popup-dialog mode="input" title="修改手机号" :value="phone" @close="close" @confirm="confirmPhone"></uni-popup-dialog>
				</uni-popup>
			</uni-list-item>
			<uni-list-item class="item" :showArrow="false" note="">
				<picker @change="bindSex" :value="sex" :range="sexArray">
					<view><text>性别</text><text v-text="sex"></text></view>
				</picker>
			</uni-list-item>
			<uni-list-item class="item" :showArrow="false" note="">
				<picker @change="bindAge" :value="age" :range="ageArray">
					<view><text>年龄</text><text v-text="age"></text></view>
				</picker>
			</uni-list-item>
			<uni-list-item class="item" :showArrow="false" note="">
				<picker @change="bindEdu" :value="edu" :range="eduArray">
					<view><text>学历</text><text v-text="edu"></text></view>
				</picker>
			</uni-list-item>
			<uni-list-item class="item" :showArrow="false" note="">
				<picker @change="bindJob" :value="job" :range="jobArray">
					<view><text>职业</text><text v-text="job"></text></view>
				</picker>
			</uni-list-item>
			<uni-list-item @click="doUpdatePwd" class="item" note="">
				<view><text>修改密码</text></view>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		components: {
			uniPopupDialog
		},
		data() {
			return {
				uid: '', //用户编号
				nickname: '', //昵称
				uname: '', //邮箱
				phone: '', //手机号
				sex: '', //性别
				age: 0, //年龄
				edu: '', //学历
				job: '', //职业
				sexArray: ['男', '女'], //性别修改选项
				ageArray: [], //年龄修改选项
				//学历修改选项
				eduArray: ['小学', '初中', '中专', '高中', '大专', '本科', '硕士', '博士'],
				//职业修改选项
				jobArray: ['销售', '客服', '技术', '产品', '设计', '运营', '项目管理', '项目质量', '人力行政', '财务', '审计', '税务', '广告', '设计', '传媒', '编辑',
					'市场', '公关', '金融', '生产制造', '房地产', '建筑', '物业', '采购', '贸易', '交通', '物流', '咨询', '法律', '教育', '翻译', '医疗', '护理', '生活服务',
					'能源', '矿产', '环保', '公务员', '农林牧渔', '综合管理', '自由职业', '其他'
				],
				reg:/^\s+|\s+$/g,//去掉字符串开头结尾空格
				unameExp:/^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/,
				phoneExp:/^[1][3,4,5,7,8][0-9]{9}$/,
				
				
			};
		},
		onLoad(option) {
			this.uid = option.uid
			this.getUserInfo()
			this.loadAgeArray()
		},
		methods: {
			//判断那个列表项点击，再弹出相应修改框
			open(p) {
				if(p=='nickname'){
					this.$refs.nickname.open()
				}
				if(p=='uname'){
					this.$refs.uname.open()
				}
				if(p=='phone'){
					this.$refs.phone.open()
				}
			},
			//修改框点击取消执行
			close(done) {done()},
			//修改框点击确定执行
			confirmNickName(done, value){
				var n=value.replace(this.reg,"")
				if(!n||n.length==0){
					uni.showToast({title:'昵称不能为空',duration:2000,icon:"none"})
					return
				}
				if(n.length>10){
					uni.showToast({title:'最多可输入10个字符',duration:2000,icon:"none"})
					return
				}
				this.updateInfo('nickname',value)
				done()	//关闭修改框
			},
			confirmUname(done, value){
				var n=value.replace(this.reg,"")
				if(!n||n.length==0){
					uni.showToast({title:'邮箱不能为空',duration:2000,icon:"none"})
					return
				}
				if(!this.unameExp.test(n)){
					uni.showToast({title:'邮箱不正确',duration:2000,icon:"none"})
					return
				}
				this.updateInfo('uname',value)
				done()	//关闭修改框
			},
			confirmPhone(done, value){
				var n=value.replace(this.reg,"")
				if(!n||n.length==0){
					uni.showToast({title:'手机号不能为空',duration:2000,icon:"none"})
					return
				}
				if(!this.phoneExp.test(n)){
					uni.showToast({title:'手机号不正确',duration:2000,icon:"none"})
					return
				}
				this.updateInfo('phone',value)
				done()	//关闭修改框
			},
			loadAgeArray() {
				for (let i = 14; i <= 60; i++) {
					this.ageArray.push(i)
				}
			},
			//性别选项发生改变
			bindSex: function(e) {
				this.updateInfo('sex', this.sexArray[e.target.value])
			},
			//年龄选项发生改变
			bindAge: function(e) {
				this.updateInfo('age', this.ageArray[e.target.value])
			},
			//学历选项发生改变
			bindEdu: function(e) {
				this.updateInfo('edu', this.eduArray[e.target.value])
			},
			//职业选项发生改变
			bindJob: function(e) {
				this.updateInfo('job', this.jobArray[e.target.value])
			},
			//修改用户信息
			updateInfo(item, val) {
				if(item=='uname'){
					if(this.uname==val){
						return
					}
					uni.request({
						url:this.$global.checkUname(val),
						success: (res) => {
							if(res.data.code==200){
								uni.showToast({title:'邮箱已被注册',duration:2000,icon:"none"})
							}else{
								this.updateItem(item,val)
							}
						},
						fail: (err) => {
							console.log(err)
						}
					})
					return
				}
				if(item=='phone'){
					if(this.phone==val){
						return
					}
					uni.request({
						url:this.$global.checkPhone(val),
						success: (res) => {
							if(res.data.code==200){
								uni.showToast({title:'手机号已被注册',duration:2000,icon:"none"})
							}else{
								this.updateItem(item,val)
							}
						},
						fail: (err) => {
							console.log(err)
						}
					})
					return
				}
				this.updateItem(item,val)
			},
			//修改用户信息请求
			updateItem(item,val){
				uni.request({
					method: "POST",
					url: this.$global.updateUserInfo(),
					data: {
						uid: this.uid,
						updateItem: item,
						updateVal: val
					},
					success: (res) => {
						if (res.data.code == 200) {
							this.getUserInfo()
						} else {
							uni.showToast({
								title: '修改失败',
								icon: "none",
								duration: 2000
							})
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			//获取用户数据
			getUserInfo() {
				uni.request({
					url: this.$global.userInfo(this.uid),
					success: (res) => {
						let userInfo = res.data[0]
						this.nickname = userInfo.nickname
						this.uname = userInfo.uname
						this.phone = userInfo.phone
						this.sex = userInfo.sex
						this.age = userInfo.age
						this.edu = userInfo.edu,
							this.job = userInfo.job
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			//跳转到修改密码
			doUpdatePwd(){
				uni.navigateTo({
					url:'../iwebUpdatePwd/iwebUpdatePwd?uid='+this.uid
				})
			}
		}
	}
</script>

<style lang="scss">
	.item {
		padding-right: 30rpx;
		font-size: 34rpx;
		view {
			color: #333333;
			text+text {
				margin-left: 45rpx;
				color: #999999;
			}
		}
	}
</style>
