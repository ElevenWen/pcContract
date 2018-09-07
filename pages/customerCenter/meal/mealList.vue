<template>
	<div id="mealList" class="commonWrap">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap">
		    	<headerComponents :website="website" :title="title" :isBack="true"></headerComponents>
				<div class="mealList">
					<ul>
						<li v-for="item in mealData">
							<h5>{{item.Title}}</h5>
							<div class="title">¥{{item.ChargeStandard == 0 ?"0.00" : item.Price}}元</div>
	    					<p>有效期：{{item.TermValidity==0 ? "长期有效" : item.Days+'天'}}</p>
	    					<p>文件份数：{{item.UseFiles==0 ? "不限" : item.Files}}份</p>
	    					<p>模板使用：{{item.TemplateDec}}</p>
	    					<button type="button" class="payment" @click="toPay(item)">立即购买</button>
						</li>
					</ul>

					<!--分页-->
					<div class="pagination" v-if="totalMealList">
						<el-pagination
					      @size-change="handleSizeChange"
					      @current-change="handleCurrentChange"
					      :current-page.sync="currentPage"
					      :page-sizes="[15, 25, 35, 45]"
					      :page-size="15"
					      layout="total, sizes, prev, pager, next, jumper"
					      :total="totalMealList">
					    </el-pagination>
				    </div>
				</div>
			</div>
		</div>
		
		<!-- 签章温馨提示弹窗框 -->
	    <div id="errBoxWrap" class="errBoxWrap" v-if="isShow">
	        <div class="tipsWrap">
	            <div class="tipsTitWrap">
	                <span>温馨提示</span>
	                <img src="~assets/images/signature/close.png" class="close" @click="cancel()">
	            </div>
	            <div class="tipsContent">
	                <div>
	                    <i class="errorImg"></i>
	                    <div class="errorrr">您已成功购买合同套餐</div>
	                </div>
	                <div class="errBtn">
	                    <div @click="sure" class="sure">查看我的套餐</div>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>

</template>

<script>
	import leftNav from '~/components/leftNav.vue';
	import topBanner from '~/components/topBanner.vue';
	import getData from "~/store/ajaxAPI/getData";
	import headerComponents from '~/components/header.vue';
	import tool from "~/assets/lib/tool.js";


	export default{
		data(){
			return{
				title:"套餐列表",
				mealData:[],
				currentPage:1,//默认第几页
				totalMealList:0,//套餐列表总条数
				amount:15,//每页显示条数
				id:"",//用户id
				isShow:false,//是否显示弹出框
				website:'/customerCenter/meal'
			}
		},
	  	components: {
	    	leftNav,
    		topBanner,
    		headerComponents
	  	},
	  	mounted(){
	  		//获取套餐列表
	  		this.requestData(1,15);

	  		//获取我的id
	  		this._id = tool.loadFromLocal("CustomerMesg","ALL").Id;
	  	},
		methods:{
			//获取套餐列表
			requestData(num,pageNum){
				let params = {
		  			keyword:'',
		  			pageIndex:num,
		  			pageSize: pageNum
		  		}
		  		getData.getMealList(params)
		  		.then((res)=>{
		  			this.mealData = res.data.list;
		  			this.totalMealList = res.data.recordCount;
		  		})
		  		.catch((error)=>{
		  			// console.log(error)
		  		})
			},
			toPay(val){
				//购买套餐
				let params = {
					id:val.Id,
					customerId:this._id,
					amount:val.Price,
					oldAmount:val.Price,
					payType:0,
					remark:"",
					orderSource:0
				}
				getData.buyECPackage(params)
				.then((res)=>{
					if(val.ChargeStandard == 0){
						this.isShow = true;
					}else{
						this.$router.push({path:'/customerCenter/meal/newPayment',query:{id:res.data.out_trade_no}})
					}
				})
				.catch((error)=>{

				})

			},
			//页数变化
		    handleSizeChange(val) {
		    	this.currentPage = 1;
		        this.amount  = val;
		        this.requestData(1,this.amount);
		    },
		    handleCurrentChange(val) {
		        this.requestData(val,this.amount);
		    },
		    //查看我的套餐
		    sure(){
		    	this.$router.push('/customerCenter/meal')
		    },
		    //关闭弹出框
		    cancel(){
		    	this.isShow = false;
		    }
		}

	}
</script>

<style type="stylesheet/css"  lang="less" scoped>
	#mealList .ContensWrap{
		background: #fff;
		margin: 20px 0 0 20px;
	}
	#mealList .mealList{
		padding-left: 28px;
		padding-top: 33px;
		.pagination{
			margin-top: 20px;
		    overflow: hidden;
		    margin-bottom: 42px;
		    margin-right: 20px;
		    .el-pagination{
		        float: right;
		    }
		}
		ul{
			overflow:hidden;
			li{
				float: left;
				width: 304px;
				height: 268px;
				margin-right: 16px;
				margin-bottom: 30px;
				background: url(../../../assets/images/meal/meal-bac-one.png) no-repeat;
				background-size: 100%;
				h5{
                    padding-left: 28px;
                    padding-top: 18px;
                    font-weight: bold;
                    font-size: 18px;
                    color: #000;
                    margin-bottom: 41px;
                }
                p{
                    padding-left: 27px;
                    font-size: 14px;
                    color: #666666;
                    margin-bottom: 16px;
                }
                .title{
                	text-align: center;
                	font-size: 20px;
                	color: #ff9308;
                	font-weight: bold;
                	margin-bottom: 20px;
                }
                .payment{
                	width: 250px;
                	height: 32px;
                	background: #ff3e08;
                	color: #fff;
                	font-size: 14px;
                	margin-left: 27px;
                	border-radius: 4px;
                }
			}
			li:nth-of-type(5n){
                margin-right: 0;
            }
		}
	}
	#mealList #errBoxWrap{
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
		    background: #fff;
		    margin: 20% 0 0 35%;
		    .tipsContent{
		    	overflow: hidden;
    			height: 162px;
    			padding: 0 36px;
		    }
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
		    width: 48px;
		    height: 48px;
		    background: url("~assets/images/signature/compilt.png") no-repeat;
		    margin: 40px 0 0 40px;
		    display: block;
		    float: left;
		}
		.errorrr{
		    display: inline-block;
		    height: 26px;
		    margin-top: 44px;
		    line-height: 20px;
		    text-align: left;
		    padding-left: 10px;
		    font-size: 16px;
		}
		.errBtn{
		    padding: 0 40px 0 10px;
		    float: left;
		}
		.errBtn .sure{
		    float: left;
		    font-size: 12px;
    		color: #359af8;
    		cursor: pointer;
		}
	}
</style>
