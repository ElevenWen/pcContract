<template>
	<div id="revisePhone" class="commonWrap">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap">
		    	<headerComponents :title="title" :isBack="true"></headerComponents>
				<!-- 第一步 -->
			    <div class="changeMobile">
			        <div class="changeMobile_T">
			          <span>修改绑定的手机号</span><span>修改后，原手机号将不能用于登录。您可以使用更换后的手机号进行登录。</span>
			        </div>
			        <div class="changeMobile_C">
			            <span>原手机号：</span>
			            <span>
			              <input type="text" placeholder="请输入新手机号码" ref="telphone" :value="Ellipsis" disabled style="background:rgba(245, 245, 245, 1)">
			              <label @click="toServer">原手机号无法验证？</label>
			            </span>
			            <span>验&nbsp;证&nbsp;码：</span>
			            <span><input type="text" autocomplete="off" placeholder="请输入验证码" class="yzCode" v-model="telCode"></span>
			            <span @click="getOldCode" v-if="isGet"  class="firstGetCode countdown">获取验证码</span>
			            <span v-else  class="firstGetCode">{{time}}s</span>
			            <button @click="nextTel">下一步</button>
			        </div>
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
	
	//验证码倒计时
	let verifiTime = null;
	export default{
		data(){
			return{
				telCode: "", //原手机号验证码
				time: 60, //倒计时时间
				oldTel: "", //原手机号
				isGet: true, //第一次是否获取验证码
				Ellipsis: "" ,//替换手机号中间4位数为*
				title:"修改手机号"
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
			toServer() {
		      //原手机号无法验证则跳转到人工客服
		    },
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
		    nextTel() {
		      	//修改手机号第一步
		      	// 验证验证码
		      	var status = tool.regularJudgement("noteCode", this.telCode);
		      	if (status) {
			        // 变更手机认证第一步
			        var param = {
			          params: {
			            type: 0,
			            verifyCode: this.telCode
			          }
			        };
			        getData.changeTelOrMail(param)
			        .then(res => {
			            //console.log("=====",res);
			            this.$router.push({path:'/customerCenter/revisePhone/newPhone',query:{id:res.data.Id}})
			        },err => {
			            if (err.data.msg == "验证码已过期，请重新获取") {
			              this.$message.error(err.data.msg);
			            }
			            else if (err.data.msg == "手机验证码输入错误，请重新输入") {
			              this.$message.error(err.data.msg);
			            }
			          }
			        );
			    } else {
			        this.$message.error("验证码错误！！");
			        return;
			    }
				
				
		    },
		},
		beforeDestroy(){
			clearInterval(verifiTime);
		}
	}
</script>

<style type="stylesheet/css"  lang="less" scoped>
	@import "~assets/less/customerCenter/revisePhone.less";
</style>