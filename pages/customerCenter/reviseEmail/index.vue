<template>
	<div id="reviseEmail" class="commonWrap">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap">
		    	<headerComponents :title="title" :isBack="true"></headerComponents>
				<!--邮箱认证-->
               	<div class="emailAuthen">
                 	<!-- 步骤追踪start -->
                   <div class="search_R">
                    <div class="border_one">
                      <div class="border_oneL">
                        <span>1</span>
                        <span>验证身份</span>
                      </div>
                      <div class="border_oneR">
                        <span class="secondStep">2</span>
                        <span class="secondStepWord">修改邮箱</span>
                      </div>
                    </div>
                    <div class="border_three">
                      <div class="border_oneR">
                        <span class="thirdStep">√</span>
                        <span class="thirdStepWord">完成</span>
                      </div>
                    </div>
                  </div>
                  <!-- 步骤追踪end -->
                  <!-- 第一步start -->
                  <div>
                    <div class="emailAuthen_T">
                      <span>验证手机</span><span>通过已验证手机号验证。</span>
                    </div>
                    <div class="emailAuthen_C">
                      <span>原手机号：</span>
                      <span>
                        <input type="text" placeholder="请输入新手机号码" ref="telphone" :value="Ellipsis" disabled style="background:rgba(245, 245, 245, 1)">
                      </span>
                      <span>验&nbsp;证&nbsp;码：</span>
                      <span><input type="text" autocomplete="off" placeholder="请输入验证码" class="yzCode" v-model="telCode"></span>
                      <span @click="getOldCode" v-if="isGet" class="firstGetCode countdown">获取验证码</span>
                      <span v-else  class="firstGetCode">{{time}}s</span>
                      <button @click="emailNext">下一步</button>
                    </div>
                  </div>
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
	import tool from "~/assets/lib/tool.js";
	//验证码倒计时
	let verifiTime = null;
	export default{
		data(){
			return{
				Ellipsis: "", //替换手机号中间4位数为*
				telCode: "", //原手机号验证码
				isGet: true, //第一次是否获取验证码
				title:"邮箱认证",
				oldTel: "", //原手机号
				time: 60, //倒计时时间
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
	            this.oldTel = res.data.Mobile;
	            this.Ellipsis = this.oldTel.substr(0, 3) + "****" + this.oldTel.substr(7);
	        })
	  		.catch((error)=>{
	            // console.log("账户设置错误");
	       	})
	  	},
		methods:{
			getOldCode() {
		      	verifiTime = null;
		      	this.isGet = false;
		      
		      	//获取原手机号的验证码
		      	let params = {
		        	mobile: this.oldTel
		      	};
		       	getData.getVerification(params)
		       	.then((res)=>{
		         	//console.log("获取原手机号的验证码",res);
		       	})
		      	//倒计时60s
		      	verifiTime = setInterval(() => {
		        	if (this.time == 1) {
		          		this.time = 60;
		          		clearInterval(verifiTime);
		          		this.isGet = true;
		        	} else {
		          		this.time--;
		        	}
		      	}, 1000);
		    },
		    emailNext() {
		      //验证邮箱第一步
		      // 验证验证码
		      var status = tool.regularJudgement("noteCode", this.telCode);
		      if (status) {
		        // 变更邮箱认证第一步
		        var param = {
		          params: {
		            type: 1,
		            verifyCode: this.telCode
		          }
		        };
		        getData.changeTelOrMail(param)
		        .then(res => {
		        	if(this.$route.query.type == 1){
		        		this.$router.push({path:'/customerCenter/reviseEmail/secondSteps',query:{id:res.data.Id,type:1}})
		        	}else{
		        		this.$router.push({path:'/customerCenter/reviseEmail/secondSteps',query:{id:res.data.Id}})
		        	}
		            
		          },
		          err => {
		            if (err.data.msg) {
		              this.$message.error(err.data.msg);
		              return;
		            }
		          }
		        );
		      } else {
		        this.$message.error("验证码错误!!");
		      }
				
		    },
		},
		beforeDestroy(){
			clearInterval(verifiTime);
		}
	}
</script>

<style type="stylesheet/css"  lang="less" scoped>
	@import "~assets/less/customerCenter/reviseEmail.less";
</style>