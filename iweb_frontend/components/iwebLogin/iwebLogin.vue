<template>
	<view class="transition-box">
		<view class="header">
			用户登录
		</view>
		<view class="login-form">
			<input placeholder="请输入邮箱" v-model="uname" />
			<input :password="true" v-model="upwd" placeholder="请输入密码" />
			<button type="default" @click="doLogin">登陆</button>
			<view class="jump">
				<text @click="doJump">注册新用户</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uname:'',
				upwd:'',
			};
		},
		onLoad() {
		},
		methods: {
			doLogin() {
				if(!this.uname){
					this.$showModal({concent:'请输入邮箱',delCancel:true}).then(res=>{})
					return
				}
				if(!this.upwd){
					this.$showModal({concent:'请输入密码',delCancel:true}).then(res=>{})
					return
				}
				uni.request({
					method:"POST",
					data:{
						uname:this.uname,
						upwd:this.upwd
					},
					withCredentials: true,
					header:{
						'Content-Type':'application/json'
					},
					url:this.$global.login(),
					success: (res) => {
						if(res.data.code==200){
							uni.setStorage({
							    key: 'userInfo',
							    data:res.data.userInfo,
							    success: (res)=>{
							    }
							});
							//跳转个人中心页面
							this.$emit('sucLogin')
						}else{
							this.$showModal({concent:'邮箱或密码错误',delCancel:true}).then(res=>{})
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			doJump() {
				this.$emit('doLogin')
			},
			
		}
	}
</script>

<style lang="scss">
	$form-item-height:85rpx;
	$border-radius:50rpx;
	.transition-box{
		position: absolute;
		top: 0;
		width: 100%;
	}
	.header {
		font-size: 1.1em;
		text-align: center;
		color: #999999;
		margin: 50rpx 0 20rpx 0;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 50rpx;

		input {
			width: 100%;
			border: 1px solid $theme-color;
			padding: 20rpx;
			padding-left: 30rpx;
			height: $form-item-height;
			border-radius: $border-radius;
			margin-bottom: 30rpx;
			line-height: $form-item-height;
			font-size: 34rpx;
		}

		button {
			width: 100%;
			border-radius: $border-radius;
			height: $form-item-height;
			background-color: $theme-color;
			line-height: $form-item-height;
			color: #fff;
			font-size: 1em;
		}

		.jump {
			width: 100%;
			text-align: right;
			font-size: 34rpx;
			color: $theme-color;
			margin-top: 30rpx;
		}
	}
</style>
