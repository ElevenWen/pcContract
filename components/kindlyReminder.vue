<template>
	<!-- 签章温馨提示弹窗框 -->
    <div id="errBoxWrap" class="errBoxWrap">
        <div class="tipsWrap">
            <div class="tipsTitWrap">
                <span>温馨提示</span>
                <img src="~assets/images/signature/close.png" class="close" @click="cancel()">
            </div>
            <div class="tipsContent">
                <div>
                    <i class="errorImg"></i>
                    <div class="errorrr">确认发送合同</div>
                </div>
                <div class="errBtn">
                    <div @click="sure" class="sure">确定</div>
                    <div @click="cancel" class="cancel">取消</div>
                </div>
            </div>
        </div>
        
        
    </div>
</template>

<script>
	import getData from "~/store/ajaxAPI/getData";
	import tool from "~/assets/lib/tool.js";
	export default{
		data(){
			return{
				
			}
		},
		props:{
			contractObj:Object
		},
		methods:{
			//确定
			sure(){
				this.$emit('toShow',true);
				this.$emit('toClose',false);
				if(this.contractObj.SignerAPhone == this.contractObj.SignerBPhone){
					this.$emit('toShow',false);
					this.$message.error("签署人不能是同一人！");
				}else{
					getData.addMerchantContract(this.contractObj)
					.then((res)=>{
						this.$emit('toShow',false);
						//当前账号手机号；
						let phone = tool.loadFromLocal("CustomerMesg","ALL").Mobile;
						if(phone != this.contractObj.SignerAPhone && phone != this.contractObj.SignerBPhone){
							this.$router.push('/mana/list');
						}else{
							this.$router.push({path:'/mana/chooseSignature',query:{ecId:res.data.Id, form: 'create'}})
						}
					})
					.catch((error)=>{
						this.$emit('toShow',false);
						this.$message.error(error.data.msg);
					})
				}
				
			},
			//取消
			cancel(){
				//给父组件传值
				this.$emit('toClose',false)
			}
		}
	}
</script>

<style lang="less" scoped>
	#errBoxWrap{
	    width: 100%;
	    height: 100%;
	    position:fixed;
	    top:0px;
	    bottom:0;
	    left:0;
	    right:0;
	    z-index: 999;
	    background-color:rgba(0, 0, 0, 0.4); 
	    
	    .close{
		    width: 13px;
		    height: 12px;
		    margin: 12px 10px  0 0;
		    float: right;
		    cursor: pointer;
		}
		.tipsWrap{
		    width: 378px;
		    height: 237px;
		    background: #fff;
		    margin: 20% 0 0 35%;
		}
		.tipsTitWrap{
		    height: 39px;
		    background: #fcfcfd;
		    border: 1px solid #e8e8e9;
		    span{
		        margin-left: 20px;
		        line-height: 39px;
		        font-size: 16px;
		    }
		}
		.errorImg{
		    width: 46px;
		    height: 46px;
		    background: url("~assets/images/signature/error.png") no-repeat;
		    margin: 40px 0 0 40px;
		    display: block;
		    float: left;
		}
		.errorrr{
		    display: inline-block;
		    height: 42px;
		    margin-top: 44px;
		    line-height: 20px;
		    width: 250px;
		    text-align: left;
		    padding-left: 20px;
		}
		.errBtn{
		    padding: 20px 40px 0 105px;
		    float: left;
		}
		.errBtn .sure{
		    float: left;
		}
		.errBtn .cancel{
		    float: right;
		}
		.sure,.cancel{
		    display: inline-block;
		    width: 80px;
		    height: 30px;
		    line-height: 30px;
		    text-align: center;
		    border-radius: 5px;
		    cursor: pointer;
		}
		.sure{
		    background: #ff3e08;
		    color: #fff; 
		}
		.cancel{
		    border: 1px solid rgba(230, 230, 230, 1);
		    margin-left: 20px;
		}
	}
</style>