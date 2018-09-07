<template>
	<div id="addCompanyOrUser">
		<el-dialog title="添加客户" :visible.sync="dialogVisible" :before-close="handleClose" width="410px" top="30vh">
				<div class="entering">
		  		<div class="character">
		  			<span>*</span>
		  			<span>客户类型</span>	
		  		</div>
					<div class="checkbox 1" @click="checkTypaAdd(0)">
						<span class="checkIcon" :class="radio === 0? 'activedCheck':''"></span>
						<span class="des">企业客户</span>
					</div>
					<div class="checkbox 2" @click="checkTypaAdd(1)">
						<span class="checkIcon" :class="radio === 1? 'activedCheck':''"></span>
						<span class="des">个人客户</span>
					</div>
		  	</div>	

		  	<div class="entering" v-show="radio === 0">
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
						&nbsp;
		  			联系人邮箱
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
	import getData from "~/store/ajaxAPI/getData";
	import tool from "~/assets/lib/tool.js";
	export default {
		props:{
			dialogVisible:Boolean,		
		},
		data(){
			return{		
				radio: 0,	
				userFromData:{
					companyName: '',
					name: '',
					phoneNumber:'',
					email: ''
				}
			}
		},
		mounted(){
		
		},
		methods:{
			checkTypaAdd(addType){
				this.radio = addType;
			},
			toEnter(){	
				//新增联系人
				let type = "";
				//判断是企业还是个人
				if(this.radio == 0){
					type = 1;
					if(this.userFromData.companyName ==''){
						this.$message.error('公司名称不能为空！');
						return false;
					}
				}else{
					type = 0;
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
			
				let params = {
					CusId:tool.loadFromLocal("CustomerMesg","ALL").Id,
					type:type,
					Name:this.userFromData.name,
					Mobile:this.userFromData.phoneNumber,
					MerName:this.userFromData.companyName,
					Email:this.userFromData.email,
				}
				getData.getAddSigner(params)
				.then((res)=>{
					/* console.log(res)
					this.userFromData.id = res.data.Id;
					let name = this.userFromData.companyName ? this.userFromData.companyName : this.userFromData.name;
					let obj = {
						id:res.data.Id,
						name:name,
						phoneNumber:this.userFromData.phoneNumber,
						email:this.userFromData.email,
					} */
					//给父组件传值
					this.$emit('getAddData',res.data)
					this.$emit('colseAddDialog')
						//重置组件数据
					for(var item in this.userFromData){
						this.userFromData[item] = '';
					}
				})
				.catch((error)=>{
					//console.log(error.data.msg)
					this.$message.error(error.data.msg);
				})
			},
			//点击关闭按钮触发
			handleClose(done) {
					//重置组件数据
				for(var item in this.userFromData){
					this.userFromData[item] = '';
				}
		    	this.$emit('colseAddDialog')
		  	}
		}
	}
</script>

<style type="stylesheet/css"  lang="less">
	#addCompanyOrUser .el-dialog__header{
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
	
	#addCompanyOrUser .el-dialog__body{
		padding: 20px 30px;
		.entering{
			margin-bottom:20px;
			overflow:hidden;
			.checkbox{
				float: left;
				margin-left: 15px;
				font-size: 16px;
				color: #010101;
				line-height: 32px;
				&:hover{cursor: pointer;}
				.checkIcon{
					padding: 0 10px;
					margin-right: 5px;
					border-radius: 50%;
					border: solid 1px #c9c9c9;
				}
				.activedCheck{
					border: none;
					background: url('~assets/images/check_true.png') no-repeat;
					background-size: 100% 100%;
				}
			}
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