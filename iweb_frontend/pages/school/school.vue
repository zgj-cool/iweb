<template>
	<view>
		<uni-list>
			<uni-list-item class="school" :showArrow="false" v-for="(item,i) of schoolList" :key="i">
				<view class="school_item">
					<image class="pic" src="../../static/icon/address.png" mode=""></image>
					<view class="info">
						<view class="cname" v-text="item.cname"></view>
						<view v-text="'校区地址 : '+item.address"></view>
						<view v-text="'咨询电话 : '+item.phone"></view>
						<view v-text="'邮编 : '+item.postcode"></view>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<uni-load-more :status="more"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				schoolList:[],	//讲师列表数据
				more:"more",
				pageNum:1
			};
		},
		onReachBottom() {
			this.loadMore(this.pageNum)
		},
		onLoad() {
			this.loadMore(this.pageNum)
		},
		onPullDownRefresh() {
		    this.loadMore(this.pageNum)
		},
		methods:{
			loadMore(pageNum){
				this.pageNum++
				this.more="loading"
				uni.request({
					url:this.$global.campus(pageNum),
					success: (res) => {
						if(res.data.length<4){
							this.more="noMore"
						}else{
							this.more="more"
						}
						this.schoolList=this.schoolList.concat(res.data)
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
	.school{
		padding: 0;
		.school_item{
			display: flex;
			align-items: center;
			.pic{
				width: 30%;
				height: 220rpx;
				margin-right: 15rpx;
			}
			.info{
				flex: 1;
				view{
					margin-top: 15rpx;
					font-size: 34rpx;
					color: #666;
				}
				.cname{
					color: $theme-color-sub;
				}
			}
		}
	}
</style>
