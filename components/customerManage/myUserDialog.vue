<template>
	<div id="myUserDialog">
		<el-dialog title="我的客户" :visible.sync="dialogVisible" :before-close="handleClose" width="840px" top="10vh">
				<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
				    <el-tab-pane label="企业客户" name="first">
				    	<!--搜索栏-->
				    	<div class="search">
				    		<input type="text" placeholder="请输入企业名称" maxlength="20" v-model="pageSearchName"/>
				    		<div class="inquiry" @click="seachCustomerSignerList(1)">查询</div>		    		
				    	</div>
				    	<!--表格-->
				    	<div class="myUserDialog-table">
					    	<el-table :data="companyListData"  border style="width: 100%" >
							    <el-table-column  label="选择" align="center">
								 <template slot-scope="scope">
							        <span class="raidioCheckItem" @click="nowCheckOne(scope.row)" :class="(scope.row.Id == nowCheckId && isCheckOne)? 'checkActivated':''"></span>
							      </template>
							    </el-table-column>
							    <el-table-column  prop="CompanyName"  label="公司名称"  width="300" align="left">
							    </el-table-column>
							    <el-table-column  prop="ContactName"  label="联系人姓名" width="120" align="center">
							    </el-table-column>
							    <el-table-column  prop="ContactMobile"  label="联系人手机号" width="120" align="center">
							    </el-table-column>
							    <el-table-column  prop="ContactEmail"  label="邮箱" width="186">
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
				    	</div>
				    	<!--表格-->
				    	<div class="myUserDialog-table table-sizeWidth">
					    	<el-table :data="curstomListData" border style="width: 100%">
							    <el-table-column  label="选择"  width="70">
								  <template slot-scope="scope">
							        <span class="raidioCheckItem" @click="nowCheckOne(scope.row)" :class="(scope.row.Id == nowCheckId && isCheckOne)? 'checkActivated':''"></span>
							      </template>
							    </el-table-column>				    
							    <el-table-column  prop="ContactName"  label="联系人姓名" width="272" align="center">
							    </el-table-column>
							    <el-table-column  prop="ContactMobile"  label="联系人手机号" width="272" align="center">
							    </el-table-column>
							    <el-table-column  prop="ContactEmail"  label="邮箱" width="200">
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
				<div class="addUser_btn" @click="toEnterAdd">添加签署人</div>		
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
				radio: 0,	
				activeName2: 'first',
				pageSearchName:'',	//搜索关键字
				isCheckOne: false,	//是否单选了
				nowCheckId: '',		//当前选中的table-item id	
				userFromItemData:'',	//单选的item

				pageIndex:1,		//默认第几页				
 				pageSize: 10,	 	//默认一页10条数据 	 
				totalList: 0 , 		//总共条数
		
				contractUserInfo: '',	//本地存储的用户信息
				companyListData: [],	//公司表格信息
			    curstomListData: [],	//个人用户表格信息
			}
		},
		mounted(){
				//从本地存储获取用户信息
				this.contractUserInfo = JSON.parse(window.localStorage.getItem('CustomerMesg'));		
				//第一次  获取(公司)表信息
				this.__getCustomerSignerList(1);
				//显示监听
				this.$watch('dialogVisible',()=>{
					if(this.dialogVisible){
						this.__getCustomerSignerList(1);
					}else{
						return
					}		
				})
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
		//--------页面控制----------	
			handleClick(tab) {
				//重置处理
				this.pageSearchName = '';				
				this.pageIndex = 1;
				this.pageSize = 10;
			    if(tab.label == "企业客户"){				
					this.__getCustomerSignerList(1)
				}else if(tab.label == "个人客户"){			
					this.__getCustomerSignerList(0)
				}else{}
			},
			nowCheckOne(row){
				if(this.nowCheckId == row.Id){
					this.isCheckOne = !this.isCheckOne;					
				}else{
					this.isCheckOne = true;
				}
				this.nowCheckId = row.Id;
				
				if(this.isCheckOne){	//标识 已经选中才能赋值
					this.userFromItemData = row;
				}else{
					this.userFromItemData = '';
				}
				
			},			
			toEnterAdd(){	
				if(this.isCheckOne){
					//给父组件传值
					this.$emit('getSeacheData',this.userFromItemData);
					this.$emit('colseSeacheDialog')			
				}else{
					 this.$message({
						showClose: true,
						message: '请您先选中要添加的信息！',
						type: 'warning'
					});
					return false
				}				
			},
			seachCustomerSignerList(type){
				var parma = {
				 Id: this.contractUserInfo.Id,
				 keyword:this.pageSearchName, 
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
			//点击关闭按钮触发
			handleClose(done) {
		    	this.$emit('colseSeacheDialog')
			},

			//页数变化 控制
			handleSizeChange(val) {
				this.pageIndex = 1;									
				this.pageSize = val;
				if(this.activeName2 == 'first'){
					this.__getCustomerSignerList(1)
				}else if(this.activeName2 == 'second'){
					this.__getCustomerSignerList(0)
				}else{}	
				//console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.pageIndex = val;				
				if(this.activeName2 == 'first'){
					this.__getCustomerSignerList(1)
				}else if(this.activeName2 == 'second'){
					this.__getCustomerSignerList(0)
				}else{}
				//console.log(`当前页: ${val}`);
			},
		}
	}
</script>

<style type="stylesheet/css"  lang="less">
	#myUserDialog .el-dialog__header{
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
	
	#myUserDialog .el-dialog__body{
		padding: 20px 16px;
		
	}
	//添加签署人按钮
	.addUser_btn{
		margin: 30px auto;
		width: 101px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		font-size: 14px;
		color: #ffffff;
		background-color: #ff3e08;
		border-radius: 2px;
		&:hover{cursor: pointer}
	}
//搜索栏
#myUserDialog .search{
    overflow: hidden;
    height: 40px;
    input{
        width: 300px;
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
    .add{
        width: 110px;
        height: 26px;
        background: #fff;
        color: #ff3e08;
        font-size: 14px;
        border: 1px solid #ff3e08;
        float: left;
        text-align: center;
        line-height: 26px;
        border-radius: 2px;
        cursor: pointer;
    }
}	



	//表格
#myUserDialog .myUserDialog-table{
   .raidioCheckItem{
		padding: 0 9px;
		background-color: #ffffff;
		border: solid 1px #cccccc; 
		&:hover{
			cursor: pointer;
		}
	}
	//选中样式
	.checkActivated{
		background: url('~assets/images/check_true.png') no-repeat;
		background-size: 100% 100%;
		border: none !important;
	}
	.el-table__body-wrapper{
		height: 360px;
		overflow-x: hidden;
		overflow-y: auto;
	}
}
#myUserDialog .table-sizeWidth{
    width: 810px;
}
//表格标题
#myUserDialog .myUserDialog-table .el-table__header tr th{
    background: #efefef;
    text-align: center;
    color: #555555;
    .cell{
        font-weight: bold;
    }
}
#myUserDialog .myUserDialog-table .el-table__header tr:nth-of-type(1) th{
//  height: 36px;
}
//表格主体
#myUserDialog .el-table__body tr td{
    //text-align: center;
}
#myUserDialog .el-table__body tr:nth-of-type(even) td{
    background: #f9f9f9;
}
#myUserDialog .el-table__body .el-button{
    width: 50px;
    height: 26px;
    background: #0096ff;
    text-align: center;
    line-height: 25px;
    color: #fff;
    padding-top: 0;
}
#myUserDialog .el-table__body .el-table__row{
	// > td{
	// 	&:nth-child(1){
	// 		.cell{
	// 			padding-left: 0;
	// 			margin: 0 auto;
	// 			width: 16px;
	// 			height: 16px;
	// 			background-color: #ffffff;
	// 			border: solid 1px #cccccc;
	// 			&:hover{cursor: pointer}
	// 		}	
	// 	}
	// }
}


//分页
#myUserDialog .pagination{
    margin-top: 20px;
    overflow: hidden;
    .el-pagination{
        float: right;
    }
}

//修改element-ui tabs默认样式
#myUserDialog .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
    color: #ff3e08;
    font-size: 16px;
    background: #fff;
    border-bottom: none;
    height: 41px;
    width: 90px;
    border-right: 1px solid #ff3e08;
    border-top: 1px solid #ff3e08;
    border-left: 1px solid #ff3e08 !important;
}
#myUserDialog .el-tabs--card>.el-tabs__header{
    border-bottom: 1px solid #cecece;
}
#myUserDialog .el-tabs__item:hover{
    color: inherit;
}
#myUserDialog .el-tabs__item.is-active:hover{
    color: #ff3e08;
}
#myUserDialog .el-tabs--card>.el-tabs__header .el-tabs__nav{
    border: none;
}
//tabs的每个标签
#myUserDialog .el-tabs--card>.el-tabs__header .el-tabs__item{
    border-right: 1px solid #cecece;
    border-top: 1px solid #cecece;
    margin-left: 4px;
    background: #fafafa;
    border-bottom: 1px solid #cecece;
    width: 90px;
    text-align: center;
    padding: 0;
    border-radius: 4px 4px 0 0;
}
//tabs的第一个标签
#myUserDialog .el-tabs--card>.el-tabs__header .el-tabs__item:first-child{
    border-left: 1px solid #cecece;
    margin-left: 16px;
}
	
</style>