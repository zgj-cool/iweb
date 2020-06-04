<template>
	<view class="content">
		<!-- 轮播广告 -->
		<swiper class="swiper" indicator-active-color="#57BC4C" :indicator-dots="true" :autoplay="true" :interval="3000"
		 duration="500" circular="false">
			<swiper-item v-for="item of bannerList">
					<image :src="item.bannerPic|imgUrl" mode="aspectFill">
			</swiper-item>
		</swiper>
		
		<!-- 最新课程 -->
		<view class="header">
			<text>最新课程</text>
			<navigator url="../courseList/courseList" open-type="switchTab">更多</navigator>
		</view>
		<view class="list">
			<view class="item" @click="toDetail(item.cid)" v-for="(item,i) of courseNewest" :key="i">
				<image :src="item.pic|imgUrl" class="pic" mode="">
				<view class="title" v-text="item.title"></view>
				<view class="tname_price">
					<view class="tname" v-text="'讲师 : '+item.tname"></view>
					<view class="price">{{item.price|currency}}</view>
				</view>
			</view>
		</view>
		<!-- 热门课程 -->
		<view class="header">
			<text>热门课程</text>
			<navigator url="../courseList/courseList" open-type="switchTab">更多</navigator>
		</view>
		<view class="list">
			<view class="item" @click="toDetail(item.cid)" v-for="(item,i) of courseHottest" :key="i">
				<image :src="item.pic|imgUrl" class="pic" mode="">
				<view class="title" v-text="item.title"></view>
				<view class="tname_price">
					<view class="tname" v-text="'讲师 : '+item.tname"></view>
					<view class="price">{{item.price|currency}}</view>
				</view>
			</view>
		</view>
		<!-- 讲师列表 -->
		<view class="header">
			<text>名师堂</text>
			<navigator url="../teacher/teacher" open-type="switchTab">更多</navigator>
		</view>
		<scroll-view class="teacher-list" scroll-x="true" >
			<view class="teacher" v-for="(item,i) of teacherList" :key="i">
				<image class="tpic" :src="item.tpic|imgUrl" mode=""></image>
				<view class="tname" v-text="'讲师 : '+item.tname"></view>
				<view class="maincourse" v-text="'主讲 : '+item.maincourse"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bannerList: [], //轮播图数据
				courseNewest: [], //最新课程数据
				courseHottest:[], //热门课程
				teacherList: [], //讲师列表
			}
		},
		onLoad() {
			// 加载轮播图数据
			this.loadIndex()
		},
		onPullDownRefresh() {
		    this.loadIndex()
		},
		methods: {
			// 加载首页数据
			loadIndex() {
				// 加载轮播图数据
				uni.request({
					url: this.$global.banner(),
					success: (res) => {
						this.bannerList = (res.data)
					},
					fail: (err) => {
						console.log(err)
					}
				})
				// 加载最新课程数据
				uni.request({
					url: this.$global.courseNewest(),
					success: (res) => {
						this.courseNewest = res.data
					},
					fail: (err) => {
						console.log(err)
					}
				})
				// 加载最新课程数据
				uni.request({
					url: this.$global.courseHottest(),
					success: (res) => {
						this.courseHottest = res.data
					},
					fail: (err) => {
						console.log(err)
					}
				})
				// 加载讲师列表
				uni.request({
					url: this.$global.teacherList('short'),
					success: (res) => {
						this.teacherList = res.data
					},
					fail: (err) => {
						console.log(err)
					}
				})
				uni.stopPullDownRefresh()
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
	$swiper-height:300rpx;
	$swiper-width:100%;
	$title-font-size:32rpx;
	$sub-title-font-size:28rpx;
	$title-color:#333;
	$sub-title-color:#999;
	.swiper{
		width: $swiper-width;
		height: $swiper-height;
		image{
			width: $swiper-width;
			height:$swiper-height;
		}
	}
	
	.header{
		padding: 25rpx 15rpx 0 15rpx;
		border-bottom: 1px solid $theme-color-light;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text{
			font-size: 33rpx;
			color: $theme-color;
			font-weight: bold;
			display: block;
			padding: 0 15rpx;
			height: 100%;
			padding-bottom: 10rpx;
			position: relative;
			top: 3rpx;
			border-bottom: 2px solid $theme-color;
		}
		navigator{
			font-size: 28rpx;
			color: #999999;
			margin-right: 10rpx;
		}
	}
	
	.list{
		display: flex;
		flex-wrap: wrap;
		margin: 10rpx 0 15rpx 0;
		.item{
			width: 50%;
			padding: 10rpx;
			.pic{
				width: 100%;
				height: 225rpx;
			}
		}
		.title{
			text-align: center;
			font-size: $title-font-size;
			color: $title-color;
		}
		.tname_price{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 15rpx 15rpx 0 15rpx;
			font-size: $sub-title-font-size;
			color: $sub-title-color;
			.price{
				color: $theme-color-sub;
				font-weight: bold;
			}
		}
	}

	.teacher-list{
		padding: 20rpx 10rpx;
		white-space: nowrap;
		.teacher{
			padding: 0 15rpx 0 0;
			display: inline-block;
			width: 40%;
			.tpic{
				width: 100%;
				height: 370rpx;
			}
			.tname{
				font-size: $title-font-size;
				text-align: center;
				color: $title-color;
			}
			.maincourse{
				color: $sub-title-color;
				padding: 15rpx 15rpx 0 15rpx;
				font-size: $sub-title-font-size;
			}
		}
	}
</style>
