<template>
	<div id="customerManage" class="commonWrap">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap" v-loading="pageLoading">
				<h1>客户管理</h1>
				<el-tabs v-model="activeName2" type="card"  @tab-click="handleClick">
				    <el-tab-pane label="企业客户" name="first">
				    	<!--搜索栏-->
				    	<div class="search">
				    		<input type="text" placeholder="请输入企业名称" maxlength="20" v-model="pageSearchName"/>
				    		<div class="inquiry" @click="seachCustomerSignerList(1)">查询</div>
				    		<div class="add" @click="addComUser(0)">添加企业客户</div>
				    	</div>
				    	<!--表格-->
				    	<div class="customerManage-table">
					    	<el-table :data="companyListData" border style="width: 100%">
							    <el-table-column  :index="indexMethod"  label="序号"  width="80" type="index" align="center">
							    </el-table-column>
							    <el-table-column  prop="CompanyName"  label="公司名称"  width="450" align="left" >
							    </el-table-column>
							    <el-table-column  prop="ContactName"  label="联系人姓名" width="250" align="center">
							    </el-table-column>
							    <el-table-column  prop="ContactMobile"  label="联系人手机号" width="250" align="center">
							    </el-table-column>
							    <el-table-column  prop="ContactEmail"  label="邮箱">
							    </el-table-column>
							    <el-table-column  fixed="right"  label="操作"  width="193" align="center">
							      <template slot-scope="scope">
							        <el-button @click="editMycustomerItem(scope.row, 0)" type="text" size="small">编辑</el-button>
							        <el-button type="text" size="small" @click="deleSignerItem(scope.row,0)">删除</el-button>
							      </template>
			    				</el-table-column>
							</el-table>		
								<!--分页-->
								<div class="pagination">
									<el-pagination
											@size-change="handleSizeChange"
											@current-change="handleCurrentChange"
											:current-page="pageIndex"
											:page-sizes="[10, 25, 50, 100]"
											:page-size="pageSize"
											layout="total, sizes, prev, pager, next, jumper"
											:total="totalList">
										</el-pagination>
								</div>					
						</div>
						
				    </el-tab-pane>
						
				    <el-tab-pane label="个人客户" name="second">
				    	<!--搜索栏-->
				    	<div class="search">
				    		<input type="text" placeholder="请输入用户手机号/姓名" maxlength="20" v-model="pageSearchName"/>
				    		<div class="inquiry" @click="seachCustomerSignerList(0)">查询</div>
				    		<div class="add" @click="addComUser(1)">添加个人客户</div>
				    	</div>
				    	<!--表格-->
				    	<div class="customerManage-table table-sizeWidth">
					    	<el-table :data="curstomListData" border style="width: 100%">
							    <el-table-column  :index="indexMethod" label="序号"  width="80" type="index" align="center">
							    </el-table-column>				    
							    <el-table-column  prop="ContactName"  label="联系人姓名" width="250">
							    </el-table-column>
							    <el-table-column  prop="ContactMobile"  label="联系人手机号" width="250" align="center">
							    </el-table-column>
							    <el-table-column  prop="ContactEmail"  label="邮箱" width="250">
							    </el-table-column>
							    <el-table-column    label="操作"  width="193" align="center">
							      <template slot-scope="scope">
							        <el-button @click="editMycustomerItem(scope.row,1)" type="text" size="small">编辑</el-button>
							        <el-button type="text" size="small" @click="deleSignerItem(scope.row,1)">删除</el-button>
							      </template>
			    				</el-table-column>
							</el-table>
								<!--分页-->
								<div class="pagination">
									<el-pagination
											@size-change="handleSizeChange"
											@current-change="handleCurrentChange"
											:current-page="pageIndex"
											:page-sizes="[10, 25, 50, 100]"
											:page-size="pageSize"
											layout="total, sizes, prev, pager, next, jumper"
											:total="totalList">
										</el-pagination>
								</div>
						</div>					
				    </el-tab-pane>					
				</el-tabs>	
			</div>
		</div>

		<!--弹窗组件 v-if="dialogVisible" -->
		<addUser :dialogVisible="dialogVisible" :title="title" :titleType="titleType" @getAddData="getAddData" @toClose = "toClose"></addUser>
		<editUser ref="edituac" :dialogVisible="dialogVisible2" :title="title2" :titleType="titleType"  @getEditData="getEditData" @toClose = "toClose"></editUser>

	</div>
</template>

<script>
	import leftNav from '~/components/leftNav.vue';
	import topBanner from '~/components/topBanner.vue';
	import addUser from '~/components/customerManage/addUser.vue';
	import editUser from '~/components/customerManage/editUser.vue';

	import getData from "~/store/ajaxAPI/getData"

	export default {
		data(){
			return{
				pageSearchName:'',		//搜索关键字
				pageLoading: false,		//发送数据时等待
				activeName2: 'first',
				addFormData: '',			//添加的数据
				contractUserInfo: '',	//本地存储的用户信息
				companyListData: [],	//公司表格信息
			  curstomListData: [],		//个人用户表格信息
		
				pageIndex: 1,  //默认第一页
 				pageSize: 10,	 //默认一页10条数据 	 
				totalList: 0 , //总共条数
				
				key: 1,
				parentEditData: {},		//初始化子组件数据显示
				dialogVisible:false,	//添加弹窗显示
				dialogVisible2: false, //编辑弹窗显示
				titleType: 0,					//0 显示企业信息， 1 显示个人用户信息
				title: '添加企业客户', //默认添加企业用户 
				title2: '编辑用户' //编辑用户
			}
		},
	  	components: {
	    	leftNav,
    		topBanner,
				addUser,
				editUser
			},
			mounted(){
				//从本地存储获取用户信息
				this.contractUserInfo = JSON.parse(window.localStorage.getItem('CustomerMesg'));		
				//第一次  获取(公司)表信息
				this.__getCustomerSignerList(1);
			},
	  	methods:{
//------数据获取及处理-------
			__getCustomerSignerList(type){
			 var parma = {
				 Id: this.contractUserInfo.Id,
				 type: type,
				 pageIndex: this.pageIndex,
				 pageSize: this.pageSize     	
			 }				
				getData.getCustomerSignerList(parma)
				.then(res=>{
					this.totalList = res.data.recordCount;
					if(type === 0){
						this.curstomListData = res.data.list;					
			 		}else if(type === 1){
						this.companyListData = res.data.list;
					}else{}
					
				})
			},
			seachCustomerSignerList(type){
				var parma = {
				 Id: this.contractUserInfo.Id,
				 keyword:this.pageSearchName, 
				 type: type,
				 pageIndex: 1,
				 pageSize: 50     	
			 }				
				getData.getCustomerSignerList(parma)
				.then(res=>{
					this.totalList = res.data.recordCount;
					if(type === 0){
						this.curstomListData = res.data.list;					
			 		}else if(type === 1){
						this.companyListData = res.data.list;
					}else{}
					
				})
			},
		
//----页面交互控制------				
	  		handleClick(tab) {
					//重置处理
					this.pageSearchName = '';
					this.pageIndex = 1;
					this.pageSize = 10;
		        if(tab.label == "企业客户"){
							this.titleType = 0;
							this.__getCustomerSignerList(1)
						}else if(tab.label == "个人客户"){
							this.titleType = 1;
							this.__getCustomerSignerList(0)
						}else{}
				},
				//序号
	  		indexMethod(index) {
	  			let num = index+1+this.pageSize*(this.pageIndex-1);
	  			num = String(num).length>1 ? num : "0" + num;
		        return num;
		   	},
		    //页数变化
		    handleSizeChange(val) {		
					this.pageIndex = 1;									
					this.pageSize = val;
					if(this.activeName2 == 'first'){
						this.__getCustomerSignerList(1)
					}else if(this.activeName2 == 'second'){
						this.__getCustomerSignerList(0)
					}else{}	
					//console.log(`每页 ${this.pageSize} 条`);
		    },
		    handleCurrentChange(val) {				
					this.pageIndex = val;				
					if(this.activeName2 == 'first'){
						this.__getCustomerSignerList(1)
					}else if(this.activeName2 == 'second'){
						this.__getCustomerSignerList(0)
					}else{}
					//console.log(`当前页: ${this.pageIndex}`);
						
		    },
		    //添加企业/个人用户
		    addComUser(num){
						this.titleType = num;					
		    	//企业用户
		    	if(num == 0){
						this.title = '添加企业客户'
						this.dialogVisible = true;
		    		
		    	}else if(num == 1){//个人用户
						this.title = '添加个人客户'
						this.dialogVisible = true;

		    	}
				},
				//删除企业/个人用户
				deleSignerItem(item, type){
					var parma ={
						Ids: item.Id
					}
					 this.$confirm(`是否删除 "${type===0? item.CompanyName : item.ContactName}" 该用户?`, '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							getData.getDelSigner(parma)
								.then(res=>{
									this.$message({
									type: 'success',
									message: '删除成功!'
								});
								type === 0? this.__getCustomerSignerList(1) : this.__getCustomerSignerList(0);
							})
							
						}).catch(err=>{});							
				},
				//编辑
				editMycustomerItem(item, type){
				//	console.log(item)
				  // var obj = item;
					// this.parentEditData = obj;
					this.$refs.edituac.getMyfromData(item)
					
					this.dialogVisible2 = true;
					
				},
				//添加 弹窗子组件传值
				getAddData( formData, type){
					this.addFormData = formData;
					if(type === 0){
							var parmas ={
								  CusId: this.contractUserInfo.Id,	 
									type: 1, 	 
									Name: this.addFormData.name, 	 
									Mobile: this.addFormData.phoneNumber,
									MerName: this.addFormData.companyName,
									Email: this.addFormData.email
							} 

					}else if(type === 1){
							var parmas ={
								  CusId:  this.contractUserInfo.Id,	 
									type: 0, 	 
									Name: this.addFormData.name, 	 
									Mobile: this.addFormData.phoneNumber,							
									Email: this.addFormData.email
							} 
					}else{}

					this.pageLoading = true;
					this.dialogVisible = false;
					getData.getAddSigner(parmas)
					.then(res=>{
						
						this.pageLoading = false;
						this.$message({
							message: '添加成功！',
							type: 'success'
						});
						//type === 0? this.companyListData.unshift(res.data) : this.curstomListData.unshift(res.data);
						type === 0? this.__getCustomerSignerList(1) : this.__getCustomerSignerList(0);
          }).catch(err=>{
						this.pageLoading = false;
						this.$message.error(err.data.msg);
						//console.log('添加失败',err)
					})			
		    },
		    toClose(){
					//重置
					this.parentEditData = {};
					this.dialogVisible = false;		
					this.dialogVisible2 = false;	
					var obj = {};
					this.$refs.edituac.getMyfromData(obj)
				},
				//编辑页面 子组件传值
				getEditData(editData, type){
					var oldData = editData;
						if(type === 0){
								var parmas ={
									  Id: editData.Id,
										CusId: this.contractUserInfo.Id,	 
										type: 1, 	 
										Name: editData.ContactName,	 
										Mobile: editData.ContactMobile,
										MerName: editData.CompanyName,
										Email: editData.ContactEmail
								} 

						}else if(type === 1){
								var parmas ={
										Id: editData.Id,
										CusId:  this.contractUserInfo.Id,	 
										type: 0, 	 
										Name: editData.ContactName,	 
										Mobile: editData.ContactMobile,									
										Email: editData.ContactEmail
								} 
						}else{}

						this.pageLoading = true;
						this.dialogVisible2 = false;
						getData.getEditSigner(parmas)
						.then(res=>{						
							this.pageLoading = false;
							this.$message({
								message: '修改成功！',
								type: 'success'
							});
							//type === 0? this.companyListData.unshift(res.data) : this.curstomListData.unshift(res.data);
							type === 0? this.__getCustomerSignerList(1) : this.__getCustomerSignerList(0);
					}).catch(err=>{					
						this.pageLoading = false;
						this.$message.error(err.data.msg);
						//console.log('编辑保存失败',oldData)
							type === 0? this.__getCustomerSignerList(1) : this.__getCustomerSignerList(0);//占时这么处理
					})
				}
				
	  	}
	}
</script>

<style type="stylesheet/css"  lang="less">
  @import "~assets/less/customerManage/customerManage.less";
</style>
