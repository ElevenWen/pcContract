<template>
	<div id="editUser">
		<el-dialog :title="title" :visible.sync="dialogVisible" :before-close="handleClose" width="410px" top="30vh">
		  	<div class="entering" v-if="titleType === 0">
		  		<div class="character">
		  			<span>*</span>
		  			<span>公司名称</span>
		  		</div>
		  		<input type="text" :value="parentEditData.CompanyName" maxlength="20" ref="CompanyName"/>
		  	</div>
		  	
		  	<div class="entering">
		  		<div class="character">
		  			<span>*</span>
		  			联系人姓名
		  		</div>
		  		<input type="text" :value="parentEditData.ContactName" maxlength="6" ref="ContactName"/>
		  	</div>
		  	
		  	<div class="entering">
		  		<div class="character">
		  			<span>*</span>
		  			联系人手机
		  		</div>
		  		<input type="text" :value="parentEditData.ContactMobile" maxlength="11" ref="ContactMobile"/>
		  	</div>
		  	
		  	<div class="entering">
		  		<div class="character">	  			
		  			&nbsp;&nbsp;联系人邮箱
		  		</div>
		  		<input type="email" :value="parentEditData.ContactEmail" ref="ContactEmail"/>
		  	</div>
		  	
		  	<div class="btn">
		  		<button type="button" @click="toEnter">确定</button>
		  	</div>
			
		</el-dialog>
	</div>
</template>

<script>
import tool from "~/assets/lib/tool.js";
	export default {
		props:{
			//parentEditData: Object,		//编辑状态 父组件值显示 
			dialogVisible:Boolean,
			title: String,
			titleType: Number  //0 显示企业信息， 1 显示个人用户信息
				
		},
		data(){
			return{
				dialogVisibleShow:false,
				userFromData:{
					CompanyName: '',
					ContactName: '',
					ContactMobile:'',
					ContactEmail: ''
				},
			  parentEditData: {},		//通过方法传值
				
			}
		
		},
		mounted() {
		 
		 
		},
		methods:{
			getMyfromData(data){
				//console.log('方法接收到的数据',data);
				this.parentEditData = data;
			},
			toEnter(){									
				this.parentEditData.ContactName = this.$refs.ContactName.value;
				this.parentEditData.ContactMobile = this.$refs.ContactMobile.value;
				this.parentEditData.ContactEmail = this.$refs.ContactEmail.value;

				if(this.titleType === 0){
					this.parentEditData.CompanyName = this.$refs.CompanyName.value;
					if(this.parentEditData.CompanyName ==''){
						this.$message.error('公司名称不能为空！');
						return false;
					}
				}
					//表单校验
			 var isRegPhone =	tool.regularJudgement('phone',this.parentEditData.ContactMobile);
			 var isRegEmail = tool.regularJudgement('email',this.parentEditData.ContactEmail);
				if(this.parentEditData.ContactName == ''){
					this.$message.error('联系人姓名不能为空！');
					return false;
				}else if(!isRegPhone){
					this.$message.error('请检查手机号码是否填入正确！');
					return false;
				}else{
					if(this.parentEditData.ContactEmail){
							if(!isRegEmail){
								this.$message.error('邮箱格式不正确！');
								return false;
							}
					}
				}

				//给父组件传值
				this.$emit('getEditData',this.parentEditData, this.titleType);
					//重置组件数据
				for(var item in this.parentEditData){
					this.userFromData[item] = '';
				}

			},
			//点击关闭按钮触发
			handleClose(done) {	   
				//重置组件数据
				for(var item in this.parentEditData){
					this.userFromData[item] = '';
				}
				//调用父组件 关闭事件
				this.$emit('toClose')
		  }
		}
	}
</script>

<style type="stylesheet/css"  lang="less">
	#editUser .el-dialog__header{
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
	
	#editUser .el-dialog__body{
		padding: 20px 30px;
		.entering{
			margin-bottom:20px;
			overflow:hidden;
			.character{
				font-size: 16px;
				color: #000;
				float: left;
				line-height: 32px;
				span:nth-of-type(1){
					color: #fe0000;
				}
				span:nth-of-type(2){
					letter-spacing: 5px;
					padding-left: 5px;
				}
			}
			input{
				float: right;
				padding-left: 5px;
				border: 1px solid #e8e8e9;
				width: 240px;
				height: 32px;
			}
		}
		
		.btn{
			text-align: center;
			button{
				width: 80px;
				height: 30px;
				background: #ff3e08;
				color: #fff;
			}
		}
	}
	
	
</style>