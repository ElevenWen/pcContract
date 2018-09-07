<template>
    <div id="checkEmail" class="commonWrap">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap right_frame">
                <headerComponents :title="title" :isBack="false"></headerComponents>
                <!-- 认证成功 -->
                <div class="emailAuthen" v-if="isSuccess">
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
                    <div>
                        <img src="~assets/images/revisePhone/payment_icon.png" class="email_success">
                        <span class="emailWord">恭喜您，邮箱修改成功！</span>
                        <div class="email_grade_wrap">
                            <!-- <span class="email_grade">最新安全评级：</span>
                            <span class="grade" v-if="safeGrageWord == '低'">低</span>
                            <span class="grade" v-if="safeGrageWord == '中'">中</span>
                            <span class="grade" v-if="safeGrageWord == '高'">高</span>
                            <img src="../../assets/images/account-setting/N1.png" class="email_grade_img" v-if="safeGrage == 1">
                            <img src="../../assets/images/account-setting/N2.png" class="email_grade_img" v-if="safeGrage == 2">
                            <img src="../../assets/images/account-setting/N3.png" class="email_grade_img" v-if="safeGrage == 3"> -->
                        </div>
                        <div class="email_tips">您的账户安全还能提升哦，快去<span style="color:#ff3e08;cursor:pointer;" @click="toSafeCenter"> 安全中心 </span>完善其他安全设置提高评级吧！</div>
                    </div>
                </div>
                <!-- 认证失败 -->
                <div v-else-if="isSuccess == false">
                    <div class="errTitle">
                        <img src="~assets/images/revisePhone/err.png" alt="">
                        <span>糟糕，邮箱验证失败！</span>
                    </div>
                    <div class="errDetail">
                        <div>可能原因如下：</div>
                        <div>1.您的邮箱验证超时，请在24小时内进入邮箱点击认证；</div>
                        <div>2.您已点击过此链接，链接已失效；</div>
                        <div>3.您已生成新的认证链接；</div>
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
	import {websitePort} from "~/store/ajaxAPI/perPort.js"
	export default {
	  data() {
	    return {
	      isSuccess: true, //邮箱验证是否成功
	      title:"邮箱认证",
	    };
	  },
	  mounted() {
		  let _CustomerMesg = tool.loadFromLocal("CustomerMesg", "ALL");
		  let _id = this.$route.query.id || "";
		  // 判断是否登录（token）
		  if (_CustomerMesg && _CustomerMesg.Token) {

		    //判断是否有验证邮箱id
		    if (_id.length === 36) {
		      let params = {
		        params: {
		          id: _id
		        }
		      };
		      getData.checkEmail(params).then(res => {
//		        console.log("res", res);
		        if (res.success) {
		          this.isSuccess = true;
		        } else {
		          this.isSuccess = false;
		          this.$message.error(res.msg);
		        }
		      })
		      .catch(error => {
		        // console.log("验证邮箱id", error);
		        this.isSuccess = false;
		        let msg = error.data.msg;
		        if (msg.indexOf('对于“WQBEShop.Web.Controllers') < 0) {
		          this.$message.error(error.data.msg);
		        }
		      });
		    } else {
		      	this.isSuccess = false;
		      	this.$message.error('邮箱验证链接错误');
		    }
		  } else {
		  	//跳登录
		  	let url = encodeURIComponent(location.href)
		  	location.href = `${websitePort}/loginAndRegister/login?url=${url}`
		  }
	  },
	  components: {
	    leftNav,
	    topBanner,
	    headerComponents
	  },
	  methods: {
	    toSafeCenter() {
	      window.open("https://www.wqbol.com/account_setting/safeCenter")
	    }
	  }
	};
</script>

<style lang="less" scoped>
	@import "~assets/less/customerCenter/reviseEmail.less";
</style>
