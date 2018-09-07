<template>
	<div id="secondSteps" class="commonWrap">
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
                  <!-- 第二步start -->
                  <div>
                    <div class="emailAuthen_T">
                      <span>修改邮箱</span><span>输入新邮箱进行认证修改</span>
                    </div>
                    <div class="secondMail">
                      <span>新&nbsp;邮&nbsp;箱：</span>
                      <span>
                        <input type="text" autocomplete="off" placeholder="请输入新的邮箱号" v-model="newEmail">
                      </span>
                      <button @click="newEmailNext" class="emailSendBtn">{{sendResult}}</button>
                    </div>
                  </div>
                  <!-- 第二步end -->
               </div>
			</div>
		</div>
		<!-- 邮箱发送成功后的模态窗口start -->
      <div class="emailBox" v-if="isShowEmail">
        <div class="box">
          <div class="title">温馨提示<span class="del" @click="closeDetail"></span></div>
          <div class="boxContent">信息已提交，请前往你的邮箱完成验证，</div>
          <div class="boxContent2">便于以后正常操作</div>
          <div class="boxBtn cursor" @click="toEmail">前往邮箱</div>
        </div>
      </div>
      <!-- 邮箱发送成功后的模态窗口end -->
	</div>
</template>

<script>
	import leftNav from '~/components/leftNav.vue';
	import topBanner from '~/components/topBanner.vue';
	import getData from "~/store/ajaxAPI/getData";
	import headerComponents from '~/components/header.vue';
	import tool from "~/assets/lib/tool.js";
	export default{
		data(){
			return{
				newEmail: "", //新邮箱号
				isShowEmail: false, //是否展示邮箱温馨提示模态窗口
				title:"邮箱认证",
				sendResult:"发送验证"
			}
		},
	  	components: {
	    	leftNav,
    		topBanner,
    		headerComponents
	  	},
		methods:{
			newEmailNext() {
		      //邮箱认证第二步
		      // 验证邮箱号
		      let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
		      let currentEmail = emailReg.test(this.newEmail);
		      if (currentEmail == true) {
		      	//修改按钮文字
		        this.sendResult = "发送中...";
		        
		        let param = {
		          params: {
		            Id: tool.loadFromLocal("CustomerMesg","ALL").Id,
		            Email: this.newEmail
		          }
		        };
		        getData.changeEmail(param)
		        .then(res => {
		          	//console.log("变更邮箱认证",res);
		          	//显示弹出框
		        	this.isShowEmail = true;
		          	this.sendResult = "已发送";
		        });
		      } else {
		        this.isShowEmail = false;
		        this.$message.error("邮箱错误!!");
		      }
		    },
		    closeDetail() {
		      this.isShowEmail = false;
		      if(this.$route.query.type == 1){
		      	this.$router.push('/customerCenter')
		      }else{
		      	this.$router.push('/')
		      }
		    },
		    toEmail() {
		      //前往邮箱
		      if (this.newEmail.indexOf("qq.com") > 0) {
		        window.open("https://mail.qq.com");
		      } else if (this.newEmail.indexOf("163.com") > 0) {
		        window.open("https://mail.163.com/");
		      } else if (this.newEmail.indexOf("126.com") > 0) {
		        window.open("https://mail.126.com/");
		      } else if (this.newEmail.indexOf("sina.com") > 0) {
		        window.open("https://mail.sina.com.cn/");
		      } else if (this.newEmail.indexOf("sohu.com") > 0) {
		        window.open("https://mail.sohu.com/fe/#/login");
		      }
		    }
		}
	}
</script>

<style type="stylesheet/css"  lang="less" scoped>
	@import "~assets/less/customerCenter/reviseEmail.less";
</style>