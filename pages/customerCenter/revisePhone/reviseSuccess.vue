<template>
	<div id="reviseSuccess" class="commonWrap">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap">
		    	<headerComponents :title="title" :isBack="false"></headerComponents>
				<!-- 第三步 -->
				  <div class="tel_last changeMobile">
				      <div class="changeMobile_T">
				          <span>修改绑定的手机号</span><span>修改后，原手机号将不能用于登录。您可以使用更换后的手机号进行登录。</span>
				      </div>
				      <div>
				        <img src="~assets/images/revisePhone/payment_icon.png" class="tel_success">
				        <span class="successWord">修改成功！</span>
				      </div>
				      <div class="toPage">还有<span style="color:#df3d3e;">&nbsp {{success_time}} &nbsp</span>秒页面将自动<span style="color:#359af8;cursor: pointer;" @click="toPage">&nbsp跳转&nbsp</span></div>
				  </div>
			</div>
		</div>
	</div>

</template>

<script>
	import leftNav from '~/components/leftNav.vue';
	import topBanner from '~/components/topBanner.vue';
	import getData from "~/store/ajaxAPI/getData";
	import headerComponents from '~/components/header.vue';
	import { mapState,mapActions,mapGetters} from 'vuex';
	import tool from "~/assets/lib/tool";

	//验证码倒计时
	let verifiTime = null;
	export default{
		data(){
			return{
				success_time: 10, //手机号修改成功后的倒计时
				title:"修改手机号",
			}
		},
	  	components: {
	    	leftNav,
    		topBanner,
    		headerComponents
	  	},
	  	mounted(){

	  		verifiTime = setInterval(() => {
                if (this.success_time == 1) {
                  	this.login();
                } else {
                  this.success_time--;
                }
            }, 1000);
	  	},
		methods:{
			...mapActions({
				"loginDVisible":"loginDVisible",
			}),
			toPage() {
		      	//更换手机号成功后点击跳转
				// 静默登录
                  this.login();
		    },
		    //静默登录
		    login(){
		    	clearInterval(verifiTime);

		    	let pwd = tool.loadFromLocal('CustomerMesg','ALL').Password;
              	let mobile = tool.loadFromLocal('tel','tel','tel',false);
	          	let params = {
					LoginName: mobile,
					Password:pwd,
					isBackLogin:true
				}
	          	// 静默登录
	          	getData.login(params)
	          	.then((res)=>{
	          		this.loginDVisible(res);//存入vuex  保存本地

	          		this.$router.push('/customerCenter');
	          	})
	          	.catch((error)=>{
	          		// console.log(error)
	          	})
		    }
		},
		beforeDestroy(){
			clearInterval(verifiTime);
			tool.removeLocal('tel');
		}
	}
</script>

<style type="stylesheet/css"  lang="less" scoped>
	@import "~assets/less/customerCenter/revisePhone.less";
</style>
