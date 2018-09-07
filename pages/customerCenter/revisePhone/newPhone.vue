<template>
	<div id="newPhone" class="commonWrap">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap">
		    	<headerComponents :title="title" :isBack="true"></headerComponents>
				<!-- 第二步 -->
	            <div class="changeMobile">
	                <div class="changeMobile_T">
	                    <span>修改绑定的手机号</span><span>修改后，原手机号将不能用于登录。您可以使用更换后的手机号进行登录。</span>
	                </div>
	                <div class="changeMobile_C secondTel">
	                    <span>新手机号：</span>
	                    <span>
	                        <input type="text" placeholder="请输入新手机号码" @blur="checkTel" ref="telphone" v-model="newTel" maxlength="11">
	                        <label v-if="currentTel == true"><img src="~/assets/images/revisePhone/err_tip.png"> 手机号码格式错误，请重新输入</label>
	                    </span>
	                    <span>验&nbsp;证&nbsp;码：</span>
	                    <span><input type="text" autocomplete="off" placeholder="请输入验证码" class="newTel" v-model="newCode"></span>
	                    <span class="secondGetCode" :class="newTel ? 'countdown' :''" @click="getNewCode" v-if="isGetTwo">获取验证码</span>
	                    <span v-else class="secondGetCode">{{time2}}s</span>
	                    <button @click="thirdTel">下一步</button>
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
				currentTel: false, //判断是否是正确的手机号码
				newTel: "", //新手机号
				newCode: "", //新手机号验证码
				isGetTwo: true, //第二次是否获取验证码
				title:"修改手机号",
				time2: 60,
			}
		},
	  	components: {
	    	leftNav,
    		topBanner,
    		headerComponents
	  	},
		methods:{
			checkTel() {
		      //核对手机号
		      var reg = /(^1[3-9][0-9]{9}$)/.test(this.newTel);
		      if (reg) {
		        this.currentTel = false;
		      } else {
		        this.currentTel = true;
		      }
		    },
		    getNewCode() {
		      //获取新手机号的验证码
		      verifiTime = null;
		      if (this.currentTel == false) {
		        this.isGetTwo = false;
		        var params = {
		          mobile: this.newTel
		        };
		         getData.getVerification(params)
		         .then((res)=>{
		           //console.log("获取新手机号的验证码",res);
		         })
		        //倒计时60s
		        verifiTime = setInterval(() => {
		          if (this.time2 == 1) {
		            this.time2 = 60;
		            clearInterval(verifiTime);
		            this.isGetTwo = true;
		          } else {
		            this.time2--;
		          }
		        }, 1000);
		      }
		    },
		    thirdTel() {
		      //更换手机号第二步
		      // 验证验证码
		      var status = tool.regularJudgement("noteCode", this.newCode);
		      if (status) {
		        var param = {
		          params: {
		            id: this.$route.query.id,
		            newMoblie: this.newTel,
		            verifyCode: this.newCode
		          }
		        };
		        getData.changeTel(param)
		        .then(res => {
		        	tool.saveToLocal('tel','tel','tel',this.newTel);
		              this.$router.push({path:'/customerCenter/revisePhone/reviseSuccess'})
		            },
		            error => {
		              //console.log("error000",error);
		              if (error.data.success == false) {
		                this.$message.error(error.data.msg);
		                return;
		              }
		            }
		          )
		          .catch(error => {});
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