<template>
	<view class="content">
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#57BC4C"></uni-segmented-control>
		<view>
			<view v-show="current === 0">
				<uni-list>
					<uni-list-item @click="toDetail(item.cid)" :showArrow="false" class="list" v-for="(item,i) of courseList[0]" :key="i">
						<view class="item">
							<image class="pic" :src="item.pic|imgUrl" mode=""></image>
							<view class="item_title">
								<view class="title" v-text="item.title"></view>
								<view class="subtitle" v-text="'讲师 : '+item.tname"></view>
								<view class="subtitle" v-text="'课时 : '+item.cLength"></view>
							</view>
							<view class="price">
								{{item.price|currency}}
							</view>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
			<view v-show="current === 1">
				<uni-list>
					<uni-list-item @click="toDetail(item.cid)" :showArrow="false" class="list" v-for="(item,i) of courseList[1]" :key="i">
						<view class="item">
							<image class="pic" :src="item.pic|imgUrl" mode=""></image>
							<view class="item_title">
								<view class="title" v-text="item.title"></view>
								<view class="subtitle" v-text="'讲师 : '+item.tname"></view>
								<view class="subtitle" v-text="'课时 : '+item.cLength"></view>
							</view>
							<view class="price">
								{{item.price|currency}}
							</view>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
			<view v-show="current === 2">
				<uni-list>
					<uni-list-item @click="toDetail(item.cid)" :showArrow="false" class="list" v-for="(item,i) of courseList[2]" :key="i">
						<view class="item">
							<image class="pic" :src="item.pic|imgUrl" mode=""></image>
							<view class="item_title">
								<view class="title" v-text="item.title"></view>
								<view class="subtitle" v-text="'讲师 : '+item.tname"></view>
								<view class="subtitle" v-text="'课时 : '+item.cLength"></view>
							</view>
							<view class="price">
								{{item.price|currency}}
							</view>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
			<view v-show="current === 3">
				<uni-list>
					<uni-list-item @click="toDetail(item.cid)" :showArrow="false" class="list" v-for="(item,i) of courseList[3]" :key="i">
						<view class="item">
							<image class="pic" :src="item.pic|imgUrl" mode=""></image>
							<view class="item_title">
								<view class="title" v-text="item.title"></view>
								<view class="subtitle" v-text="'讲师 : '+item.tname"></view>
								<view class="subtitle" v-text="'课时 : '+item.cLength"></view>
							</view>
							<view class="price">
								{{item.price|currency}}
							</view>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
		</view>
		<uni-load-more :status="more"></uni-load-more>
	</view>
</template>

<script>
	
	export default {
		
		data() {
			return {
				items: ['全部课程', '基础课程', '核心课程', '进阶课程'],
				current: 0,					//当前分段
				courseList:[[],[],[],[]],	//课程列表数据
				pageNum:[1,1,1,1],			//列表当前页码
				typeId:0, 					//课程分类编号
				more:"more",				//加载更多状态
			};
		},
		onLoad() {
			this.loadMore(this.pageNum[this.typeId],this.typeId);
		},
		onReachBottom() {
			this.loadMore(this.pageNum[this.typeId],this.typeId)
		},
		onPullDownRefresh() {
		    this.loadMore(this.pageNum[this.typeId],this.typeId);
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
					this.typeId=e.currentIndex;
					this.loadMore(this.pageNum[this.typeId],this.typeId);
				}
			},
			//加载课程列表数据
			loadMore(pageNum,typeId){
				uni.showLoading({
					title:"课程加载中..."
				})
				this.pageNum[typeId]++
				this.more="loading"
				uni.request({
					url:this.$global.courseList(pageNum,typeId),
					success: (res) => {
						if(res.data.pageNum>=res.data.pageCount){
							this.more="noMore"
						}else{
							this.more="more"
					}
						this.courseList[typeId]=this.courseList[typeId].concat(res.data.list)
						uni.hideLoading()
						uni.stopPullDownRefresh()
					},
					fail: (err) => {
						console.log(err)
						uni.hideLoading()
					},
					
				})
			},
			//跳转课程详情页
			toDetail(cid){
				uni.navigateTo({
				    url: '../courseDetail/courseDetail?cid='+cid
				});
			}
		}
	}
</script>

<style lang="scss">
	$subtitle-font-size:30rpx;
	.content {
		padding: 15rpx;
		.list{
			padding: 0;
			.item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.pic{
					width: 28%;
					height: 150rpx;
					margin-right: 15rpx;
				}
				.item_title{
					width: 330rpx;
					.title{
						width: 100%;
						font-size: 32rpx;
						font-weight: bold;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						margin-bottom: 10rpx;
						color: #333333;
					}
					.subtitle{
						font-size: $subtitle-font-size;
						color: #666;
					}
				}
				.price{
					font-size: $subtitle-font-size+4;
					color: $theme-color-sub;
				}
			}
		}
	}
	
</style>
