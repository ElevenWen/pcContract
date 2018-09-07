<template>
	<div id="useContractTemplate">
		<el-dialog title="使用合同模板" :visible.sync="dialogVisible" :before-close="handleClose" width="640px" top="15vh">
			<div class="diaConten">
				<div class="classify">
					<div class="tabs">
						<div :class="nowTab===0? 'activeTab':''" @click="handTab(0)">我的模板</div>
						<div :class="nowTab===1? 'activeTab':''" @click="handTab(1)">系统模板</div>
					</div>
					<ul v-if="nowTab === 0">
						<li :class="classIndex === -1? 'activeSever':''"><span @click="getTemplateClassify(-1,'')">全部分类</span></li>
						<li v-for="(item, index) in mytemplateClassify" :class="classIndex === index? 'activeSever':''" :key='index'><span @click="getTemplateClassify(index,item.Id)">{{item.Name}}</span></li>
					</ul>
					<ul v-if="nowTab === 1">
						<li :class="classIndex === -1? 'activeSever':''"><span @click="getTemplateClassify(-1,'')">全部分类</span></li>
						<li v-for="(item, index) in templateClassify" :class="classIndex === index? 'activeSever':''" :key='index'><span @click="getTemplateClassify(index,item.Id)">{{item.Name}}</span></li>
					</ul>
				</div>
				<div class="searchList">
					<div class="search">
						<input type="text" placeholder="请输入合同名称" maxlength="20" v-model="searchKeyWord"/>
						<div class="inquiry" @click="searchContractTemplateList">查询</div>					
					</div>
					<div class="listWrap">
						<div class="title">模板名称</div>
						<ul v-if="contractTemplateData.length>0">
							<li v-for="(item, index) in contractTemplateData" :key='index'
							@click="toEditContractDetail(item)">{{item.TemplateTitle}}</li>
						</ul>
						<ul class="nodata" v-else><span>抱歉，无数据~</span></ul>
					</div>
				</div>
			</div>			
		</el-dialog>
	</div>
</template>

<script>
import getData from "~/store/ajaxAPI/getData"

	export default {
		props:{
			dialogVisible:Boolean,				
		},
		data(){
			return{		
				nowTab: 0,				//0我的模板  1系统模板
				classIndex: -1,			//默认全部分类
				nowClassId: '',			//当前分类id
				searchKeyWord: '',
				templateClassify: [],	//模板分类
				mytemplateClassify: [],	//我的模板分类

				contractTemplateData:[],//模板列表数据

				localStorageUser:''		//用户信息
				
			}
		},
		mounted(){
			this.localStorageUser = JSON.parse(window.localStorage.getItem('CustomerMesg'));
			//分类获取
			this.__getTemplateClass();
			this.__getMyTemplateClass();

			this.__getCustomerTemplateList();
			//显示监听
				this.$watch('dialogVisible',()=>{
					if(this.dialogVisible){
						//重置处理
						this.nowClassId = '';
						this.__getCustomerTemplateList();
						this.__getMyTemplateClass();
					}else{
						return
					}		
				})
			
		},
		methods:{
			//获取模板分类列表
			__getTemplateClass(){
				getData.GetTemplateClass()
				.then(res=>{
					this.templateClassify = res.data.list;				
				})
			},
			__getMyTemplateClass(){
				var parma ={
					 Id: this.localStorageUser.Id 	
				}
				getData.GetMyTemplateClass(parma)
				.then(res=>{
					this.mytemplateClassify = res.data.list;
				})
			},
			//获取系统模板列表
			__getContractTemplateList(){
				var param = {
					ClassId: this.nowClassId,
					CusId: this.localStorageUser.Id,
					keyword: this.searchKeyWord,
					pageIndex: 1,
					pageSize: 1000,  	
				}
				getData.getContractTemplateList(param)
				.then(res=>{
					this.contractTemplateData = res.data.list;
					//console.log('合同模板列表',res.data)
				})
			},
			//获取我的模板
			__getCustomerTemplateList(){
				var param = {
					Id: this.localStorageUser.Id,
					TempClassId: this.nowClassId,
					TempName: this.searchKeyWord,
					pageIndex: 1,
					pageSize: 1000,
				}
				getData.getCustomerTemplateList(param)
				.then(res=>{
					this.contractTemplateData = res.data.list;
				})

			},
			//获取对应的分类 模板数据
			getTemplateClassify(classIndex, id){
				this.nowClassId = id;
				this.classIndex = classIndex;
				//重置
				this.searchKeyWord = '';
				if(this.nowTab === 0){
					this.__getCustomerTemplateList()	
				}else if(this.nowTab === 1){
					this.__getContractTemplateList()
				}else{}
			},
			toEditContractDetail(item){
				if(this.nowTab === 1){
					//自动领用处理
					let param ={
						Ids: item.Id,
						CusId: this.localStorageUser.Id
					}
					getData.addMyTemplate(param)
					.then(res=>{
						//console.log('领用成功',res)
					})
					this.$router.push({path:'/mana/create/template',query:{id:item.Id,type:0}});
				}else{
					this.$router.push({path:'/mana/create/template',query:{id:item.TemplateId,type:0}});
				}						
				this.$emit('closeDialog');
			},
			searchContractTemplateList(){
				//重置处理
				this.nowClassId = '';
				if(this.nowTab === 0){
					this.__getCustomerTemplateList()	
				}else if(this.nowTab === 1){
					this.__getContractTemplateList()
				}else{}
				
			},
			handleClose(){
				this.$emit('closeDialog')
			},
			handTab(tab){
				//重置处理
				this.nowClassId = '';
				this.classIndex = -1;		
				this.nowTab = tab;	
				if(this.nowTab === 0){
					this.__getCustomerTemplateList()	
				}else if(this.nowTab === 1){
					this.__getContractTemplateList()
				}else{}	
			},


		}
	}
</script>

<style type="stylesheet/css"  lang="less" scoped>
	#useContractTemplate /deep/ .el-dialog__header{
		height: 40px;
		background: #fcfcfd;
		padding: 0;
		padding-left: 20px;
		border-bottom: 1px solid #eee;
		line-height: 40px;
		.el-dialog__title{
			font-size: 16px;
			color: #4d4d4d;
		}
		.el-dialog__headerbtn{
			top: 10px;
		}		
	}	
	#useContractTemplate /deep/ .el-dialog__body{
		padding: 30px 40px;
		.diaConten{
			display: flex;
			margin: 0 auto;
			width: 560px;
			height: 390px;
			.classify{
				flex: 20;
				border: solid 1px #e6e6e6;
				.tabs{
					width: 100%;
					height: 40px;
					display: flex;
					>div{
						flex: 1;
						background-color: #e5e5e5;
						border: solid 1px #e6e6e6;
						font-size: 16px;
						color: #000000;
						line-height: 40px;
						text-align: center;
						&:hover{cursor: pointer;}
					}
					.activeTab{
						background-color: #fff;
						border: none;
					}
				}
				ul{
					width: 100%;
					height: 350px;
					overflow-x: hidden;
					overflow-y: auto;
					li{ 
						margin: 20px 0;
						padding-left: 20px;
						height: 16px;
						line-height: 16px;
						width: 100%;
						font-size: 16px;
						color: #000000;
						span{
							&:hover{cursor: pointer}
						}
					}
					.activeSever{
						border-left: 3px solid #ff3e08;
						color: #ff3e08;
					}
				}
			}
			.searchList{
				flex: 36;
				padding-left: 20px;
				.search{
					overflow: hidden;
					margin-bottom: 20px;	
					height: 26px; 
					padding: 0 !important;			
					input{
						width: 240px;
						height: 26px;
						padding-left: 6px;
						float: left;
						border: 1px solid #e5e5e5;
					}
					.inquiry{
						width: 50px;
						height: 26px;
						background: #ff3e08;
						color: #fff;
						font-size: 14px;
						float: left;
						margin: 0 20px;
						text-align: center;
						line-height: 26px;
						border-radius: 2px;
						&:hover{cursor: pointer;}
					}
				}
				.listWrap{
					width: 100%;
					.title{
						padding-left: 14px;
						height: 40px;
						line-height: 40px;
						background-color: #efefef;
						border: solid 1px #e5e5e5;
						font-family: MicrosoftYaHei-Bold;
						font-size: 16px;
						font-weight: bold;
						color: #555555;
					}
					ul{
						width: 100%;
						height: 305px;
						overflow-x: hidden;
						overflow-y: auto;
						border: 1px solid #e5e5e5;
						li{
							padding-left: 14px;
							height: 60px;
							line-height: 60px;
							border-bottom: 1px solid #e5e5e5;
							transition: 0.4s all; 
							&:nth-of-type(even){
								background-color: #f9f9f9;
							}
							&:hover{
								cursor: pointer;
								background-color: #D9E8F8;
							}
						}						
					}
					.nodata{
						text-align: center;
						line-height: 100px;
					}
				}
			}	
		}

	}

	
</style>