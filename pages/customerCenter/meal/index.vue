<template>
	<div id="meal" class="commonWrap">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap">
                <header>
		    		<h3>我的套餐</h3>
		    		<button type="button" class="appendSign" @click="orderNow">立即购买</button>
		    	</header>
		    	
		    	<div class="wrap">
		    		<div class="meal-list">
		    			<ul class="meal-list-content">
		    				<li v-for="val in myMealList" :class="val.State == 0 ? 'active' : ''">
		    					<h5>{{val.Title}}</h5>
		    					<p>有效期至：{{val.ExpireTime}}</p>
		    					<p v-if="val.UseFiles == 0">文件份数：不限份数</p>
		    					<p v-else>文件份数：剩{{val.AvailableFiles}}份/共{{val.Files}}份</p>
		    					<p>模板使用：{{val.TemplateDec}}</p>
		    				</li>
		    				
		    				<!--无数据-->
			                <div class="metadata" v-if="myMealList.length ==0">
					    		<img src="~assets/images/nodataShow.png"/>
					    		<p>您还没有购买套餐哦~</p>
					    		<button type="button" @click="orderNow">立即购买</button>
					    	</div>
		    			</ul>
		    			<!--分页-->
						<div class="pagination" v-if="totalMealList>=10">
							<el-pagination
						      @size-change="handleMealSizeChange"
						      @current-change="handleMealCurrentChange"
						      :current-page.sync="currentPage"
						      :page-sizes="[10,20,30,40]"
						      :page-size="10"
						      layout="total, sizes, prev, pager, next, jumper"
						      :total="totalMealList">
						    </el-pagination>
					    </div>
		    		</div>
		    		
		    		<div class="order-list">
		    			<h4><i></i>订单列表</h4>
		    			<!--表格-->
				    	<div class="customerManage-table">
					    	<el-table :data="tableData" border style="width: 100%">
							    <el-table-column  :index="indexMethod"  label="序号"  width="80" type="index">
							    </el-table-column>
							    <el-table-column  prop="OrderNo"  label="订单编号"  width="260">
							    </el-table-column>
							    <el-table-column  prop="CreateTime"  label="下单时间" width="240">
							    </el-table-column>
							    <el-table-column  prop="Name"  label="套餐名称" width="198">
							    </el-table-column>
							    <el-table-column  prop="Price"  label="支付金额" width="200">
							    </el-table-column>
							    <el-table-column  prop="OrderStatus"  label="支付状态" width="200">
							    </el-table-column>
							    <el-table-column  prop="PayType"  label="支付方式" width="200">
							    </el-table-column>
							    <el-table-column  fixed="right"  label="操作"  width="193">
							      <template slot-scope="scope">
							        <el-button @click="handlePayClick(scope.row)" type="text" size="small" class="payMent" v-if="scope.row.isBuy">去支付</el-button>
							        <el-button @click="handleClick(scope.row)" type="text" size="small" class="buyAgain" v-if="!scope.row.isBuy">再次购买</el-button>
							      </template>
			    				</el-table-column>
							</el-table>

							<!--分页-->
							<div class="pagination" v-if="totalOrderList != 0">
								<el-pagination
							      @size-change="handleSizeChange"
							      @current-change="handleCurrentChange"
							      :current-page.sync="orderListCurrentPage"
							      :page-sizes="[10, 20, 30, 40]"
							      :page-size="100"
							      layout="total, sizes, prev, pager, next, jumper"
							      :total="totalOrderList">
							    </el-pagination>
						    </div>
						</div>
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
	import tool from "~/assets/lib/tool.js";
	export default {
		data(){
			return{
				currentPage:1,//默认第几页
				orderListCurrentPage:1,//订单默认第几页
				tableData: [],//订单列表数据
		        myMealList:[],//我的套餐数据
		        totalMealList:0,//套餐列表总条数
		        totalOrderList:0,//订单列表总条数
		        amount:10,//套餐列表每页显示条数
		        orderAmount:10,//订单列表每页显示条数
		        orderCurrentPage:1,//订单列表当前页
		        _id:"",//用户id
		        isShow:false,//是否显示弹出框
			}
		},
	  	components: {
	    	leftNav,
    		topBanner
	  	},
	  	mounted(){
	  		//获取我的id
	  		this._id = tool.loadFromLocal("CustomerMesg","ALL").Id;
	  		
	  		//获取我的套餐列表
	  		this.requestMealData(1,10);
	  		
	  		//获取订单列表
	  		this.requestOrderData(1,10);
	  	},
	  	methods:{
	  		requestOrderData(num,pageNum){
	  			let params = {
		  			Id:this._id,
		  			pageIndex:num,
		  			pageSize:pageNum
		  		}
	  			//获取我的订单列表
		  		getData.getECPackageList(params)
		  		.then((res)=>{
		  			this.tableData = res.data.list;
		  			this.totalOrderList = res.data.recordCount;
		  			this.tableData.forEach((val)=>{
		  				let _value = val.CreateTime.replace(/\D/gi, "");
		  				val.CreateTime = tool.formatDate(_value, "yyyy-MM-dd hh:mm:ss");
		  				val.Price = "¥"+val.Price;
		  				//支付状态
		  				switch (val.OrderStatus){
				  			case 0:
				  				val.OrderStatus = "待支付";
				  				val.isBuy = true;
				  				break;
				  			case 1:
				  				val.OrderStatus = "已支付";
				  				val.isBuy = false;
				  				break;
				  			case 2:
				  				val.OrderStatus = "支付失败";
				  				val.isBuy = false;
				  				break;
				  			case 3:
				  				val.OrderStatus = "退款中";
				  				val.isBuy = false;
				  				break;
				  			case 4:
				  				val.OrderStatus = "已退款";
				  				val.isBuy = false;
				  				break;
				  			default:
				  				break;
				  		}
		  				
		  				//支付方式
		  				switch (val.PayType){
				  			case 0:
				  				val.PayType = "支付宝";
				  				break;
				  			case 1:
				  				val.PayType = "微信";
				  				break;
				  			case 2:
				  				val.PayType = "银联";
				  				break;
				  			case 3:
				  				val.PayType = "余额";
				  				break;
				  			case 4:
				  				val.PayType = "环迅";
				  				break;
				  			case 5:
				  				val.PayType = "找人代付";
				  				break;
				  			case 6:
				  				val.PayType = "记账币";
				  				break;
				  			default:
				  				break;
				  		}
		  			})
		  		})
		  		.catch((error)=>{
		  			
		  		})
	  		},
	  		requestMealData(num,pageNum){
	  			let params = {
		  			Id:this._id,
		  			pageIndex:num,
		  			pageSize:pageNum
		  		}
	  			//获取我的套餐列表
		  		getData.getMyMealList(params)
		  		.then((res)=>{
		  			this.myMealList = res.data.list;
		  			this.totalMealList = res.data.recordCount;
		  		})
		  		.catch((error)=>{
		  			
		  		})
	  		},
	  		//序号
	  		indexMethod(index) {
	  			let num = index+1+this.orderAmount*(this.orderCurrentPage-1);
	  			num = String(num).length>1 ? num : "0" + num;
		        return num;
		   	},
	  		//立即购买跳转套餐列表
	  		orderNow(){
	  			this.$router.push('/customerCenter/meal/mealList')
	  		},
	  		//订单列表页数变化触发
		    handleSizeChange(val) {
		    	this.orderListCurrentPage = 1;
		        this.orderAmount  = val;
		    	this.requestOrderData(1,val);
		    },
		    //订单列表当前页变化触发
		    handleCurrentChange(val) {
		    	this.orderCurrentPage = val;
		        this.requestOrderData(val,this.orderAmount);
		    },
		    //购买
		    handleClick(tab, event) {
		        let price = tab.Price.substring(1)
		        //购买套餐
				let params = {
					id:tab.PackageId,
					customerId:tab.CustomerId,
					amount:price,
					oldAmount:tab.Amount,
					payType:tab.PayType,
					remark:tab.Remark,
					orderSource:0
				}
				getData.buyECPackage(params)
				.then((res)=>{
					if(res.data.price == 0 || res.data.price == 0.00){
						this.isShow = true;
						this.requestOrderData(1,this.orderAmount);
					}else{
						this.$router.push({path:'/customerCenter/meal/newPayment',query:{id:res.data.out_trade_no}})
					}
				})
				.catch((error)=>{
					this.$message.error(error.data.msg);
				})
		    },
		    //去支付
		    handlePayClick(tab, event){
		    	this.$router.push({path:'/customerCenter/meal/newPayment',query:{id:tab.OrderNo,type:1}})
		    },
		    //套餐列表页数变化触发
		    handleMealSizeChange(val){
		    	this.currentPage = 1;
		    	this.amount  = val;
		    	this.requestMealData(1,val);
		    },
		    //套餐列表当前页变化触发
		    handleMealCurrentChange(val){
		    	this.requestMealData(val,this.amount);
		    },
		    //查看我的套餐
		    sure(){
		    	this.isShow = false;
		    },
		    //关闭弹出框
		    cancel(){
		    	this.isShow = false;
		    }
	  	}
	}
</script>

<style type="stylesheet/css"  lang="less"  >
  @import "~assets/less/customerCenter/meal.less";
</style>