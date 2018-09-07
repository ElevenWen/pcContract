<template>
	<div id="head">
		<span @click="toBack" v-if="isBack">返回</span>
		<h3>{{title}}</h3>
	</div>
</template>

<script>
	export default{
		props:{
			title:String,
			isBack:Boolean,
			website:String
		},
		methods:{
			toBack(){
				if(this.website){
					this.$router.push(this.website);
					return;
				}
				this.$router.go(-1)
			}
		}
	}
</script>

<style type="stylesheet/css"  lang="less" scoped>
	span{
		float: left;
		color: #666666;
		font-size: 16px;
		background: url(../assets/images/back.png) no-repeat;
		padding-left: 13px;
		margin: 22px 18px 0 20px;
		cursor: pointer;
	}
	h3{
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        font-weight: bold;
        color: #000;
        padding-left: 19px;
        border-bottom: 1px solid #eee;
    }
</style>