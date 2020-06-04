<template>
	<view class="content">
		<view class="title" v-text="courseDetail[0].title"></view>
		<image class="pic" :src="courseDetail[0].pic|imgUrl" mode=""></image>
		<view>
			<text class="subtitle">讲师 :</text>
			<text class="tname" v-text="courseDetail[0].tname"></text></view>
		<view>
			<text class="subtitle">课时 :</text>
			<text v-text="courseDetail[0].cLength"></text></view>
		<view>
			<text class="subtitle">开课时间 :</text>
			<text v-text="courseDetail[0].startTime"></text></view>
		<view class="address">
			<text class="subtitle">上课地点 :</text>
			<text v-text="courseDetail[0].address"></text>
			<navigator url="../school/school" open-type="switchTab" hover-class="other-navigator-hover">
				<text class="toBar" type="default">查看校区地址</text>
			</navigator>
		</view>
		<view class="details">
			<text class="subtitle">课程详情</text>
			<text v-html="courseDetail[0].details"></text>
		</view>
		<view class="nav">
			<view class="nav_icon">
				<view class="">
					<uni-icons type="headphones" size="22"></uni-icons>客服
				</view>
				<view class="heartIcon" @click="heartAdd">
					<uni-icons :type="heartIcon" :color="heartColor" size="22"></uni-icons>{{heartText}}
				</view>
				<view class="cartIcon" @click="toCart">
					<uni-icons :type="cartIcon" size="22"></uni-icons>购物车
					<text class="cartInfo" v-text="cartInfo"></text>
				</view>
			</view>
			<view @click="cartBtn" class="cart">加入购物车</view>
			<view @click="orderBtn" class="order">立即购买</view>
		</view>
	</view>
</template>

<script>
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		components: {
			uniPopupDialog,
			uniIcons
		},
		data() {
			return {
				cid: '', //课程编号
				courseDetail: [{ //课程详情数据
					title: '',
					pic: '',
					tname: '',
					cLength: 0,
					startTime: '',
					address: '',
					details: ''
				}],
				price:0,
				heartIcon:'heart',
				heartText:'收藏',
				heartColor:'',
				cartIcon:'cart',
				cartInfo:'',
				ctid:'',
				isHeart:false,		//是否收藏
				isCart:false,		//是否加入购物车
				cartCount:0,		//购物车数量
				isOrder:false,		//是否购买
				isLogin:true		//是否登录
			}
		},
	
		onLoad(option) {
			this.cid = option.cid
			this.loadMore(this.cid)
			this.favoriteSel(this.cid)
			this.cartSel(this.cid)
			this.countSel()
			this.orderSel(this.cid)
		},
		onShow() {
			this.countSel()
			this.cartSel(this.cid)
		},
		methods: {
			//查询是否购买
			orderSel(cid){
				uni.request({
					url:this.$global.orderSel(cid),
					withCredentials:true,
					success: (res) => {
						if(res.data.length>0){
							this.isOrder=true
						}else{
							this.isOrder=false
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			// 购物车数量查询
			countSel(){
				uni.request({
					url:this.$global.cartCountSel(),
					withCredentials: true,
					success:(res)=>{
						if(res.data.length>0){
							this.cartCount=Number(res.data[0].c)
							this.cartInfo=this.cartCount
							if(this.cartCount>0){
								this.cartIcon='cart-filled'
							}else{
								this.cartIcon='cart'
							}
						}else{
							if(this.isLogin){
								this.cartInfo=0
							}
						}
					},
					fail:(err)=>{
						console.log(err)
					}
				})
			},
			//是否加入购物车查询
			cartSel(cid){
				uni.request({
					url:this.$global.cartSel(cid),
					withCredentials:true,
					success:(res)=>{
						if(res.data.code==409){
							this.isLogin=false
						}
						if(res.data.length>0){
							this.isCart=true
							this.ctid=res.data[0].ctid
						}else{
							this.isCart=false
						}
					},
					fail:(err)=>{
						console.log(err)
					}
				})
			},
			//是否收藏查询
			favoriteSel(cid){
				uni.request({
					url:this.$global.favoriteSel(cid),
					withCredentials: true,
					success:(res)=>{
						if(res.data.length>0){
							this.isHeart=true
							this.heartIcon='heart-filled'
							this.heartText='已收藏'
							this.heartColor='#FFA200'
						}else{
							this.isHeart=false
							this.heartIcon='heart'
							this.heartText='收藏'
							this.heartColor=''
						}
					},
					fail:(err)=>{
						console.log(err)
					}
				})
			},
			loadMore(cid) {
				uni.request({
					url: this.$global.courseDetail(cid),
					success: (res) => {
						this.courseDetail = res.data
						this.price=res.data[0].price
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			//添加收藏
			heartAdd(){
				if(!this.isLogin){
					this.$showModal({concent:'请先登录',confirmVal:'去登陆',delCancel:false}).then(res=>{
						uni.switchTab({
							url:'../userCenter/userCenter'
						})
					})
					return
				}
				let url=null
				if(this.isHeart){
					url=this.$global.favoriteDel()
				}else{
					url=this.$global.favoriteAdd()
				}
				uni.request({
					method:"POST",
					data:{
						cid:this.cid
					},
					header:{'Content-Type':'application/json'},
					withCredentials: true,	//携带客户端的身份信息：Cookie/sid
					url:url,
					success:(res)=>{
						if(res.data.code==200){
							this.favoriteSel(this.cid)
						}
					},
					fail:(err)=>{
						console.log(err)
					}
				})
			},
			//点击购物车
			toCart(){
				if(!this.isLogin){
					this.$showModal({concent:'请先登录',confirmVal:'去登陆',delCancel:false}).then(res=>{
						uni.switchTab({
							url:'../userCenter/userCenter'
						})
					})
					return
				}
				uni.navigateTo({
					url:'../../components/iwebCart/iwebCart'
				})
			},
			//点击加入购物车
			cartBtn(){
				if(!this.isLogin){
					this.$showModal({concent:'请先登录',confirmVal:'去登陆',delCancel:false}).then(res=>{
						uni.switchTab({
							url:'../userCenter/userCenter'
						})
					})
					return
				}
				if(this.isCart){
					this.$showModal({concent:'您已添加该课程',delCancel:true}).then(res=>{})
					return
				}
				if(this.isOrder){
					this.$showModal({concent:'您已购买该课程',confirmVal:'去查看',delCancel:false}).then(res=>{
						uni.navigateTo({
							url:'../../components/iwebOrder/iwebOrder'
						})
					})
					return
				}
				uni.request({
					url:this.$global.cartAdd(this.cid),
					withCredentials: true,
					success:(res)=>{
						uni.showToast({
							title: '加入购物车成功',
							duration:2000
						});
						this.cartSel(this.cid)
						this.countSel()
					},
					fail:(err)=>{
						console.log(err)
					}
				})
			},
			//点击立即购买
			orderBtn(){
				if(!this.isLogin){
					this.$showModal({concent:'请先登录',confirmVal:'去登陆',delCancel:false}).then(res=>{
						uni.switchTab({
							url:'../userCenter/userCenter'
						})
					})
					return
				}
				if(this.isOrder){
					this.$showModal({concent:'您已购买该课程',confirmVal:'去查看',delCancel:false}).then(res=>{
						uni.navigateTo({
							url:'../../components/iwebOrder/iwebOrder'
						})
					})
					return
				}
				uni.navigateTo({
					url:`../../components/iwebCartSett/iwebCartSett?cid=${this.cid}&ctid=${this.ctid}&price=${this.price}&isCart=${this.isCart}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		.title {
			text-align: center;
			font-size: 38rpx;
			font-weight: bold;
			margin: 30rpx 0 20rpx 0;
		}

		.pic {
			width: 100%;
			height: 470rpx;
		}

		view {
			padding: 0 15rpx;
			margin-bottom: 15rpx;
			font-size: 36rpx;
			color: #333333;

			text+text {
				margin-left: 10rpx;
			}
		}

		.subtitle {
			font-size: 36rpx;
			font-weight: bold;
		}

		.tname {
			color: $theme-color;
		}

		.details {
			padding: 0;
			margin-bottom: 140rpx;
			.subtitle {
				border-bottom: 1px solid $theme-color-light;
				padding-bottom: 20rpx;
				margin: 20rpx 0;
			}

			text {
				display: block;
				margin: 0;
				padding: 0 15rpx;
			}
		}

		.address {
			display: flex;

			.toBar {
				color: $theme-color;
				margin-left: 20rpx;
			}
		}
		.nav{
			width: 100%;
			position: fixed;
			bottom:-15rpx;
			background-color: #fff;
			left:0;
			height: 110rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-top: 1px solid #ddd;
			text-align: center;
			.nav_icon{
				display: flex;
				height: 100%;
				width: 45%;
				justify-content: space-between;
				align-items: center;
				margin-top: 15rpx;
				margin-left: -15rpx;
				padding: 0;
				view{
					width: 33%;
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 26rpx;
					padding-top:15rpx
				}
				.cartIcon{
					position:relative;
					.cartInfo{
						position:absolute;
						top: 7rpx;
						left: 46rpx;
						background-color:#FF6600;
						width: 35rpx;
						color: #fff;
						border-radius: 50%;
					}
				}
			}
			.cart{
				height: 110rpx;
				width: 30%;
				margin-top: 15rpx;
				line-height: 110rpx;
				color: #fff;
				font-size: 34rpx;
				background-color: #FFA200;
			}
			.order{
				height: 110rpx;
				margin-top: 15rpx;
				flex: 1;
				color: #fff;
				font-size: 34rpx;
				margin-right: -15rpx;
				line-height: 110rpx;
				background-color: #FF0000;
			}
		}
	}
</style>
