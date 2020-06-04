<template>
	<view class="content">
		<table></table>
		<view class="info">
			<view v-text="'购买账户 : '+cartSettList[0].uname"></view>
			<view v-text="'联系电话 : '+cartSettList[0].phone"></view>
		</view>
		<view class="list">
			<view class="item" v-for="(item,i) of cartSettList" :key="i">
				<image :src="item.pic|imgUrl" mode=""></image>
				<view class="right">
					<view class="title" v-text="item.title"></view>
					<view class="tname" v-text="'讲师 : '+item.tname"></view>
					<view class="price">
						<view v-text="'课时 : '+item.cLength"></view>
						<text>{{item.price|currency}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="nav">
			<view class="left">
				<view class="">
					<text>{{price|currency}}</text>
				</view>
			</view>
			<view class="right">
				<button @click="addOrder" type="warn">提交订单</button>
			</view>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="base" title="" :before-close="true" @close="close" content='购买成功' @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
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
				ctid: [],
				cid: [],
				price: 0,
				cartSettList: [{
					uname: '',
					phone: '',
					pic: '',
					title: '',
					tname: '',
					cLength: ''
				}],
				isCart:true
			};
		},
		onLoad(option) {
			this.ctid = option.ctid
			this.cid = option.cid
			this.price = option.price
			this.settList()
			this.isCart=option.isCart
		},
		methods: {
			//列表信息查询
			settList() {
				uni.request({
					method: "POST",
					withCredentials: true,
					data: {
						cid: this.cid
					},
					url: this.$global.orderSettList(),
					success: (res) => {
						if (res.data.code == 409) {
							this.$global.toLogin()
							return
						}
						if (res.data.length > 0) {
							this.cartSettList = res.data
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			confirm(done){
				uni.switchTab({
					url:'../../pages/userCenter/userCenter'
				})
				done()
			},
			close(done){
				uni.switchTab({
					url:'../../pages/index/index'
				})
				done()
			},
			//提交订单
			addOrder() {
				uni.request({
					method: "POST",
					withCredentials: true,
					url: this.$global.orderAdd(),
					data: {
						cid: "[" + this.cid + "]"
					},
					success: (res) => {
						if (res.data.code == 200) {
							if(this.isCart!='false'){
								uni.request({
									method: "POST",
									url: this.$global.cartDel(),
									data: {
										ctid: this.ctid
									},
									withCredentials: true,
									success: (res) => {
										if (res.data.code == 200) {
										} 
									},
									fail: (err) => {
										console.log(err)
									}
								})
							}
							this.$refs.popup.open()
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})

			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 100%;
		min-height: 100vh;
		background-color: #eee;
		padding-bottom: 150rpx;
		.list {
			width: 95%;
			margin: 0 auto;
			background-color: #fff;
			border-radius: 20rpx;
			margin-top: 30rpx;
			padding: 0 20rpx;
			.item {
				display: flex;
				padding: 20rpx 0;
				border-bottom: 1px solid #eee;
				image {
					width: 34%;
					height: 145rpx;
				}

				.right {
					flex: 1;
					margin-left: 20rpx;

					.title {
						width: 420rpx;
						font-size: 36rpx;
						color: #333;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.tname {
						font-size: 34rpx;
						color: #999;
					}

					.price {
						display: flex;
						font-size: 34rpx;
						color: #999;
						justify-content: space-between;
						text {
							font-size: 34rpx;
							color: $theme-color-sub;
						}
					}
				}
			}
			.item:last-child{
				border-bottom: 0;
			}
		}

		.info {
			width: 95%;
			padding: 20rpx 20rpx;
			background-color: #fff;
			margin: 0 auto;
			margin-top: 20rpx;
			border-radius: 20rpx;

			view {
				font-size: 34rpx;
				padding: 10rpx 0;
				color: #666;
			}
		}

		.nav {
			width: 100%;
			height: 120rpx;
			position: fixed;
			display: flex;
			justify-content: space-between;
			background-color: #fff;
			align-items: center;
			bottom: 0;
			left: 0;
			border-top: 1px solid #ddd;

			.left {
				display: flex;
				align-items: center;
				
				text {
					color: $theme-color-sub;
					margin-left: 30rpx;
					font-size: 44rpx;
				}
			}

			.right {
				display: flex;
				align-items: center;
				margin-right: 30rpx;
				font-size: 34rpx;

				button {
					font-size: 33rpx;
					border-radius: 50rpx;
					height: 80rpx;
					padding: 0;
					text-align: center;
					width: 180rpx;
					line-height: 80rpx;
				}
			}
		}
	}
</style>
