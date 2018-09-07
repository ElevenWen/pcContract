<template>
	<div id="addUser">
		<el-dialog :title="title" :visible.sync="dialogVisible" :before-close="handleClose" width="410px" top="30vh">
		  	<div class="entering" v-if="titleType === 0">
		  		<div class="character">
		  			<span>*</span>
		  			<span>公司名称</span>
		  		</div>
		  		<input type="text" v-model="userFromData.companyName" maxlength="20"/>
		  	</div>
		  	
		  	<div class="entering">
		  		<div class="character">
		  			<span>*</span>
		  			联系人姓名
		  		</div>
		  		<input type="text" v-model="userFromData.name" maxlength="6"/>
		  	</div>
		  	
		  	<div class="entering">
		  		<div class="character">
		  			<span>*</span>
		  			联系人手机
		  		</div>
		  		<input type="text" v-model="userFromData.phoneNumber" maxlength="11"/>
		  	</div>
		  	
		  	<div class="entering">
		  		<div class="character">	  			
		  			&nbsp;&nbsp;联系人邮箱
		  		</div>
		  		<input type="email" v-model="userFromData.email"/>
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
			dialogVisible:Boolean,
			title: String,
			titleType: Number,  //0 显示企业信息， 1 显示个人用户信息
			
		},
		data(){
			return{
				dialogVisibleShow:false,
				userFromData:{
					companyName: '',
					name: '',
					phoneNumber:'',
					email: ''
				}
			}
		},
		mounted () {
		
		},
		methods:{
			toEnter(){		
			 	if(this.titleType === 0){
					if(this.userFromData.companyName ==''){
						this.$message.error('公司名称不能为空！');
						return false;
					}
				}
					//表单校验
			 var isRegPhone =	tool.regularJudgement('phone',this.userFromData.phoneNumber);
			 var isRegEmail = tool.regularJudgement('email',this.userFromData.email);
				if(this.userFromData.name == ''){
					this.$message.error('联系人姓名不能为空！');
					return false;
				}else if(!isRegPhone){
					this.$message.error('请检查手机号码是否填入正确！');
					return false;
				}else{
					if(this.userFromData.email){
							if(!isRegEmail){
								this.$message.error('邮箱格式不正确！');
								return false;
							}
					}
				}

				//给父组件传值
				this.$emit('getAddData',this.userFromData, this.titleType );
			 //重置组件数据
				for(var item in this.userFromData){
					this.userFromData[item] = '';
				}
			},
			//点击关闭按钮触发
			handleClose(done) {	   
				//重置组件数据
				for(var item in this.userFromData){
					this.userFromData[item] = '';
				}
			//	console.log('重置后的数据：',this.userFromData)
				//调用父组件 关闭事件
				this.$emit('toClose')
		  }
		}
	}
</script>

<style type="stylesheet/css"  lang="less">
	#addUser .el-dialog__header{
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
	
	#addUser .el-dialog__body{
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