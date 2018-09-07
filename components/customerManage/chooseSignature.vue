<template>
	<div id="chooseSignature">
		<el-dialog title="签章类型选择" :visible.sync="dialogVisibleShow" :before-close="handleClose" width="380px" top="30vh">
		  	
		  	<div class="signRadio">
		  		<el-radio v-model="radio" label="1" @change="handleChange">创建企业签章</el-radio>
  				<el-radio v-model="radio" label="2" @change="handleChange">创建个人签章</el-radio>
		  	</div>
		  	
		  	<div class="btn">
		  		<button type="button" class="enterBtn" @click="toEnter">确定</button>
		  		<button type="button" class="cancelBtn" @click="handleClose">取消</button>
		  	</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				dialogVisibleShow:false,
				radio: '1',
				num:1,
			}
		},
		props:{
			dialogVisible:Boolean,
			activeName2:String
		},
		mounted(){
			this.dialogVisibleShow = this.dialogVisible;
		},
		methods:{
			toEnter(){
				if(this.num == 1){
					this.$router.push({path:'/customerCenter/signature/companyCertification',query:{type:this.activeName2}});
				}else if(this.num == 2){
					this.$router.push({path:'/customerCenter/signature/personalCertification',query:{type:this.activeName2}})
				}
			},
			//单选框改变触发
			handleChange(val){
				this.num = val;
			},
			//点击关闭按钮触发
			handleClose(done) {
		        this.dialogVisibleShow = false;
				//给父组件传值
				this.$emit('toClose',false)
		    }
		}
	}
</script>

<style type="stylesheet/css"  lang="less">
	#chooseSignature .el-dialog__header{
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
	
	#chooseSignature .el-dialog__body{
		padding: 55px 40px 40px 40px;
		
		.signRadio{
			margin-bottom: 54px;
			.el-radio__label{
				font-size: 16px;
			}
			.el-radio{
				color: #4d4d4d;
			}
			/*选中的字体颜色*/
			.el-radio__input.is-checked+.el-radio__label{
				color: #4d4d4d;
			}
			.el-radio__inner{
				width: 20px;
				height: 20px;
				position: static;
			}
			.el-radio__input{
				position: static;	
			}
			/*选中的圈圈*/
			.el-radio__input.is-checked .el-radio__inner{
				border: none;
				background: url(~assets/images/signature/availablesignature.png) no-repeat;
			}
		}
		
		.btn{
			overflow: hidden;
			button{
				width: 80px;
				height: 30px;
				float: left;
			}
			.enterBtn{
				margin-left: 58px;
				background: #ff3e08;
				color: #fff;
			}
			.cancelBtn{
				margin-left: 20px;
				background: #fff;
				color: #4d4d4d;
				border: 1px solid #e6e6e6;
			}
		}
	}
	
	
</style>