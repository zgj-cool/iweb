<template>
	<view class="content">
		<view class="title">旧密码 :</view>
		<input class="uni-input" v-model="upwd" password type="text" placeholder="输入旧密码" />
		<view class="title">新密码 :</view>
		<input class="uni-input" password v-model="newUpwd" type="text" placeholder="输入6-16位字母数字" />
		<button @click="updateUpwd">确认</button>
	</view>
</template>

<script>
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		 components: {
		        uniPopup,
				uniPopupMessage,
		    },
		data() {
			return {
				uid:'',			//用户编号
				upwd:'',		//旧密码
				newUpwd:''		,//新密码
				upwdExp:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
			};
		},
		onLoad(option){
			//获取用户编号
			this.uid=option.uid
		},
		methods:{
			updateUpwd(){
				if(!this.upwd){
					this.$showModal({concent:'旧密码不能为空',delCancel:true}).then(res=>{})
					return
				}
				if(!this.upwdExp.test(this.newUpwd)){
					this.$showModal({concent:'请输入6-16位字母数字',delCancel:true}).then(res=>{})
					return
				}
				if(this.upwd==this.newUpwd){
					this.$showModal({concent:'新密码与旧密码不能相同',delCancel:true}).then(res=>{})
					return
				}
				uni.request({
					method:'POST',
					header:{
						'Content-Type':"application/json"
					},
					data:{
						upwd:this.upwd,
						newUpwd:this.newUpwd,
						uid:this.uid
					},
					url:this.$global.updateUserUpwd(),
					success:(res)=>{
						console.log(res)
						if(res.data.code==200){
							uni.request({
								url:this.$global.logout(),
								withCredentials:true,
								success:(res)=>{
								},
								fail:(err)=>{
									console.log(err)
								}
							})
							this.$showModal({concent:'修改成功',delCancel:true}).then(res=>{
								uni.navigateBack({
								    delta: 2
								});
							})
						}
						if(res.data.code==400){
							this.$showModal({concent:'密码错误',delCancel:true}).then(res=>{})
						}
					},
					fail:(err)=>{
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		width: 100%;
		height: 100vh;
		background-color: #eee;
		padding-top: 20rpx;
		.title{
			color: #666;
			padding-left: 30rpx;
			font-size: 36rpx;
		}
		input{
			background-color: #fff;
			margin: 20rpx 0;
			height: 100rpx;
			padding-left:30rpx;
			margin-bottom: 40rpx;
		}
		button{
			width: 85%;
			height: 85rpx;
			font-size: 34rpx;
			background-color: $theme-color;
			color: #fff;
			line-height: 85rpx;
			margin-top: 60rpx;
			border-radius: 10rpx;
		}
	}
</style>
