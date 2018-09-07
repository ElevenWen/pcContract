<template>
	<div id="revisePwd" class="commonWrap">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap">
		    	<headerComponents :title="title" :isBack="true"></headerComponents>
				<!--修改密码-->
                <div class="changePsd">
                   	<div class="changePsd_T">
                    	<span>登录密码</span><span>建议密码由8位以上数字、字母和特殊字符组成，并定期修改</span>
                  	</div>
                  	<div class="changePsd_C">
                      <span>手机号码：</span>
                      <span>
                        <input type="text" placeholder="请输入新手机号码" ref="telphone" :value="Ellipsis" disabled style="background:rgba(245, 245, 245, 1)">
                      </span>
                      <span>验&nbsp;证&nbsp;码：</span>
                      <span><input type="text" autocomplete="off" placeholder="请输入验证码" class="yzCode" v-model="telCode"></span>
                      <span @click="getOldCode" v-if="isGet"  class="firstGetCode countdown">获取验证码</span>
                      <span v-else  class="firstGetCode">{{time}}s</span>
                      <span class="newPsd">新&nbsp;密&nbsp;码：</span>
                      <span class="newInput">
                        <input type="password"autocomplete="new-password" placeholder="请输入新密码" class="newPsdIpt" v-model="newPsd">
                      </span>
                      <span class="confirmPsd">确认密码：</span>
                      <span>
                        <input type="password" autocomplete="new-password" placeholder="请再次输入新密码" class="againNewPsd" ref="confirmNewPsd" v-model="againPsd">
                      </span>
                      <button @click="updataPsd">修改</button>
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
	import tool from "~/assets/lib/tool";
	import CryptoJS from "crypto-js";
	import { mapState,mapActions,mapGetters} from 'vuex';

	//验证码倒计时
	let verifiTime = null;
	export default{
		data(){
			return{
				Ellipsis: "", //替换手机号中间4位数为*
				telCode: "", //原手机号验证码
				isGet: true, //第一次是否获取验证码
				isGetTwo: true, //第二次是否获取验证码
				newPsd: "", //新密码
				againPsd: "",//再次输入密码
				time: 60, //倒计时时间
				oldTel: "", //原手机号
				title:"修改登录密码"
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
			...mapActions({
				"loginDVisible":"loginDVisible",
			}),
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
		    updataPsd() {
		      	//修改密码
				// 验证验证码
			    let status = tool.regularJudgement("noteCode", this.telCode);
			    if (status) {
			        if (this.newPsd.length >= 6) {
				        if (this.newPsd == this.againPsd) {
				          let passwordEncrypt = CryptoJS.AES.encrypt(this.newPsd, "59964e5d540e446cf98bc2af78a2ea58"); //密码加密
				          let param = {
				            params: {
				              newPwd: encodeURI(passwordEncrypt.toString()),
				              verifyCode: this.telCode,
				              datatype: "json",
				              openSSL: true
				            }
				          };
				          getData.changePsd(param)
				          .then(res => {
				              //console.log("修改密码",res);
				              // 静默登录
				              this.login(passwordEncrypt);
				            },
				            error => {
				              // console.log(error)
				              if (error.data.success == false) {
				                this.$message.error(error.data.msg);
				                return;
				              }
				            }
				          );
				        } else {
				          this.$message.error("密码输入不一致");
				        }
				    } else {
				        this.$message.error("密码最少需要6位数");
				    }
			    } else {
			        this.$message.error("验证码错误");
			    }
			    
		    },
		    //静默登录
		    login(passwordEncrypt){
		    	clearInterval(verifiTime);
              	let mobile = tool.loadFromLocal('CustomerMesg','ALL').Mobile;
	          	let params = {
					LoginName: mobile,
					Password:encodeURI(passwordEncrypt.toString()),
					openSSL:true
				}
	          	// 静默登录
	          	getData.login(params)
	          	.then((res)=>{
	          		this.loginDVisible(res);//存入vuex  保存本地
					this.$message({
					  	message: '新密码用于微企宝平台的登录',
					  	type: 'success'
					});
	          		this.$router.push('/customerCenter');
	          	})
	          	.catch((error)=>{
	          		// console.log(error)
	          	})
		    }
		},
		beforeDestroy(){
			clearInterval(verifiTime);
		}
	}
</script>

<style type="stylesheet/css"  lang="less" scoped>
.ContensWrap{
    background: #fff;
    height: inherit;
    h3{
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        font-weight: bold;
        color: #000;
        padding-left: 19px;
        border-bottom: 1px solid #eee;
    }
}
	/*修改密码*/
    .changePsd{
        padding: 20px 30px;
        .changePsd_T{
            span:nth-child(1){
                color: #4d4d4d;
                font-size: 16px;
                padding-right: 15px;
            }
            span:nth-child(2){
                color: #8c8c8c;
                font-size: 12px;
            }
        }
        .changePsd_C{
            width: 475px;
            height: 168px;
            margin: 30px 0 0 40px;
            .newTel{
                width: 150px;
            }
            span:nth-child(1),
            span:nth-child(3){
                width: 76px;
                line-height: 40px;
            }
            span:nth-child(2){
                float: none;
            }
            .newPsd{
                line-height: 40px;
            }
            .newInput{
                margin: 0 100px 20px 9px;
            }
            .firstGetCode,.secondGetCode{
                border: 1px solid #ccc;
                width: 100px;
                float: right;
                cursor: pointer;
                background: #e6e6e6;
                margin-right: 138px;
                line-height: 40px;
                text-align: center;
            }
            .countdown{
            	color: #089fff;
            }
            .confirmPsd{
                width: 75px;
            }
            span{
                display: block;
                float: left;
                color: #4d4d4d;
                margin-bottom: 20px;
                height: 40px;
                line-height: 40px;
                input{
                    width:260px;
                    height: 40px;
                    padding-left: 5px;
                    border: 1px solid #ccc;
                }
                .yzCode{
                    width: 150px;
                }
                .pasInput{
                    width: 280px;
                }
                label{
                    font-size: 12px;
                    padding-left: 15px;
                    color: #ff3e08;
                    img{
                        vertical-align: sub;
                    }
                }
            }
            button{
                width: 260px;
                height: 38px;
                border-radius: 4px;
                margin: 10px 20px 0 75px;
                color: #FFF;
                background: #ff3e08;
            }
        }
    }
</style>
