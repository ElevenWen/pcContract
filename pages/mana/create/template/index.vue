<template>
  <div class="ContensWrap">
  	<header>
  		<span class="goBack" @click="toBack">返回</span>
  		<h1 class="head-title">创建合同</h1>
  		<button type="button" class="saveBtn" @click="saveEcontract">存草稿</button>
  		<button type="button" class="sendBtn" @click="sendEcontract">发送合同</button>
  	</header>
    
    <div class="content">
    	<!--内容顶部-->
    	<div class="content-head">
    		<div class="serialNumber">合同编号：{{templateInfo.TemplateNumber }}</div>
    		<div class="signName">合同名称：</div>
    		<input type="text" v-model="templateName" class="signEnter"/>
    		<div class="partiesNumber">缔约方数量：2</div>
    	</div>
    	
    	<!--内容主体-->
    	<div class="clause">
    		<div class="clause-left">合同条款：</div>
    		<div class="clause-right">
    			<!--模板内容-->
    			<div class="clause-content" ref="content">
    			</div>
    			
    			<!--签署人信息-->
    			<div class="mes">
    				<h3>签署人信息</h3>
    				<div class="firstParty">
    					<h4>甲方信息</h4>
    					<table class="firstParty-table" cellspacing="0">
    						<tbody>
	    						<tr class="first">
	    							<th>签署人姓名/企业名称</th>
	    							<th>手机号</th>
	    							<th>操作</th>
	    						</tr>
	    						
	    						<tr v-if="showFirstParty">
	    							<td>{{firstInf.name}}</td>
	    							<td>{{firstInf.phoneNumber}}</td>
	    							<td class="purge" @click="toClear">清除</td>
	    						</tr>
	    						
	    						<tr v-if="!showFirstParty">
	    							<td>
	    								<!--<div class="adjunctionBtn">添加<span class="triangular"></span></div>-->
	    								<el-dropdown trigger="click"  @command="checkAddTwoType">
                        <span class="el-dropdown-link">  
                          	添加<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :command="{num:0,type:1}">添加签署人</el-dropdown-item>
                          <el-dropdown-item divided :command='{num:0,type:2}'>从客户中添加</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
	    							</td>
	    							<td></td>
	    							<td></td>
	    						</tr>
	    						
	    					</tbody>
    					</table>
    				</div>
    				<div class="secondParty">
    					<h4>乙方信息</h4>
    					<table cellspacing="0" class="secondParty-table">
    						<tbody>
	    						<tr class="first">
	    							<th>签署人姓名/企业名称</th>
	    							<th>手机号</th>
	    							<th>操作</th>
	    						</tr>
	    						
	    						<tr v-if="showSecondParty">
	    							<td>{{secondInf.name}}</td>
	    							<td>{{secondInf.phoneNumber}}</td>
	    							<td class="purge" @click="toClearSecond">清除</td>
	    						</tr>
	    						
	    						<tr v-if="!showSecondParty">
	    							<td>
	    								<!--<div class="adjunctionBtn">添加<span class="triangular"></span></div>-->
	    								<el-dropdown trigger="click"  @command="checkAddTwoType">
                        <span class="el-dropdown-link">  
                          	添加<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :command="{num:1,type:1}">添加签署人</el-dropdown-item>
                          <el-dropdown-item divided  :command="{num:1,type:2}">从客户中添加</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
	    							</td>
	    							<td></td>
	    							<td></td>
	    						</tr>
	    					</tbody>
    					</table>
    				</div>
    				
    				<div class="btn">
    					<button type="button" class="sendingContract" @click="sendEcontract">发送合同</button>
    					<button type="button" class="saveContract" @click="saveEcontract">存草稿</button>
    				</div>
    			</div>
    		</div>
    	</div>
    </div>
    <!-- 弹窗集合 -->
    <addCompanyOrUser :dialogVisible="dialogVisible" @getAddData = "getAddData" @colseAddDialog="colseAddDialog"></addCompanyOrUser>
    <myUserDialog :dialogVisible="dialogVisible2"   @getSeacheData = "getSeacheData" @colseSeacheDialog="colseSeacheDialog"></myUserDialog>
  	<kindlyReminder v-show="showDialog" @toShow="toShow" @toClose = "toClose" :contractObj="contractObj"></kindlyReminder>
  	
  	<div class="loadingCircle" v-show="isShowLoading">
    	<div id="signLoading"></div>
    </div>
  </div>
</template>

<script>
	import addCompanyOrUser from '~/components/customerManage/addCompanyOrUser.vue';
	import myUserDialog from '~/components/customerManage/myUserDialog.vue';
	import kindlyReminder from '~/components/kindlyReminder.vue';
	import getData from "~/store/ajaxAPI/getData";
	import tool from "~/assets/lib/tool.js";
export default {
  layout: "ec",
  name: "mana-create-template",

  components: {
  	addCompanyOrUser,
    myUserDialog,
    kindlyReminder
  },
  head() {
    return {
      title: "创建合同 - 微企宝",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "创建合同"
        }
      ]
      
    };
  },
  data() {
    return {
    	dialogVisible: false, //添加弹窗
	  	dialogVisible2: false, //搜索弹窗
	  	showDialog:false,//展示温馨提示弹窗
	  	showFirstParty:false,//甲方添加显示
	  	showSecondParty:false,//乙方添加显示
	  	templateInfo:{},//模板详情数据
	  	templateName:"",//合同名称
	  	contractObj:{},//传给弹窗的信息
	  	num:0,//判断是甲方还是乙方（0：甲，1：乙）
	  	firstInf:{},//甲方信息
	  	secondInf:{},//乙方信息
      isSaveDraft:false,//是否存草稿
      isShowLoading:false,//是否显示loading
    };
  },
  mounted() {
  	this.$watch("$route",(n,o)=>{
  		this.requestData();
  		//初始化
  		this.toClear();
  		this.toClearSecond();
  	})
    this.requestData()
  },
  computed:{
  	//传递给后台的参数处理
  	assign(){
  		if(this.isSaveDraft){
  			this.contractObj.State = 0;
  		}else{
  			this.contractObj.State = 1;
  		}
  		//循环合同内容中的input
			let inputVal = this.$refs.content.getElementsByTagName("input");
			let arr = [];
			for (let i=0; i<inputVal.length;i++) {
				arr.push(inputVal[i].value)
			}
			let param = arr.join("|");
			this.contractObj.Id = tool.loadFromLocal("CustomerMesg","ALL").Id;
    	this.contractObj.Name = this.templateName;
    	this.contractObj.SignerAId = this.firstInf.id ? this.firstInf.id : '';
    	this.contractObj.SignerBId = this.secondInf.id ? this.secondInf.id : '';
    	this.contractObj.Type = 0;
    	this.contractObj.TemplateId = this.templateInfo.TemplateId  ? this.templateInfo.TemplateId : this.$route.query.id;
    	this.contractObj.ContractTemplateUrl = "";
    	this.contractObj.Param = param;
    	this.contractObj.SignerAPhone = this.firstInf.phoneNumber;
    	this.contractObj.SignerBPhone = this.secondInf.phoneNumber;
    	if(this.$route.query.type == 1){
    		this.contractObj.ContractId = this.templateInfo.Id;
    	}
	    return this.contractObj
  	}
  },
  methods: {
  	requestData(){
  		let id = this.$route.query.id;
	    let type = this.$route.query.type;
	    
	    //使用模板
	    if(type ==0 ){
	    	//获取合同详情
		    let params = {
		    	Id:id,
		    	CusId:tool.loadFromLocal("CustomerMesg","ALL").Id
		    }
		    getData.getContractTemplateInfo(params)
		    .then((res)=>{
		    	this.templateInfo = res.data;
		    	this.templateName = res.data.TemplateTitle;
		    	
		    	this.$refs.content.innerHTML = this.templateInfo.TermsContentHtml;
		    	
		    })
	    }else if(type ==1 ){//编辑合同
	    	//获取合同详情
		    let params = {
		    	Id:id,
		    	CustomerId:tool.loadFromLocal("CustomerMesg","ALL").Id
		    }
		    getData.getContractDetail(params)
		    .then((res)=>{
		    	this.templateInfo = res.data;
		    	
		    	//修改后台参数对应页面
		    	this.templateInfo.TemplateNumber = res.data.ContractNumber;
		    	this.templateName = res.data.Name;
		    	
		    	this.$refs.content.innerHTML = this.templateInfo.TermsContentHtml;
		    	
		    	this.$nextTick(()=>{
		    		//填充合同内容
		    		let str = res.data.Param;
			    	let reg = /\|/g
			    	let newStr = str.split(reg)
		    		//循环合同内容中的input
		    		let inputVal = this.$refs.content.getElementsByTagName("input");
		    		for (let i=0; i<inputVal.length;i++) {
		    			inputVal[i].value = newStr[i];
		    		}
		    	})
		    	//填充甲方信息
		    	this.firstInf.name = res.data.SignCusName1;
		    	this.firstInf.phoneNumber = res.data.SignCusMobile1;
		    	this.firstInf.id = res.data.SignerId1;
		    	if(res.data.SignCusName1){
		    		this.showFirstParty = true;
		    	}
      		
      		
      		//填充乙方信息
      		this.secondInf.name = res.data.SignCusName2;
		    	this.secondInf.phoneNumber = res.data.SignCusMobile2;
		    	this.secondInf.id = res.data.SignerId2;
		    	if(res.data.SignCusName2){
		    		this.showSecondParty = true;
		    	}
      		
		    })
	    }
  	},
  	toBack(){
  		this.$router.go(-1)
  	},
  	getAddData(data){
//    console.log('选择添加的信息显示：',data)
      data.name = data.CompanyName ? data.CompanyName : data.ContactName;
      data.phoneNumber = data.ContactMobile;
      data.id = data.Id;
      if (this.num == 0) {//甲方
      	this.firstInf = data;
      	this.showFirstParty = true;
      } else{//乙方
      	this.secondInf = data;
      	this.showSecondParty = true;
      }
    },
    getSeacheData(data){
//    console.log('检索信息：',data)
      //判断有无公司名字
      data.name = data.CompanyName ? data.CompanyName : data.ContactName;
      data.phoneNumber = data.ContactMobile;
      data.id = data.Id;
      if (this.num == 0) {//甲方
      	this.firstInf = data;
      	this.showFirstParty = true;
      } else{//乙方
      	this.secondInf = data;
      	this.showSecondParty = true;
      }
    },
    colseAddDialog(){
      this.dialogVisible = false;
    },
    colseSeacheDialog(){
      this.dialogVisible2 = false;
    },
    checkAddTwoType(command){
    	this.num = command.num;
    	
      if(command.type =='1'){
        this.dialogVisible = true;
      }else if(command.type =='2'){
        this.dialogVisible2 = true;

      }

    },
    //弹窗子组件传值
    toClose(){
    	this.showDialog = false;
    },
    toShow(val){
    	let  loadingInstance =  this.$loading({ fullscreen: false,target:document.getElementById('signLoading'),background: 'rgba(0, 0, 0, 0.7)'});//loading 加载样式
    	this.isShowLoading = val;
    	if(!val){
    		loadingInstance.close();
    	}
    },
    sendEcontract(){
    	this.isSaveDraft = false;
    	//发送合同
    	if(this.firstInf.id && this.secondInf.id){
    		//需要给后台传的参数
    		this.assign;
	    	
	    	this.showDialog = true;
    	}else if(!this.templateName){
    		this.$message.error('合同名称不能为空！');
    	}else{
    		this.$message.error('请检查签署人信息不能为空！');
    	}
    },
    //存草稿
    saveEcontract(){
    	this.isSaveDraft = true;
//  	if(this.firstInf.id && this.secondInf.id){
    		//需要给后台传的参数
    		this.assign;
	    	
	    	getData.addMerchantContract(this.contractObj)
				.then((res)=>{
					this.$router.push('/mana/list');
				})
				.catch((error)=>{
					this.$message.error(error.data.msg);
				})
//			}
    },
    //甲方清除
    toClear(){
    	this.showFirstParty = false;
    	this.firstInf = {};
    },
    //乙方清除
    toClearSecond(){
    	this.showSecondParty = false;
    	this.secondInf = {};
    }
  }
};
</script>

<style lang="less" scoped>
	.middleWrap .ContensWrap{
		height: auto;
		.goBack{
			position: static;
			float: left;
	    margin-left: 20px;
	    padding-left: 13px;
	    line-height: 59px;
	    font-size: 16px;
	    color: #666;
	    background: url('~assets/images/back.png') no-repeat;
	    background-position: 0 22px;
	    cursor: pointer;
		}
	}
	.ContensWrap header{
		border-bottom: 1px solid #eee;
		overflow: hidden;
	}
	.middleWrap .ContensWrap > header .head-title{
		margin-left: 0 !important;
	}
	.middleWrap .ContensWrap .head-title{
		margin-left: 0;
		padding-left: 20px;
		float: left;
	}
	.sendBtn{
		width: 100px;
		height: 36px;
		background: #ff3e08;
		font-size: 16px;
		color: #fff;
		border-radius: 2px;
		float: right;
		margin-top: 12px;
	}
	.saveBtn{
		width: 100px;
		height: 36px;
		border: 1px solid #888888;
		font-size: 16px;
		color: #000;
		border-radius: 2px;
		float: right;
		margin: 12px 20px 10px 20px;
	}
	
	/*主体*/
	.content{
		padding: 0 30px;
		.content-head{
			height: 82px;
			overflow:hidden;
			div{
				float: left;
				font-size: 16px;
				color: #000;
				margin-top: 40px;
			}
			.signName{
				margin-left: 80px;
			}
			.partiesNumber{
				margin-left: 80px;
			}
			.signEnter{
				float: left;
				border: 1px solid #e5e5e5;
				width: 300px;
				height: 32px;
				margin-top: 30px;
				padding-left: 10px;
				font-size: 16px;
				color: #000;
			}
		}
		
		.clause{
			overflow: hidden;
			.clause-left{
				font-size: 16px;
				color: #000;
				float: left;
			}
			.clause-right{
				float: left;
				width: 1472px;
			}
			.clause-content{
				overflow: scroll;
				height: 800px;
				border: 1px solid #d1d1d1;
			}
		}
	}
	
	/*签署合同信息*/
	.mes{
		margin-top: 30px;
		h3{
			font-size: 16px;
			color: #000;
			font-weight: bold;
			margin-bottom: 23px;
		}
		.firstParty,.secondParty{
			margin-bottom: 30px;
			h4{
				padding-left: 10px;
				font-size: 16px;
				color: #000;
				border-left: 3px solid #ff6508;
				margin-bottom: 20px;
			}
			.firstParty-table,.secondParty-table{
				width: 800px;
				tr{
					height: 60px;
					th,td{
						border-left: 1px solid #e5e5e5;
						border-top: 1px solid #e5e5e5;
						text-align: center;
						font-size: 16px;
						color: #000;
					}
				}
				tr td:nth-of-type(1){
					width: 360px;
				}
				tr td:nth-of-type(2){
					width: 220px;
				}
				tr td:last-of-type{
					border-right: 1px solid #e5e5e5;
				}
				tr:last-of-type td{
					border-bottom: 1px solid #e5e5e5;
				}
				tr.first{
					height: 40px;
				}
				tr.first th{
					background: #efefef;
					color: #555555;
					font-weight: bold;
				}
				tr.first th:last-of-type{
					border-right: 1px solid #e5e5e5;
				}
				/*清除*/
				.purge{
					color: #009cff;
					cursor: pointer;
				}
				/*添加*/
				.adjunctionBtn{
					width: 80px;
					height: 36px;
					background: #ff3e08;
					font-size: 14px;
					color: #fff;
					line-height: 36px;
					padding-left: 16px;
					text-align: left;
					margin: 0 auto;
					cursor: pointer;
					.triangular{
						display: inline-block;
						margin-left: 14px;
						width: 10px;
						height: 5px;
						background: url('~assets/images/triangular.png') no-repeat;
					}
				}
			}
		}
		
		/*按钮*/
		.btn{
			margin-bottom: 70px;
			overflow: hidden;
			.sendingContract{
				width: 100px;
				height: 36px;
				background: #ff3e08;
				font-size: 16px;
				color: #fff;
				border-radius: 2px;
				float: left;
			}
			.saveContract{
				width: 100px;
				height: 36px;
				border: 1px solid #888888;
				font-size: 16px;
				color: #000;
				border-radius: 2px;
				float: left;
				margin-left: 20px;
			}
		}
	}
	
.el-dropdown-menu__item{
	font-size: 16px !important;
	color: #000000 !important;
}
.ContensWrap /deep/ .el-dropdown-link{ 
  padding:6px 12px;
  background:#ff3e08;
  color:#ffffff;
  border-radius:2px;
  cursor: pointer;
}
/*loading*/
.loadingCircle{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
}
#signLoading{
    width: 154px;
    height: 110px;
    position: absolute;
    left: 50%;
    top: 50%;
}
</style>
