<template>
	<view class="transition-box">
		<view class="header">
			注册新用户
		</view>
		<view class="login-form">
			<input placeholder="请输入邮箱名" v-model="uname" />
			<input placeholder="请输入手机号" v-model="phone" />
			<input :password="true" placeholder="6-16位字母数字" v-model="upwd" />
			<input :password="true" placeholder="再次输入密码" v-model="repwd" />
			<view class="captcha">
				<input placeholder="请输入验证码" v-model="captcha" />
				<image @click="changeNum" class="pic" :src="$global.apiServer+'user/register/captcha?'+Num" mode=""></image>
			</view>
			<button type="default" @click="doRegister">注册</button>
			<view class="jump">已注册？
			<text @click="doJump">直接登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Num: Math.random(), //用于构建随机URL的随机数
				uname: '', //用户名邮箱
				phone: '', //手机号
				upwd: '', //密码
				repwd: '', //重复密码
				captcha: '', //验证码
			};
		},
		props: ["show"],
		methods: {
			doRegister() {
				//验证用户名邮箱
				let unameExp = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
				if (!unameExp.test(this.uname)) {
					 this.$showModal({concent:'邮箱不正确',delCancel:true}).then(res=>{})
					 return
				}
				//验证手机号
				let phoneExp = /^[1][3,4,5,7,8][0-9]{9}$/
				if (!phoneExp.test(this.phone)) {
					this.$showModal({concent:'手机号不正确',delCancel:true}).then(res=>{})
					return
				}
				//验证密码
				let upwdExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
				if (!upwdExp.test(this.upwd)) {
					this.$showModal({concent:'请输入6-16位字母数字',delCancel:true}).then(res=>{})
					return
				}
				//验证重复密码是否正确
				if (this.repwd != this.upwd) {
					this.$showModal({concent:'再次输入密码错误',delCancel:true}).then(res=>{})
					return
				}
				//验证码验证非空
				if (!this.captcha) {
					this.$showModal({concent:'请输入验证码',delCancel:true}).then(res=>{})
					return
				}
				uni.request({
						url:this.$global.checkUname(this.uname),
						success: (res) => {
							if(res.data.code==200){
								this.$showModal({concent:'邮箱已注册',delCancel:true}).then(res=>{})
								return
							}
							uni.request({
									url:this.$global.checkPhone(this.phone),
									success: (res) => {
										if(res.data.code==200){
											this.$showModal({concent:'手机号已注册',delCancel:true}).then(res=>{})
											return
										}
										uni.request({
											method: "POST",
											data: {
												uname: this.uname,
												phone: this.phone,
												upwd: this.upwd,
												captcha: this.captcha
											},
											withCredentials: true,	//携带客户端的身份信息：Cookie/sid
											header:{'Content-Type':'application/json'},
											url: this.$global.register(),
											success: (res) => {
												if (res.data.code == 200) {
													this.$showModal({concent:'注册成功',delCancel:true,confirmVal:'去登陆'}).then(res=>{
														this.doJump();
													})
												} else if (res.data.code == 405) {
													this.$showModal({concent:'验证码错误',delCancel:true}).then(res=>{})
												}else{
													this.$showModal({concent:'注册失败',delCancel:true}).then(res=>{})
												}
											},
											fail: (err) => {
												console.log(err)
											}
										})
									},
									fail: (err) => {
										console.log(err)
								}
							})
						},
						fail: (err) => {
							console.log(err)
					}
				})
			},
			doJump() {
				this.$emit('doRegister', !this.show)
			},
			changeNum() {
				//刷新验证码
				this.Num = Math.random()
			}
		}
	}
</script>

<style lang="scss">
	$form-item-height:85rpx;
	$border-ridous:50rpx;
	.transition-box {
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
			border-radius: $border-ridous;
			line-height: $form-item-height;
			margin-bottom: 30rpx;
			font-size: 34rpx;
		}

		button {
			width: 100%;
			height: $form-item-height;
			line-height: $form-item-height;
			background-color: $theme-color;
			color: #fff;
			font-size: 1em;
			border-radius: $border-ridous;
		}

		.jump {
			width: 100%;
			text-align: right;
			margin-top: 30rpx;
			color: #666;
			font-size: 34rpx;
			text{
				color: $theme-color;
			}
		}

		.captcha {
			width: 100%;
			display: flex;
			justify-content: space-between;

			input {
				width: 45%;
			}

			.pic {
				flex: 1;
				margin-left: 15rpx;
				height: $form-item-height;
			}
		}
	}
</style>
