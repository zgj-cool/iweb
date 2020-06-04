<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	*{
		box-sizing: border-box;
	}
	.hr{
		height: 0;
		width: 100%;
		border-bottom: 1px solid #cdcdcd;
	}
</style>
