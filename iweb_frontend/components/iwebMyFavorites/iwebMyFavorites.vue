<template>
	<view class="content">
		<uni-list>
			<uni-list-item :showArrow="false" class="list" v-for="(item,i) of favoriteList" :key="i">
				<view class="list_row">
				   <label v-if="isChecked[i].is" class="radio"><radio @click="radio(i,1)" :checked="false"/></label>
				   <label v-if="!isChecked[i].is" class="radio"><radio @click="radio(i,-1)" :checked="true"/></label>
				<view class="item"  @click="toDetail(item.cid)">
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
				</view>
			</uni-list-item>
		</uni-list>
		<view class="nav" v-if="favoriteList.length>0">
			<view class="left">
				<label v-if="!allChecked" @click="allRadio(1)" class="radio"><radio :checked="false"/>全选</label>
				<label v-if="allChecked" @click="allRadio(-1)" class="radio"><radio :checked="true"/>全选</label>
			</view>
			<view class="right">
				<button @click="del" class="mini-btn" :plain="true" type="warn" size="mini">删除</button>
			</view>
		</view>
		<view class="not" v-if="favoriteList.length==0">
			空空如也,快去收藏喜欢的课程吧
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				favoriteList:[],
				isChecked:[],		//每一项的单选框是否选中
				allChecked:false,	//全选按钮选中状态
				fid:[],
				cid:[],
			};
		},
		onLoad(){
			this.fList()
		},
		onShow(){
			this.fList()
		},
		onPullDownRefresh() {
		    this.fList()
		},
		methods:{
			//删除收藏
			del(){
				for(let i=0;i<this.isChecked.length;i++){
					if(!this.isChecked[i].is){
						this.fid.push(this.favoriteList[i].fid)
						this.cid.push(this.favoriteList[i].cid)
					}
				}
				if(this.fid.length==0){
					uni.showToast({
						title:'您还没有选择课程',
						icon:'none',
						duration:2000
					})
					return
				}
				uni.request({
					method:"POST",
					url:this.$global.favoriteDelList(),
					data:{
						fid:this.fid
					},
					withCredentials:true,
					success: (res) => {
						if(res.data.code==200){
							uni.showToast({
								title:'删除成功',
								icon:'none',
								duration:2000,
							})
							this.fList()
						}else{
							uni.showToast({
								title:'删除失败',
								icon:'none',
								duration:2000,
							})
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			//单选
			radio(i,num){
				this.isChecked[i].is=!this.isChecked[i].is
				if(num==-1){
					this.allChecked=false
				}
				if(num==1){
					for(let i=0;i<this.isChecked.length;i++){
						if(this.isChecked[i].is){
							return
						}
					}
					this.allChecked=true
				}
			},
			//全选
			allRadio(num){
				this.allChecked=!this.allChecked
				if(this.allChecked){
					for(let i=0;i<this.isChecked.length;i++){
						this.isChecked[i].is=false
					}
				}else{
					for(let i=0;i<this.isChecked.length;i++){
						this.isChecked[i].is=true
					}
				}
			},
			//加载收藏夹列表
			fList(){
				uni.request({
					url:this.$global.favoriteList(),
					withCredentials:true,
					success:(res)=>{
						if(res.data.code==409){
							this.$global.toLogin()
							return
						}
						this.favoriteList=res.data
						uni.stopPullDownRefresh()
						//为每一项数据添加单选框选择状态，默认未选中
						if(this.isChecked.length!=this.favoriteList.length){
							this.isChecked=[]
							for(let i=0;i<this.favoriteList.length;i++){
							this.isChecked.push({is:true})
						}
					 }
					},
					fail:(err)=>{
						console.log(err)
					}
				})
			},
			//跳转课程详情
			toDetail(cid){
				uni.navigateTo({
				    url: '../../pages/courseDetail/courseDetail?cid='+cid
				});
			}
		}
	}
</script>

<style lang="scss">
$subtitle-font-size:30rpx;
	.content {
		padding: 15rpx;
		padding-bottom: 150rpx;
		.list{
			padding: 0;
			.list_row{
				display: flex;
				align-items: center;
				.radio{
					transform: scale(0.8);
				}
			.item{
				display: flex;
				align-items: center;
				width: 90%;
				justify-content: space-between;
				.pic{
					flex: 1;
					height: 150rpx;
					margin-right: 15rpx;
				}
				.item_title{
					width: 45%;
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
		.nav{
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
			.left{
				display: flex;
				align-items: center;
				.radio{
					display:flex;
					align-items: center;
					transform: scale(0.8);
					margin-left: 20rpx;
					font-size: 32rpx;
					color: #666;
				}
			}
			.right{
				display: flex;
				align-items: center;
				margin-right: 30rpx;
				font-size: 34rpx;
				text{
					color: $theme-color-sub;
					font-size: 32rpx;
				}
				button{
					font-size: 32rpx;
					border-radius: 50rpx;
					height: 65rpx;
					padding:0;
					text-align: center;
					width: 130rpx;
					line-height: 60rpx;
				}
				.cart{
					width: 200rpx;
					margin-left: 20rpx;
					background-color: #ffa200;
				}
			}
		}
		.not{
			text-align: center;
			color: #999999;
			margin-top: 100rpx;
		}
	}
</style>
