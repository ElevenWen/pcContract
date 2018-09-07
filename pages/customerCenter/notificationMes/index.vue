<template>
	<div id="notificationMes" class="commonWrap">
		<!-- 公共头部 -->
	    <div class="headerWrap"> <topBanner/> </div>
	    <div class="middleWrap">
		    <!-- 左边公共导航 -->
		    <div class="leftNavWrap"><leftNav/></div>
		    <!-- 首页主体内容 -->
		    <div class="ContensWrap">
		    	<header>
		    		<h3>消息</h3>
		    		<button type="button" class="deleteBtn" v-if="isChoose" @click="todelete">删除</button>
		    		<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"  v-if="isChoose" class="chooseAll" @change="handleCheckAllChange">全部选择</el-checkbox>
		    		<span class="appendSign" @click="toChoose">{{btnText}}</span>
		    	</header>
				
				<div class="notificationMes">
					<ul class="notificationMes-list">
						<el-checkbox-group v-model="checkedData" @change="handleCheckedCitiesChange">
							<li v-for="(item,i) in mesData.list">
								<div class="checkB">
									<el-checkbox :label="item.Id" :key="item.Id" v-if="isChoose"></el-checkbox>
								</div>
								<div>{{item}}</div>
								<div class="notificationMes-right" @click="checkMes(item.Id,i)">
									<div class="img">
										<img src="../../../assets/images/meal/mes-unread.png" v-if="!item.IsRead"/>
										<img src="../../../assets/images/meal/mes-read.png" v-if="item.IsRead"/>
									</div>
									<div class="notificationMes-content" :class="item.IsRead ? 'readed' : ''">
										<p>{{item.Title}}</p>
										<div class="content-detail">
											<p class="unread" :class="item.isWidth ? 'active' : ''" v-show="item.IsRead" ref="content">{{item.Content}}</p>
											<span class="checkDetail" v-if="item.IsRead" @click="viewDetails(item.DataId)">查看详情</span>
										</div>
									</div>
									<span class="dateShow">{{item.CreateDate}}</span>
								</div>
							</li>
						</el-checkbox-group>
						
						<!--<li>
							<div class="checkB">
								<el-checkbox v-model="checked" v-if="isChoose"></el-checkbox>
							</div>
							<div class="notificationMes-right">
								<div class="img">
									<img src="../../../assets/images/meal/mes-read.png"/>
								</div>
								<div class="notificationMes-content readed">
									<p>您收到一份来自t_9405fpu97d的《劳动合同》需要签署</p>
									<p class="unread">恭喜，您已成功入驻，点击完成 <span class="btn">实名认证</span> 和 <span class="btn">签章设置</span> ，体验快捷电子合同签署。</p>
								</div>
								<span class="dateShow">2018-07-15</span>
							</div>
						</li>-->
						
						<!--无数据-->
		                <div class="metadata" v-if="mesData.recordCount == 0">
				    		<img src="~assets/images/nodataShow.png"/>
				    		<p>暂时没有消息哦~</p>
				    	</div>
					</ul>
					
					<!--没有更多(当前页为最后一页且有数据)-->
					<div class="noMore" v-if="this.presentPage == this.lastPage && mesData.recordCount != 0">
						已经没有更多消息了
					</div>
					
					<!--分页-->
					<div class="pagination" v-if="mesData.recordCount != 0">
						<el-pagination
					      @size-change="handleSizeChange"
					      @current-change="handleCurrentChange"
					      :current-page.sync="currentPage"
					      :page-sizes="[10, 20, 30, 40]"
					      :page-size="100"
					      layout="total, sizes, prev, pager, next, jumper"
					      :total="mesData.recordCount">
					    </el-pagination>
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
	import {mapActions, mapState,mapGetters } from 'vuex';
	export default{
		data(){
			return{
				checked: false,
				btnText:"选择",
				isChoose:false,//点击选择
				checkedData: [],
				checkAll: false,
				currentPage:1,//默认第几页
				isIndeterminate: true,
				_id:"",//用户id
				mesData:{},//消息
				amount:10,//列表每页显示条数
				ids:[],//记录需要删除的消息id
				presentPage:1,//当前页
				lastPage:1,//最后一页
			}
		},
	  	components: {
	    	leftNav,
    		topBanner,
	  	},
	  	computed:{
		  ...mapGetters({
				notificationData:'notificationMes/notificationMes/notificationData',
				mesInfoContent:'notificationMes/notificationMes/mesInfoContent',
			})
		},
	  	mounted(){
	  		//获取消息数量
		    //获取我的id
			this._id = tool.loadFromLocal("CustomerMesg","ALL").Id;
			
			this.requestData(1,10);
			
			
	  	},
		methods:{
			...mapActions({
				'getMessageInfo':'notificationMes/notificationMes/getMessageInfo',
				'getContractMessageNum':'notificationMes/notificationMes/getContractMessageNum'
			}),
			//获取消息数量
			requestData(num,pageNum){
				let params = {
					id:this._id,
					pageIndex:num,
					pageSize:pageNum
				}
				
			  		getData.getContractMessage(params)
					.then((res)=>{
						
						this.mesData = res.data;
						this.$nextTick(()=>{
							this.mesData.list.forEach((val,i)=>{
								let _value = val.CreateDate.replace(/\D/gi, "");
				  				val.CreateDate = tool.formatDate(_value, "yyyy-MM-dd");
				  				
				  				//获取内容宽度
								if(document.getElementsByClassName('unread')[i].offsetWidth>=700){
									val.isWidth = true;
								}else{
									val.isWidth = false;
								}
							})
						})
						//最后一页
						this.lastPage = Math.ceil(this.mesData.recordCount/this.amount);
						
						let unParams = {
							id:this._id,
						}
						//获取未读消息数量
						this.getContractMessageNum(unParams)
					})
					.catch((error)=>{
						
					})
				
			},
			toChoose(){
				this.isChoose = !this.isChoose;
				switch (this.btnText){
					case "选择":
						this.btnText = "取消";
						break;
					case "取消":
						this.btnText = "选择";
						
						//初始化
						this.checkAll = false;
						//清空数组
			    		this.ids = [];
			    		this.checkedData = [];
						
						break;
					default:
						break;
				}
				
			},
			//页数变化
		    handleSizeChange(val) {
		    	this.currentPage = 1;
		        this.amount  = val;
		    	this.requestData(1,val);
		    },
		    handleCurrentChange(val) {
		    	this.presentPage = val;
		        this.requestData(val,this.amount);
		    },
		    handleCheckedCitiesChange(value) {
		        let checkedCount = value.length;
		        this.checkAll = checkedCount === this.mesData.list.length;
		        this.isIndeterminate = checkedCount > 0 && checkedCount < this.mesData.list.length;
		    },
		    handleCheckAllChange(val) {
		    	//初始化
		    	this.ids = [];
		    	//记录id
		    	for (let i=0;i<this.mesData.list.length;i++) {
	    			this.ids.push(this.mesData.list[i].Id);
	    		}
		    	
		        this.checkedData = val ? this.ids : [];
		        this.isIndeterminate = false;
		    },
		    //查看消息
		    checkMes(id,i){
		    	if(!this.mesData.list[i].IsRead){
		    		let mesParams = {
			    		Id:id
			    	}
			    	this.getMessageInfo(mesParams)
			    	.then(()=>{
			    		let unParams = {
							id:this._id,
						}
						//获取未读消息数量
						this.getContractMessageNum(unParams)
			    	})
			    	//修改为已读并强制重新渲染数据
			    	this.mesData.list[i].IsRead = true;
			    	this.$set(this.mesData.list,i,this.mesData.list[i])
			    	this.$nextTick(()=>{
			    		//获取内容宽度并判断是否超出700
						if(document.getElementsByClassName('unread')[i].offsetWidth>=700){
							this.mesData.list[i].isWidth = true;
							this.$set(this.mesData.list,i,this.mesData.list[i])
						}else{
							this.mesData.list[i].isWidth = false;
							this.$set(this.mesData.list,i,this.mesData.list[i])
						}
			    	})
		    	}
		    },
		    //删除
		    todelete(){
		    	if(this.checkedData.length > 0){
		    		
		    		this.ids = this.checkedData;
		    		this.ids = this.ids.join("|");
		    		
		    		let param = {
			    		Ids:this.ids
			    	}
			    	getData.delMessage(param)
			    	.then((res)=>{
			    		
			    		//是否全选
			    		//计算请求第几页数据
			    		if (this.checkAll && this.presentPage == this.lastPage) {
			    			//更新数据
				    		this.requestData(this.presentPage-1,this.amount);
			    		}else{
			    			//更新数据
				    		this.requestData(this.presentPage,this.amount);
			    		}
			    		
				    	
			    		//清空数组
			    		this.ids = [];
			    		this.checkedData = [];
			    	})
		    	}
		    },
		    //查看详情
		    viewDetails(id){
		    	this.$router.push({path:'/mana/detail',query:{ecId:id}});
		    }
		}
	}
</script>

<style type="stylesheet/css"  lang="less" >
	@import "~assets/less/customerCenter/notificationMes.less";
</style>