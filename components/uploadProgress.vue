<template>
	<div id="uploadProgress">
		<el-dialog title="上传文件" :visible.sync="dialogVisible" :before-close="handleClose"
		  :closeOnClickModal='false'	
			width="410px" top="30vh">
		  	<span class="des">正在上传</span>
				<el-progress :text-inside="true" :stroke-width="18" :percentage="tageProgress" 
				color="#ff952e"></el-progress>
			
		</el-dialog>
	</div>
</template>

<script>
import tool from "~/assets/lib/tool.js";
	export default {
		props:{
			dialogVisible:Boolean,
			tageProgress: Number
			
		},
		data(){
			return{
				
			}
		},
		mounted () {
		
		},
		methods:{
			
			//点击关闭按钮触发
			handleClose(done) {	   	
				//调用父组件 关闭事件
				this.$emit('toClosePress')
		  }
		}
	}
</script>

<style type="stylesheet/css"  lang="less">
	#uploadProgress .el-dialog__header{
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
	
	#uploadProgress .el-dialog__body{
		padding: 0 20px 50px;
		text-align: center;
		.des{
			line-height: 66px;
		}
	}
	
	
</style>