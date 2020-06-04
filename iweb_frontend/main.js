import Vue from 'vue'
import App from './App'
import {globalData} from './globalData.js'
import G_show_modal from '@/components/G_show_modal/g_show_modal.js'


//全局设置
Vue.config.productionTip = false
//对Vue实例进行扩展
Vue.prototype.$global=globalData
Vue.use(G_show_modal)
//定义全局过滤器
Vue.filter('currency',(value)=>{
	if(value>=0){
		value=Number(value)
		return '￥'+value.toFixed(2)
	}
})
Vue.filter('imgUrl',(value)=>{
	if(value){
		return globalData.apiServer+value
	}
})
Vue.filter('cartCount',(value)=>{
	if(value>0){
		return '结算('+value+')'
	}else{
		return '结算'
	}
})
Vue.filter('imgSex',(value)=>{
	if(value=='男'){
		return '../../static/icon/sex1.png'
	}else if(value=='女'){
		return '../../static/icon/sex0.png'
	}else{
		return
	}
})
Vue.filter('time',(value)=>{
	Date.prototype.toLocaleString = function() {
	          return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
	    };
	if(value>0){
		var unixTimestamp = new Date(value*1);
		return unixTimestamp.toLocaleString();
	}
})

App.mpType = 'app'


const app = new Vue({
    ...App
})
app.$mount()
