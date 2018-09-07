<template>
	<div id="personalCertification" class="commonWrap signature">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap">
		    	<headerComponents :website="website+'?type='+webParam" :title="title" :isBack="true"></headerComponents>
		    	<div class="perCertified">
			    	<div class="telWrap">
		                <span class="telWord"><i class="red">*</i>真实姓名：</span>
		                <input type="text" placeholder="请输入姓名" v-model="idcardInfo.name" @blur="checkName">
		            </div>
		            <div class="telWrap">
		                <span class="telWord"><i class="red">*</i>身份证号码：</span>
		                <input type="text" placeholder="请输入身份证号" v-model="idcardInfo.code" @blur="checkIdcardNum">
		            </div>
		            <div class="businessWrap">
		                <span class="telWord"><i class="red">*</i>身份证正面：</span>
		                <div class="uploadIDWrap">
		                    <input @mouseenter="toShowImg(0)" @mouseleave="toHiddenImg(0)" type="file" class="uploadIdcardP" @change="uploadIdcard" id="upIdcardFace" accept="image/jpg,image/png,image/gif,image/jpeg">
		                    <div class="idcardUp">
		                        <img v-show="idcardInfo.Img" :src="idcardInfo.Img" alt="">
		                        <span v-if="!idcardInfo.Img">点击上传</span>
		                        <div  v-show="isShowChange==0" class="changeImg" @click="uploadIdcard">更换照片</div>
		                    </div>
		                    <div class="des" style="cursor: default;">
		                        <img src="~assets/images/signature/idcardZ.png" alt="">
		                    </div>
		                </div>
		                <div class="desWord">请上传本人身份证正面头部照片，必须看清证件信息，且证件信息不能被遮挡<br/>仅支持jpg、png、gif的图片格式，图片大小不超过10M，您提供的照片微企宝将予以保护，不会用于其他用途</div>
		            </div>
		            <div class="businessWrap">
		                <span class="telWord"><i class="red">*</i>身份证反面：</span>
		                <div class="uploadIDWrap">
		                    <input @mouseenter="toShowImg(1)" @mouseleave="toHiddenImg(1)" type="file" class="uploadIdcardBackP" @change="uploadIdcardBack" id="upIdcardBack" accept="image/jpg,image/png,image/gif,image/jpeg">
		                    <div class="idcardUp">
		                        <img v-show="idcardBack.Img" :src="idcardBack.Img" alt="">
		                        <span v-if="!idcardBack.Img">点击上传</span>
		                        <div v-show="isShowChange==1" class="changeImg" @click="uploadIdcardBack">更换照片</div>
		                    </div>
		                    <div class="des" style="cursor: default;">
		                        <img src="~assets/images/signature/idcardBack.png" alt="">
		                    </div>
		                </div>
		                <div class="desWord">请上传本人身份证背面头部照片，必须看清证件信息，且证件信息不能被遮挡<br/>仅支持jpg、png、gif的图片格式，图片大小不超过10M，您提供的照片微企宝将予以保护，不会用于其他用途</div>
		            </div>
		            <div class="apply" @click="personfirmApply">提交签章</div>
		        </div>
		    </div>
		</div>
		
		<!-- 提交认证信息弹出框 -->
        <div class="messageBox" v-if="isShowWindows">
            <div class="tipsWrap">
                <div class="tipsTitWrap">
                    <span>提交成功</span>
                    <img src="~assets/images/signature/close.png" class="close" @click="toContract()">
                </div>
                <div class="tipsContent">
                    <i class="successImg"></i>
                    <span class="content">信息提交成功，我们将在1-2个工作<br/>日反馈审核结果，审核通过之后，系<br/>统自动帮你生产电子签章</span>
                    <span class="toOther">{{toContractTimer}}s后自动返回到  <i @click="toContract">我的签章</i></span>
                </div>
            </div>
        </div>
        
        <!--公司示意弹窗-->
        <div class="updatedImg_des" v-show="updatedImg_des">
	        <div class="contentWrap">
	            <div class="close1" @click="updatedImg_des = !updatedImg_des"><img src="~assets/images/signature/close1.png" alt=""></div>
	            <div class="des">
	            <div><img src="~assets/images/signature/license_bg.png" alt=""></div>
	            <div class="desText">
	                <ul>
	                <li><span class="line"></span><span class="num">1</span> <span class="text">请上传工商营业执照，图片要求四角对齐， 如有模糊、太暗、有遮挡，则不予认证。</span></li>
	                <li><span class="line"></span><span class="num">2</span> <span class="text">只支持中国大陆工商局或市场监督管理局 颁发的工商营业执照，且必须在有效期内。</span></li>
	                </ul>
	            </div>
	            </div>
	        </div>
        </div>
        
        <div class="loadingCircle" v-show="isShowLoading">
        	<div id="signLoading"></div>
        </div>
	</div>
</template>

<script>
	import leftNav from '~/components/leftNav.vue';
	import topBanner from '~/components/topBanner.vue';
	import headerComponents from '~/components/header.vue';
	import getData from "~/store/ajaxAPI/getData";
	import tool from "~/assets/lib/tool";
	
	var windowsTimer = null;
	export default {
		data(){
			return{
				idcardInfo:{ //身份证正面信息
	                name:"",
	                code:"",
	                Img:"",
	            },
	            idcardBack:{ //身份证反面信息
	                Img:'',
	            },
	            isShowWindows:false, //是否显示弹窗
	            toContractTimer:10, //提交认证信息弹出框倒计时
	            updatedImg_des:false, //营业执照示意弹窗
	            title:"个人实名认证",
	            id:"",//用户id
	            signId:"",//签章id
	            isShowLoading:false,//是否显示loading
	            isShowChange:-1,//控制更换图片显示
	            website:'/customerCenter/signature',
	            webParam:'',//返回需要添加的参数
			}
		},
	  	components: {
	    	leftNav,
    		topBanner,
    		headerComponents
	  	},
	  	mounted(){
	  		this.id = tool.loadFromLocal("CustomerMesg", "ALL").Id;
	  		this.webParam = this.$route.query.type;
	  		// 调用公司列表接口
	        getData.mycompanyList()
	        .then((res) => {
	            this.companyList = res.data;
	        })
	        .catch((error)=>{
	        	
	        })
	        
	        
	        //判断是否是修改需要填充数据
	        let id = this.$route.query.id;
	        if(id){
	        	let params = {
	                id: id,
	                datatype:"json"
	            }
	            getData.getSignById(params)
	            .then((res) =>{
					this.idcardInfo.name = res.data.TrueName;
	                this.idcardInfo.code = res.data.IdCardNumber;
	                this.idcardInfo.Img =  res.data.IdCardPositive;
	                this.idcardBack.Img = res.data.IdCardOpposite;
	                this.signId = res.data.Id;
	            })
	        }
	  	},
	  	methods:{
	  		checkName(){ //验证姓名
	  			if(this.idcardInfo.name){
	  				var _checkName = tool.regularJudgement("person",this.idcardInfo.name);
		            if(!_checkName){
		                this.$message.error("姓名错误！！");
		                return;
		            }
		            return _checkName;
	  			}
	        },
	        checkIdcardNum(){ //验证身份证号
	        	if(this.idcardInfo.code){
	        		var _checkIdcardNum = tool.IdentityCodeValid(this.idcardInfo.code);
		            if(!_checkIdcardNum.flag){
		                this.$message.error(_checkIdcardNum.message);
		            }
		
		            return _checkIdcardNum;
	        	}
	            
	
	        },
	        uploadIdcard(){ //识别身份证正面
	            var idcard = this.idcardInfo;
	            tool.uploadIdcard("#upIdcardFace",1,idcard,this)
	            
	        },
	        uploadIdcardBack(){ //识别身份证反面
	            var _idcardBack = this.idcardBack;
	            tool.uploadIdcard("#upIdcardBack",2,_idcardBack,this);
	        },
	        personfirmApply(){ //个人提交申请
	            // 验证
	            if(this.checkName() && this.checkIdcardNum().flag){
	                if (this.idcardInfo.Img && this.idcardBack.Img) {
	                	var perParams = {
		                    CustomerId:this.id,
	                		SignId:this.signId,
	                		CompanyName: "",
		                    SocialCreditCode: "",
		                    BusinessLicensePic: "",
		                    TrueName: this.idcardInfo.name,
		                    IdCardNumber: this.idcardInfo.code,
		                    IdCardPositive: this.idcardInfo.Img,
		                    IdCardOpposite: this.idcardBack.Img,
		                    Type:0,
		                    datatype:"json"
		                }
		                // 调取 个人签章-实名认证 接口
		                getData.realNameCertification(perParams)
		                .then((res) => {
			                if(this.companyList.length > 5){
			                    this.$message.error("不能超过5个公司喔！");
			                }else{
			                    this.isShowWindows = true;
			                    
			                    this.idcardInfo.name = "";
				                this.idcardInfo.code = "";
				                this.idcardInfo.Img = "";
				                this.idcardBack.Img ="";
				                this.code = "";
			                    
			                    clearInterval(windowsTimer);
			                    windowsTimer = setInterval(() => {
			                        this.toContractTimer--;
			                        if(this.toContractTimer <= 0){
			                        	clearInterval(windowsTimer);
			                        	this.isShowWindows = false;
			                        	tool.removeLocal("idcardInfo");
			                        	this.$router.push('/customerCenter/signature');
			                        }
			                    },1000)
			                }
			
			            })
		                .catch((err) => {
			                if(err.data.success == false){
			                    this.$message.error(err.data.msg);
			                }
			            })
	                }else{
		                this.$message.error("请填写完整的正确信息！！");
		                return;
		            }
	            }
	        },
	        toContract(){ //跳转到电子合同
	        	this.isShowWindows = false;
	            this.$router.push('/customerCenter/signature');
	        },
	        toHiddenImg(){
	        	this.isShowChange = -1;
	        },
	        toShowImg(num){
	        	switch (num){
	        		case 0:
	        			if (this.idcardInfo.Img) {
			        		this.isShowChange = num;
			        	}
	        			break;
	        		case 1:
	        			if (this.idcardBack.Img) {
			        		this.isShowChange = num;
			        	}
	        			break;
	        		default:
	        			break;
	        	}
	        }
	  	},
		beforeDestroy(){
			clearInterval(windowsTimer);
			tool.removeLocal("idcardInfo");
		}
	}
</script>

<style type="stylesheet/css"  lang="less" scoped>
  @import "~assets/less/customerCenter/signature.less";
</style>