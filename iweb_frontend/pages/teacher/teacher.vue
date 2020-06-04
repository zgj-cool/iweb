<template>
	<view>
		<view class="header">
			<text class="title">
				金牌讲师
			</text>
		</view>
		<uni-list>
			<uni-list-item class="list" :showArrow="false" v-for="(item,i) of teacherList" :key="i">
				<view class="teacher">
					<image class="pic" :src="item.tpic|imgUrl" mode=""></image>
					<view class="teacher_item">
						<view class="tname">
							<text v-text="item.tname"></text>
							<text v-text="item.maincourse"></text>
						</view>
						<view class="ltitle">工作经历</view>
						<view class="text" v-text="item.experience">
						</view>
						<view class="ltitle">授课风格</view>
						<view class="text" v-text="item.style">
						</view>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				teacherList:[]	//讲师数据
			};
		},
		onLoad() {
			this.loadMore()
		},
		onPullDownRefresh() {
		    this.loadMore()
		},
		methods:{
			loadMore(){
				uni.request({
					url: this.$global.teacherList('full'),
					success: (res) => {
						this.teacherList = res.data
						uni.stopPullDownRefresh()
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
	.header{
		padding: 20rpx 15rpx 15rpx 15rpx;
		border-bottom: 1px solid $theme-color-light;
		.title{
			font-size: 38rpx;
			color: $theme-color;
			border-bottom: 2px solid $theme-color;
			padding: 0 15rpx 15rpx;
		}
	}
	.list{
		padding: 0;
		.teacher{
			display: flex;
			justify-content: space-between;
			.pic{
				width: 300rpx;
				height: 405rpx;
				margin-right: 30rpx;
			}
			.teacher_item{
				flex: 1;
				.tname{
					font-size: 36rpx;
					color: $theme-color-sub;
					text+text{
						margin-left: 35rpx;
					}
				}
				.ltitle{
					font-size: 36rpx;
					font-weight: bold;
					color: #333333;
					margin: 15rpx 0 5rpx 0;
				}
				.text{
					font-size: 34rpx;
				}
			}
		}
	}
</style>
