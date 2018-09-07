<template>
	<div id="signature" class="commonWrap signature">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap">
		    	<header>
		    		<h3>我的签章</h3>
		    		<button type="button" class="appendSign" @click="chooseSign">添加签章</button>
		    	</header>

		    	<el-tabs v-model="activeName2" type="card" @tab-click="handleTableClick">
				    <el-tab-pane label="可用签章" name="first">
				    	<div class="comSinger" v-for="(items,index) in singListArr">
	                        <div class="comSing" ref="comSing">
	                        	<!--1为公司-->
	                            <img src="~assets/images/signature/comConBac.png" class="img" v-if="items.Type == 1 ">
	                            <!--0为个人-->
	                            <img src="~assets/images/signature/personConBac.png" class="img" v-if="items.Type == 0">

	                            <img v-if="items.Type == 1 " src="~assets/images/signature/comSign.png" class="sign">
	                            <div class="comName" v-if="items.Type == 1 ">{{items.CompanyName}}</div>
	                            <div class="comName perName" v-if="items.Type == 0">{{items.TrueName}}</div>
	                        </div>
	                        <div>
	                            <div class="resetC">
	                                <span class="wordRing" v-if="items.Type == 1 ">企业</span>
	                                <span class="wordRing personal" v-if="items.Type == 0 ">个人</span>
	                                <span @click="modifySign(items.Id,items.Type)" class="nodify" v-if="items.Type == 1 ">修改</span>
	                            </div>
	                        </div>
		                </div>

		                <!--无数据-->
		                <div class="metadata" v-if="singListArr.length ==0">
				    		<img src="~assets/images/nodataShow.png"/>
				    		<p>您还没有可用签章哦~</p>
				    		<button type="button" @click="chooseSign">马上添加签章</button>
				    	</div>
				    </el-tab-pane>
				    <el-tab-pane label="审核中" name="second">
				    	<div class="comSinger" v-for="(items,index) in singListVerifyArr">
	                        <div class="comSing" ref="comSing">
	                        	<!--1为公司-->
	                            <img src="~assets/images/signature/comConBac.png" class="img" v-if="items.Type == 1 ">
	                            <!--0为个人-->
	                            <img src="~assets/images/signature/personConBac.png" class="img" v-if="items.Type == 0">

	                            <img v-if="items.Type == 1 " src="~assets/images/signature/comSign.png" class="sign">
	                            <div class="comName" v-if="items.Type == 1 ">{{items.CompanyName}}</div>
	                            <div class="comName perName" v-if="items.Type == 0">{{items.TrueName}}</div>
	                        </div>
	                        <div>
	                            <div class="resetC">
	                                <span class="wordRing" v-if="items.Type == 1 ">企业</span>
	                                <span class="wordRing personal" v-if="items.Type == 0 ">个人</span>
	                            </div>
	                        </div>
		                </div>

		                <!--无数据-->
		                <div class="metadata" v-if="singListVerifyArr.length ==0">
				    		<img src="~assets/images/nodataShow.png"/>
				    		<p>您没有审核中的签章哦~</p>
				    		<button type="button" @click="chooseSign">马上添加签章</button>
				    	</div>
				    </el-tab-pane>
				    <el-tab-pane label="已驳回" name="third">
				    	<div class="comSinger" v-for="(items,index) in singListRejectArr">
	                        <div class="comSing" ref="comSing">
	                        	<!--1为公司-->
	                            <img src="~assets/images/signature/comConBac.png" class="img" v-if="items.Type == 1 ">
	                            <!--0为个人-->
	                            <img src="~assets/images/signature/personConBac.png" class="img" v-if="items.Type == 0">

	                            <img v-if="items.Type == 1 " src="~assets/images/signature/comSign.png" class="sign">
	                            <div class="comName" v-if="items.Type == 1 ">{{items.CompanyName}}</div>
	                            <div class="comName perName" v-if="items.Type == 0">{{items.TrueName}}</div>
	                        </div>
	                        <div>
	                            <div class="resetC">
	                                <span class="wordRing" v-if="items.Type == 1 ">企业</span>
	                                <span class="wordRing personal" v-if="items.Type == 0 ">个人</span>
	                            	<span class="defailReason" @click="errorReason(items.ReviewFeedback,items.Id,items.Type)">失败原因</span>
	                            	<span class="interrogation" @click="errorReason(items.ReviewFeedback,items.Id,items.Type)"></span>
	                                <span class="nodify" @click="modifySign(items.Id,items.Type)">修改</span>
	                            </div>
	                        </div>
		                </div>

		                <!--无数据-->
		                <div class="metadata" v-if="singListRejectArr.length ==0">
				    		<img src="~assets/images/nodataShow.png"/>
				    		<p>您没有被驳回的签章哦~</p>
				    		<button type="button" @click="chooseSign">马上添加签章</button>
				    	</div>
				    </el-tab-pane>
				</el-tabs>

		    </div>
		</div>

		<!-- 签章失败原因弹窗框 -->
        <div class="errBoxWrap" v-if="isShowErrReason">
            <div class="tipsWrap">
                <div class="tipsTitWrap">
                    <span>失败原因</span>
                    <img src="~assets/images/signature/close.png" class="close" @click="closeErrWindows()">
                </div>
                <div class="tipsContent">
                    <div>
                        <i class="errorImg"></i>
                        <div class="errorrr">{{failReason}}</div>
                    </div>
                    <div class="errBtn">
                        <div @click="sure()" class="sure">去修改</div>
                        <div @click="cancel" class="cancel">取消</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 签章温馨提示弹窗框 -->
        <div class="errBoxWrap reminder" v-if="isShowWarning">
            <div class="tipsWrap">
                <div class="tipsTitWrap">
                    <span>温馨提示</span>
                    <img src="~assets/images/signature/close.png" class="close" @click="closeWindows()">
                </div>
                <div class="tipsContent">
                    <div>
                        <i class="errorImg"></i>
                        <div class="errorrr">一个账户最多只能添加1个个人签章和5个企业签章</div>
                    </div>
                    <div class="errBtn">
                        <div @click="closeWindows" class="sure">知道了</div>
                    </div>
                </div>
            </div>
        </div>
        <chooseSignature v-if="dialogVisible" :activeName2="activeName2" :SignNum="SignNum" :comSignNum="comSignNum" :dialogVisible="dialogVisible" @toClose = "toClose"></chooseSignature>
	</div>
</template>

<script>
	import leftNav from '~/components/leftNav.vue';
	import topBanner from '~/components/topBanner.vue';
	import chooseSignature from '~/components/customerManage/chooseSignature.vue';
	import getData from "~/store/ajaxAPI/getData";
	import tool from "~/assets/lib/tool";
	export default {
		data(){
			return{
				activeName2: 'first',
				singListArr:[], //可用签章列表
				singListVerifyArr:[], //审核中签章列表
				singListRejectArr:[], //驳回签章列表
				idcardInfo:{ //身份证正面信息
	                name:"",
	                code:"",
	                Img:"",
	            },
	            business:{ //营业执照信息
	                name:"",
	                code:"",
	                Img:'',
	            },
	            idcardBack:{ //身份证反面信息
	                Img:'',
	            },
	            isShowErrReason:false,//是否显示失败原因弹窗
	            failReason:"" ,//审核失败原因
	            dialogVisible:false,
	            signId:"",//签章id
	            type:"",//判断公司、个人类型
	            comSignNum:0,//企业签章数
	            SignNum:0,//个人签章数
	            isShowWarning:false,//显示提醒窗
			}
		},
	  	components: {
	    	leftNav,
    		topBanner,
    		chooseSignature
	  	},
	  	mounted(){
	  		if(this.$route.query.type){
	  			let type = this.$route.query.type;
	  			this.activeName2 = type;
	  			let params = {
	                    Type : '',
	                    State:1//可用
	                }
	  			switch (type){
	  				case 'first':
	  					this.requestData(params,1)
	  					break;
	  				case 'second':
	  					params.State = 0;
	  					this.requestData(params,0)
	  					break;
	  				case 'third':
	  					params.State = 2;
	  					this.requestData(params,2)
	  					break;
	  				default:
	  					break;
	  			}
	  			
	  		}else{
	  			let params = {
                    Type : '',
                    State:1//可用
                }
	  			this.requestData(params,1)
	  		}
	  		

	  		//判断是否有5个企业签章和一个个人签章
	  		let allParams = {
	  			Type : '',
                State:""
	  		}
	  		getData.signList(allParams)
	  		.then((res) => {
	  			res.data.forEach((val)=>{
	  				//个人
	  				if(val.Type == 0){
	  					this.SignNum += 1;
	  					return
	  				}else if(val.Type == 1){//企业
	  					this.comSignNum += 1;
	  				}
	  			})
	  		})
	  		.catch((error)=>{
	  			// console.log(error)
	  		})
	  		
	  	},
	  	methods:{
	  		//添加签章弹窗
	  		chooseSign(){
	  			if(this.SignNum <1 && this.comSignNum<5){
	  				this.dialogVisible = true;
	  			}else if(this.SignNum >= 1 &&  this.comSignNum<5){
	  				this.$router.push({path:'/customerCenter/signature/companyCertification',query:{type:this.activeName2}});
	  			}else if(this.SignNum < 1 &&  this.comSignNum>=5){
	  				this.$router.push({path:'/customerCenter/signature/personalCertification',query:{type:this.activeName2}})
	  			}else if(this.SignNum >= 1 &&  this.comSignNum>=5){
	  				this.isShowWarning = true;
	  			}
	  		},
	  		//弹窗子组件传值
		    toClose(val){
		    	this.dialogVisible = false;
		    },
	  		handleTableClick(tab, event){
	  			this.$router.push({path:'/customerCenter/signature',query:{type:tab.name}})
				switch (tab.name){
					case 'first':
						let param1 = {
		                    Type : '',
		                    State:1//可用
		                }
			  			this.requestData(param1,1)
						break;
					case 'second':
						let param2 = {
		                    Type : '',
		                    State:0//审核中
		                }
			  			this.requestData(param2,0)
						break;
					case 'third':
						let param3 = {
		                    Type : '',
		                    State:2//驳回
		                }
			  			this.requestData(param3,2)
						break;
					default:
						break;
				}
	  		},
	  		//请求签章列表
	  		requestData(val,num){
	  			//获取签章列表
		  		getData.signList(val)
		  		.then((res) => {
		  			//审核中
		  			if(num == 0){
		  				this.singListVerifyArr = res.data;
		  			}else if(num == 1){//可用
		  				this.singListArr = res.data;
		  			}else if(num == 2){//驳回
		  				this.singListRejectArr = res.data;
		  			}
		  		})
		  		.catch((error)=>{
		  			console.log(error)
		  		})
	  		},
	  		modifySign(id,type){ //修改企业签章
	  			this.signId = id;
	            this.type = type;
	            this.sure()
	        },
	        errorReason(val,id,type){ //失败原因
	            this.isShowErrReason = true;
	            this.failReason = val;
	            this.signId = id;
	            this.type = type;
	        },
	        closeErrWindows(){ //关闭失败原因窗口
	            this.isShowErrReason = false;
	        },
	        closeWindows(){
	        	//关闭温馨提示
	        	this.isShowWarning = false;
	        },
	        sure(){ //失败原因==确定
	        	if(this.type ==0){//个人
					this.$router.push({path:'/customerCenter/signature/personalCertification',query:{id:this.signId,type:this.activeName2}})
				}else if(this.type ==1){//企业
					this.$router.push({path:'/customerCenter/signature/companyCertification',query:{id:this.signId,type:this.activeName2}})
				}
	        },
	        cancel(){ //失败原因==取消
	            this.isShowErrReason = false;
	        },
	  	}
	}
</script>

<style type="stylesheet/css"  lang="less">
  @import "~assets/less/customerCenter/signature.less";
</style>
