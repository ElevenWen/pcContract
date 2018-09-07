<template>
  <div id="myTempalte" class="myTempalte commonWrap">
    <!-- 公共头部 -->
    <div class="headerWrap"> <topBanner @getSignList="getSignList"/> </div>
    <div class="middleWrap">
      <!-- 左边公共导航 -->
      <div class="leftNavWrap"><leftNav/></div>
      <!-- 主体内容 -->
      <div class="ContensWrap">
        <!-- 我的模板 -->
       <div class="myTempalteWrap" v-if="isMyTemShow">
         <div class="title"><span>我的模板</span></div>
         <div class="serchConditions">
            <span>模板名称</span><input type="text" v-model="searchName" placeholder="请输入模板名称" maxlength="20">
            <span>模板编号</span><input type="text" v-model="searchNumber" placeholder="请输入模板编号" maxlength="50">
            <span>模板分类</span>
            <select v-model="nowClassId">
              <option value="">全部分类</option>
              <option v-for="(classItem, index) in templateClassify" :value="classItem.Id" :key="index">{{classItem.Name}}</option>
            </select>
            <span class="clickSearch" @click="myTemplateDataSearch">查询</span><span class="addNewTemp" @click="addSysTeamTemplateShow">新增模板</span>
         </div>
         <div class="contenTabel">
            <div class="tabelTitle">
              <ul><li>序号</li><li>模板编号</li><li>模板名称</li><li>模板分类</li><li>创建时间</li><li>操作</li></ul>
            </div>
            <div class="tablelistWrap" v-if="myTemplateData.length > 0">
              <ul class="tableList_item" v-for="(tableItem, index) in myTemplateData" :key="index">
                <li>{{(index +1)>=10? (index + 1): '0'+(index + 1)}}</li><li>{{tableItem.TemplateNumber}}</li><li>{{tableItem.TemplateTitle}}</li><li>{{tableItem.TemplateClassName}}</li>
                <li>{{tableItem.CreateTime | formatDateFn}}</li>
                <li>
                  <span @click="useTempaleDetail(tableItem.TemplateId)">使用</span>
                   <a :href="tableItem.WordFilePath">下载</a>
                  <span @click="delMyTempalteItem(tableItem)">删除</span>
                </li>
              </ul>

            </div>
              <!-- 无数据时显示处理 -->
            <div class="tablelistWrap noDataWrap" v-else>
                <img src="~assets/images/nodataShow.png" alt="">
                <p>您还没有模板文件哦~</p>
                <span class="addSysTemp" @click="addSysTeamTemplateShow">通过系统模板添加</span>
            </div>
          </div>
       </div>
       <!-- 系统模板 -->
       <div class="systemTempalteWrap" v-else>
          <div class="title"><span class="back" @click="back">返回</span><span>系统模板</span></div>
          <el-tabs v-model="nowClassId2" type="card" @tab-click="handleClick">
            <el-tab-pane label="全部分类" name=" "></el-tab-pane>
            <el-tab-pane v-for="(classItem, index) in templateClassify" :label="classItem.Name" :name="classItem.Id" :key='index'></el-tab-pane>
          </el-tabs>
          <!-- 搜索 -->
          <div class="serchConditions">
            <input type="text" v-model="searchName2" placeholder="请输入模板名称" maxlength="20">
            <span class="clickSearch" @click="systemTemplateDataSearch">查询</span>
         </div>
          <!-- 表格 -->
          <div class="contenTabel">
            <div class="tabelTitle">
              <ul><li>选择</li><li>模板编号</li><li>模板名称</li><li>模板分类</li><li>创建时间</li><li>操作</li></ul>
            </div>
            <div class="tablelistWrap" v-if="systeamTemplateData.length>0">
              <ul class="tableList_item" v-for="(item, index) in systeamTemplateData" :key="index">
                <li><span class="checkItem " :class="item.IsDelete === true? 'checkActivated':''" @click="checkTemplateItem(item)"></span></li>
                <li>{{item.TemplateNumber}}</li><li>{{item.TemplateTitle}}</li><li>{{item.TemplateClassName}}</li><li>{{item.LastUpdateTime | formatDateFn}}</li>
                <li><span @click="lookTempaleDetail(item.PdfFilePath)">查看</span>
                  <span @click="addMyTemplate(item.Id,item.IsUsed)">{{item.IsUsed?'已领用':'领用'}}</span>
                  <a :href="item.WordFilePath">下载</a>
                </li>
              </ul>

            </div>
              <!-- 无数据时显示处理 -->
            <div class="tablelistWrap" v-else>
                <img src="~assets/images/nodataShow.png" alt="">
                <p>抱歉，未搜索到系统模板哦~</p>
            </div>
          </div>
          <!--分页-->
          <div class="pagination">
            全选
            <span class="checkAll" :class="isCheckAll? 'checkActivated':''" @click="checkPageAll"></span>
            <span @click="addAllToMyTemplate">批量领用</span>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndex"
                :page-sizes="[10, 25, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalList">
              </el-pagination>
            </div>
       </div>
      </div>

    </div>

  <!-- 查看合同弹窗 -->
  <el-dialog
      title="合同信息"
      :visible.sync="lookContratVisible"
      width="70%"
      heigth='800px'
      center
      top="5vh">
      <iframe :src="lookContratUrl"  width="100%" height="780px"></iframe>
    </el-dialog>

  </div>
</template>

<script>

import leftNav from '~/components/leftNav.vue'
import topBanner from '~/components/topBanner.vue'
import tool from "~/assets/lib/tool.js"
import getData from "~/store/ajaxAPI/getData"

export default {
  data(){
    return {
      searchName: '',
      searchName2:'',   //系统模板搜索条件
      searchNumber: '',
      isMyTemShow: true,
      lookContratVisible: false,
      lookContratUrl: '', //查看地址

      pageIndex: 1,  //默认第一页
      pageSize: 10,	 //默认一页10条数据
      totalList: 0 , //总共条数
      
      isOnePoint: false,  //防止全选一个的情况提示
      isCheckAll: false,  //是否全选
      checkListDataParmaStr: '', //选中

      nowClassId: '',			//当前分类id
      nowClassId2: ' ',    //系统当前分类id
      templateClassify: [],	  //模板分类
      myTemplateData:[],      //我的模板列表数据
      systeamTemplateData:[],  //我的模板列表数据
      signListData:[], 

      localStorageUser:''
    }
  },
  components: {
    leftNav,
    topBanner

  },
  mounted (){
    this.localStorageUser = JSON.parse(window.localStorage.getItem('CustomerMesg'));

    this.__getTemplateClass();
    this.__getCustomerTemplateList();
  },
   methods: {
//-------数据获取-------
    getSignList(data){ //由头部组件发送请求传值 调用
       this.signListData = data;
     },
    //获取模板分类列表
    __getTemplateClass(){
      getData.GetTemplateClass()
      .then(res=>{
        this.templateClassify = res.data.list;
      })
    },
    //获取我的模板
    __getCustomerTemplateList(){
      var param = {
        Id: this.localStorageUser.Id,
        TempClassId: this.nowClassId,
        TempName: this.searchName,
        TempNumber: this.searchNumber,
        pageIndex: 1,
				pageSize: 1000
      }
      getData.getCustomerTemplateList(param)
      .then(res=>{
        this.myTemplateData = res.data.list;
      })

    },
    //获取系统模板列表
			__getContractTemplateList(){
				var param = {
					ClassId: this.nowClassId2,
					CusId: this.localStorageUser.Id,
          keyword: this.searchName2,
          pageIndex: this.pageIndex,
					pageSize: this.pageSize
				}
				getData.getContractTemplateList(param)
				.then(res=>{
          this.systeamTemplateData = res.data.list;
          this.totalList = res.data.recordCount;
					//console.log('合同模板列表',res.data)
				})
			},

   //------页面控制------------
     addSysTeamTemplateShow(){
       this.isOnePoint = false;
       this.isMyTemShow = false;
       this.__getContractTemplateList();
     },
     back(){
       //this.$router.back(-1);
      this.isMyTemShow = true;
      this.__getCustomerTemplateList();
      },
      //我的模板搜索
      myTemplateDataSearch(){
        this.__getCustomerTemplateList()
        //console.log(this.nowClassId)
      },
       //系统模板搜索
      systemTemplateDataSearch(){
        this.__getContractTemplateList();
      },
      //使用模板详情跳转
      useTempaleDetail(tempId){
        if(this.signListData.length>0){
          this.$router.push({path:'/mana/create/template',query:{id:tempId,type:0}})
        }else{
          this.$confirm('你还没有可用签章，是否去申请?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push('/customerCenter/signature')
            }).catch(()=>{})
        }
        
      },
      //查看模板详情跳转
      lookTempaleDetail(path){
        //this.$router.push({path:'/mana/detail',query:{Id:tempId}})
        this.lookContratUrl = path;
        this.lookContratVisible = true;
      },
      //删除我的模板
      delMyTempalteItem(delItem){
        var param = {
          Id: delItem.Id
        }
        this.$confirm(`是否删除" ${delItem.TemplateTitle} "模板?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //此处 还需调用删除合同接口
            getData.delMyContractTemplate(param)
            .then(res=>{
              //console.log('删除成功',res.data)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.__getCustomerTemplateList(); //重新 更新页面数据
            })

          })
      },
      //领用系统模板
      addMyTemplate(id,isAdd){
        if(isAdd){
           this.$message({
            message: '已领用！',
            type: 'warning'
          });
          return
        }
        var parma ={
          CusId: this.localStorageUser.Id,
          Ids: id
        }
        getData.addMyTemplate(parma)
        .then(res=>{
            this.$message({
              message: '领用成功！',
              type: 'success'
            });
            this.__getContractTemplateList();//刷新数据
        })
      },
      //领用当前全部系统模板
      addAllToMyTemplate(){
        if(!this.checkListDataParmaStr){
          this.$message({
            message: '请先选择一个或多个要领用的模板！',
            type: 'warning'
          });
          return
        }
        if(this.isOnePoint){
          this.$message({
            message: '当前已领用 不需重复领取！',
            type: 'warning'
          });
          return
        }
        var parma ={
          CusId: this.localStorageUser.Id,
          Ids: this.checkListDataParmaStr
        }
        getData.addMyTemplate(parma)
        .then(res=>{
            this.$message({
              message: '领用成功！',
              type: 'success'
            });
            //刷新数据 及重置
            this.__getContractTemplateList();
            this.isCheckAll = false;
            this.isOnePoint = false;
            this.checkListDataParmaStr = '';
        })
      },
      //系统模板tab 切换
       handleClick(tab) {
        //console.log(tab.name,'~~~~',this.nowClassId2);
        this.__getContractTemplateList();
        //重置
        this.isCheckAll = false;
        this.checkListDataParmaStr = '',
        this.isOnePoint = false;
        this.systeamTemplateData.forEach(ele=>{
          ele.IsDelete = false;
        })

      },
      //选择id 参数形成
      checkTemplateItem(arrItem) {
        arrItem.IsDelete = !arrItem.IsDelete;
        const isTrueFn = value => value.IsDelete == true;
        var checkArr = this.systeamTemplateData.filter(isTrueFn);
        
        var checkStrArr = [];
        if (checkArr.length > 0) {      
          checkArr.forEach(element => {
            checkStrArr.push(element.Id);
           
          });
          this.checkListDataParmaStr = checkStrArr.join("|");
          //console.log('选择参数字符串',this.checkListDataParmaStr);
          // console.log('选择的数组',checkArr,this.isOnePoint);         
        } else {       
          this.checkListDataParmaStr = '';
          this.isOnePoint = false;
        }
          //是否 有领取了的
          
          for(var i =0; i<this.systeamTemplateData.length;i++){
            if(this.systeamTemplateData[i].IsDelete && this.systeamTemplateData[i].IsUsed){
              this.isOnePoint = true;
              return
            }else{
              this.isOnePoint = false;
            }
          }
        
      },
      //当前页全选
      checkPageAll(){
        this.isCheckAll = !this.isCheckAll;
        if(this.isCheckAll){
          var checkAllArr = [];
          this.systeamTemplateData.forEach(ele=>{
            ele.IsDelete = true;
            checkAllArr.push(ele.Id)
            
          });       
          this.checkListDataParmaStr = checkAllArr.join("|");
          // console.log('选择参数字符串',this.checkListDataParmaStr);
           //是否 全都是领取了的
           var ischecAllArr = [];
          for(var i =0; i<this.systeamTemplateData.length;i++){
            if(this.systeamTemplateData[i].IsUsed  === true){
              ischecAllArr.push(this.systeamTemplateData[i])
            }
          }
          if(ischecAllArr.length === this.systeamTemplateData.length ){
            this.isOnePoint = true;
          }else{
            this.isOnePoint = false;
          }
        }else{
          this.isOnePoint = false;
          this.checkListDataParmaStr = '',
          this.systeamTemplateData.forEach(ele=>{
            ele.IsDelete = false;
          })
          // console.log('选择参数字符串',this.checkListDataParmaStr);
        }
      },

      //页数变化 控制
      handleSizeChange(val) {
        this.pageIndex = 1;
        this.pageSize = val;
        this.__getContractTemplateList();
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.__getContractTemplateList();
         // console.log(`当前页: ${val}`);
      },
    },
     filters: {
      formatDateFn: value => {
        value = parseInt(value.toString().slice(6));
        return tool.formatDate(value,"yyyy-MM-dd hh:mm:ss");
      }

    }
}
</script>

<style type="stylesheet/css"  lang="less" scoped>
  @import "~assets/less/myTemplate.less";
</style>
