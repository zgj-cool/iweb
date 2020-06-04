<template>
	<view>
		<!-- 未登录则显示登录页面 -->
		<view v-if="!isLogin">
			<uni-transition :mode-class="['slide-left','fade']" :show="isShow">
				<iwebLogin @doLogin='doJump' @sucLogin='sucLogin'></iwebLogin>
			</uni-transition>

			<uni-transition :mode-class="['slide-right','fade']" :show="!isShow">
				<iwebRegister @doRegister='doJump'></iwebRegister>
			</uni-transition>
		</view>
		<!-- 已登录则显示个人中心页面 -->
		<view class="content">
			<view v-if="isLogin">
				<uni-transition :mode-class="['slide-right','fade']" :show="isLogin">
					<view class="userCenter">
						<view class="uInfo">
							<image @click="setAvatar" class="avatar" :src="userInfo.avatar|imgUrl" mode="aspectFill"></image>
							<view class="heade_title">
								<view class="title_info">
									<view class="nicname" v-text="userInfo.nickname"></view>
									<image class="sex" v-if="userInfo.sex" :src="userInfo.sex|imgSex" mode=""></image>
									<view class="age" v-if="userInfo.age" v-text="userInfo.age"></view>
									<view class="edu" v-if="userInfo.edu" v-text="userInfo.edu"></view>
								</view>
								<view class="uname" v-text="userInfo.uname"></view>
							</view>
						</view>
						<uni-list>
							<uni-list-item @click="toUserInfo" class="item" note=""><text>账户设置</text></uni-list-item>
							<uni-list-item @click="toMyOrder" class="item" note=""><text>我的课程</text></uni-list-item>
							<uni-list-item @click="toMyCart" class="item" note=""><text>我的购物车</text></uni-list-item>
							<uni-list-item @click="toMyFavorite" class="item" note=""><text>我的收藏夹</text></uni-list-item>
						</uni-list>
						<button class="out" @click="loginOut" type="default">退出登录</button>
					</view>
				</uni-transition>
			</view>
		</view>
	</view>
</template>

<script>
	import iwebLogin from '../../components/iwebLogin/iwebLogin.vue'
	import iwebRegister from '../../components/iwebRegister/iwebRegister.vue'

	export default {
		components: {
			iwebLogin,
			iwebRegister,
		},
		data() {
			return {
				isShow: true,
				isLogin: false,
				uid: 0,
				userInfo: {
					avatar:'',
					uname: '',
					nickname: '',
					sex: '',
					age: 0,
					edu: '',
				},
			};
		},
		onLoad() {
		},
		onShow(){
			this.sucLogin()
		},
		methods: {
			loginCheck(){
				uni.request({
					url:this.$global.loginCheck(),
					success: (res) => {
						if(res.data.code==409){
							//删除本地sessionStorage缓存
							uni.removeStorage({
								key: 'userInfo',
								success: (res) => {
									//转到未登录状态
									this.isLogin = false
								}
							});
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			toMyCart(){
				uni.navigateTo({
				    url: '../../components/iwebCart/iwebCart',
				});
			},
			toMyFavorite(){
				uni.navigateTo({
				    url: '../../components/iwebMyFavorites/iwebMyFavorites',
				});
			},
			toMyOrder(){
				uni.navigateTo({
				    url: '../../components/iwebOrder/iwebOrder'
				});
			},
			//切换登录注册页面
			doJump() {
				this.isShow = !this.isShow
			},
			//登录成功
			sucLogin() {
				uni.request({
					url:this.$global.loginCheck(),
					withCredentials:true,
					success: (res) => {
						if(res.data.code==409){
							//删除本地sessionStorage缓存
							uni.removeStorage({
								key: 'userInfo',
								success: (res) => {
									//转到未登录状态
									this.isLogin = false
								}
							});
						}
						if(res.data.code==201){
							this.uid=res.data.userInfo.uid
							//转到已登录状态 
							this.isLogin = true
							this.getUserInfo()
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			//退出登录
			loginOut() {
				uni.request({
					url:this.$global.logout(),
					withCredentials:true,
					success:(res)=>{
						if(res.data.code==200){
							//删除本地sessionStorage缓存
							uni.removeStorage({
								key: 'userInfo',
								success: (res) => {
									//转到未登录状态
									this.isLogin = false
								}
							});
						}
					},
					fail:(err)=>{
						console.log(err)
					}
				})
				
			},
			//更换头像
			setAvatar() {
				uni.chooseImage({
					count:1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
				    success: (res) => {
				        const tempFilePaths = res.tempFilePaths;
				        uni.uploadFile({
				            url: this.$global.uploadAvatar(),
				            filePath: tempFilePaths[0],
				            name: 'avatar',
				            success: (res) => {
								let fileName=JSON.parse(res.data).fileName
								uni.request({
									url:this.$global.updateAvatar(),
									data:{
										uid:this.userInfo.uid,
										fileName:fileName,
										oldFileName:this.userInfo.avatar
									},
									success: (res) => {
										if(res.data.code==200){
											this.getUserInfo()
										}
									},
									fail: (err) => {
										console.log(err)
									}
								})
				            }
				        });
				    }
				});
			},
			//获取用户数据
			getUserInfo(){
				uni.request({
					url:this.$global.userInfo(this.uid),
					success: (res) => {
						this.userInfo=res.data[0]
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			//跳转账户设置页面
			toUserInfo(){
				uni.navigateTo({
				    url: '../../components/iewbUserInfo/iewbUserInfo?uid='+this.uid,
				});
			},
		}
	}
</script>

<style lang="scss">
	.content {
		position: absolute;
		width: 100%;
		top: 0;
	}

	.userCenter {
		.uInfo {
			display: flex;
			align-items: center;
			height: 160rpx;
			padding: 15rpx;
			border-bottom: 2px solid $theme-color-light;
			.avatar {
				width: 18%;
				height: 130rpx;
				border-radius: 50%;
				margin-right: 25rpx;
			}

			.header_title {
				height: 160rpx;
			}

			.title_info {
				display: flex;
				height: 50rpx;
				align-items: center;
				.nicname {
					font-size: 40rpx;
					color: #333333;
				}
				.sex {
					display: inline-block;
					margin-left: 15rpx;
					width: 46rpx;
					height: 46rpx;
					border-radius: 10rpx;
				}
				.age {
					background-color: $theme-color-sub;
					font-size: 32rpx;
					border-radius: 10rpx;
					color: #fff;
					padding: 0 10rpx 5rpx 10rpx;
					margin-left: 15rpx;
				}

				.edu {
					background-color: $theme-color;
					font-size: 32rpx;
					border-radius: 10rpx;
					color: #fff;
					padding: 0 10rpx 5rpx 10rpx;
					margin-left: 15rpx;
				}
			}

			.uname {
				color: #999999;
				font-size: 32rpx;
			}

		}

		.item {
			padding: 0;

			text {
				font-size: 34rpx;
				margin-left: 20rpx;
			}
		}

		.out {
			height: 80rpx;
			line-height: 80rpx;
			font-size: 36rpx;
		}
	}
</style>
