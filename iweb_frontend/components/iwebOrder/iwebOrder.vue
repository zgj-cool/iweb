<template>
	<view class="content">
		<table></table>
		<view class="orders">
			<view class="item" v-for="(item,i) of orderList" :key="i">
				<image :src="item.pic|imgUrl" mode=""></image>
				<view class="info">
					<view class="title" v-text="item.title"></view>
					<view class="tname">
						<text v-text="'讲师 : '+item.tname"></text>
						<text class="cLength" v-text="'时长 : '+item.cLength"></text>
					</view>
					<view class="time">购买时间 : {{item.time|time}}</view>
					<view class="time">观看时效 : 长期有效</view>
				</view>
			</view>
		</view>
		<view class="not" v-if="orderList.length==0">
			空空如也,快去购买喜欢的课程吧
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: []
			};
		},
		onLoad() {
			this.orderLoad()
		},
		methods: {
			orderLoad() {
				uni.request({
					withCredentials: true,
					url: this.$global.orderList(),
					success: (res) => {
						if (res.data.code == 409) {
							this.$global.toLogin()
							return
						}
						this.orderList = res.data
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
		padding-bottom: 20rpx;
		.orders {
			width: 95%;
			margin: 0 auto;
			margin-top: 30rpx;
			.item {
				width: 100%;
				background-color: #fff;
				border-radius: 15rpx;
				margin-bottom: 20rpx;
				padding: 20rpx;
				display: flex;
				align-items: center;
				image {
					width: 40%;
					height: 160rpx;
				}

				.info {
					margin-left: 20rpx;
					flex: 1;
					.title {
						width: 405rpx;
						font-size: 36rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.time {
						font-size: 30rpx;
						color: #999;
					}
					.tname {
						font-size: 30rpx;
						color: #666;
						display: flex;
						.cLength{
							margin-left: 30rpx;
						}
					}
				}
			}
		}
		.not {
			width: 100%;
			height: 100vh;
			text-align: center;
			color: #999999;
			margin-top: -30rpx;
			padding-top: 115rpx;
			background-color: #fff;
		}
	}
</style>
