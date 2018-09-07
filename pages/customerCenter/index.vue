<template>
	<div id="customerCenter" class="commonWrap">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap">
		    	<headerComponents :title="title" :isBack="false"></headerComponents>
                <div class="informationWrap">
       				<ul class="informationWrap-left">
       					<li>头像</li>
       					<li>昵称</li>
       					<li>密码</li>
       					<li>姓名</li>
       					<li>手机号</li>
       					<li>邮箱</li>
       					<li>微信</li>
       				</ul>
       				<ul class="informationWrap-right">
       					<li><img :src="headerImage" alt=""/></li>
       					<li>{{nickName}}</li>
       					<li>
       						******
       						<span @click="revisePhone(0)">修改</span>
       					</li>
       					<li>
       						<i v-if="userInfo.IsNameVerification == -1 || userInfo.IsNameVerification == 2" @click="revisePhone(3)">去认证</i>
       						<i v-if="userInfo.IsNameVerification == 0">审核中</i>
       						<strong v-if="userInfo.IsNameVerification == 1">{{Name}}</strong>
       					</li>
       					<li>
       						{{Ellipsis}}
       						<span @click="revisePhone(1)">修改</span>
       					</li>
       					<li>
       						<i v-if="!isEmailAuth" @click="revisePhone(2)">去绑定</i>
       						<strong v-if="isEmailAuth">{{email}}</strong>
       						<span @click="revisePhone(2)" v-if="isEmailAuth">修改</span>
       					</li>
       					<li><b>{{isWxAuth?'已绑定':'未绑定'}}</b></li>
       				</ul>
                </div>
		    </div>
		</div>
	</div>
</template>

<script>
	import leftNav from '~/components/leftNav.vue';
	import topBanner from '~/components/topBanner.vue';
	import headerComponents from '~/components/header.vue';
	import getData from "~/store/ajaxAPI/getData";
	import tool from "~/assets/lib/tool";
	export default {
		data(){
			return{
				headerImage:'',
				Ellipsis: "", //替换手机号中间4位数为*
				nickName:"",//昵称
				oldTel:'',//手机号
				title:"用户信息",
				isNameAuth:false,//姓名是否验证
				Name:"",//姓名
				isWxAuth:false,//微信是否绑定
				isEmailAuth:false,//邮箱是否验证
				email:'',//邮箱
				userInfo:{},//用户信息
			}
		},
	  	components: {
	    	leftNav,
    		topBanner,
    		headerComponents
	  	},
	  	mounted(){
	  		//获取手机号
	  		getData.getcustorInfor()
	  		.then( (res)=>{
//	            console.log(res)
				this.userInfo = res.data;
	            this.oldTel = res.data.Mobile;
	            
	            //先判断是否有微信头像
//	            if(res.data.WxHeadImgUrl){
//	            	this.headerImage = res.data.WxHeadImgUrl;
//	            }else{
	            this.headerImage = res.data.HeadPicPath ? res.data.HeadPicPath : '/customerCenter/headPortrait.png';
//	            }
	            //昵称
	            this.nickName = res.data.Nickname ? res.data.Nickname : "";
	            //手机号
	            this.Ellipsis = this.oldTel.substr(0, 3) + "****" + this.oldTel.substr(7);
	            
	            //姓名(1验证，0未验证)
	            if(res.data.IsNameVerification == 1){
	            	this.Name = res.data.RealName;
	            	this.isNameAuth = true;
	            }
	            
	            //微信(1绑定，0未绑定)
	            if(res.data.IsWechatVerification == 1){
	            	this.isWxAuth = true;
	            }
	            
	            //邮箱(1绑定，0未绑定)
	            if(res.data.IsEmailVerification == 1){
	            	this.isEmailAuth = true;
	            	this.email = res.data.Email;
	            }
	        })
	  		.catch((error)=>{
	            // console.log("账户设置错误");
	       	})
	  	},
	  	methods:{
	  		revisePhone(num){
	  			//修改密码
	  			if (num == 0) {
	  				this.$router.push('/customerCenter/revisePwd')
	  			} else if(num == 1){//修改手机号
	  				this.$router.push('/customerCenter/revisePhone')
	  			}else if(num == 2){//修改邮箱
	  				this.$router.push({path:'/customerCenter/reviseEmail',query:{type:1}})
	  			}else if(num == 3){//个人实名认证
	  				this.$router.push({path:'/customerCenter/signature/personalCertification',query:{id:this.userInfo.SignerId}})
	  			}
	  		}
	  	}
	}
</script>

<style type="stylesheet/css"  lang="less"  scoped>
  @import "~assets/less/customerCenter/customerCenter.less";
</style>