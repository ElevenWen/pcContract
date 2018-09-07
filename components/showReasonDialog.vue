<template>
	<div id="showReasonDialog">
		<el-dialog
      title="驳回原因"
      :visible.sync="dialogVisible"
      width="25%"
			:before-close="handleClose">
      <span>{{reasonText}}</span>
      <span slot="footer" class="dialog-footer"> 
        <el-button type="danger" @click="toEnter">确 定</el-button>
      </span>
  	</el-dialog>
	</div>
</template>

<script>
	export default {
		props:{
			dialogVisible:Boolean,
			reasonText:'',		//原因描述			
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
				//给父组件传值
				this.$emit('colseReasonDialog')

			},
			//点击关闭按钮触发
			handleClose(done) {
		    this.$emit('colseReasonDialog')
		  }
		}
	}
</script>

<style type="stylesheet/css"  lang="less">
	#showReasonDialog .el-dialog__header{
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
	#showReasonDialog .el-dialog__body{
		span{
			font-size: 16px;
		}		
	}
	#showReasonDialog .el-dialog__footer{
		text-align: center;
		.el-button{
			padding: 10px 20px;
		}
	}
	
	
</style>