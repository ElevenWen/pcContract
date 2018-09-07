<template>
  <div class="homeWrap commonWrap">
    <!-- 公共头部 -->
    <div class="headerWrap"> <topBanner @getUserInfoData="getUserInfoData" @getSignList="getSignList"/> </div>
    <div class="middleWrap">
      <!-- 左边公共导航 -->
      <div class="leftNavWrap"><leftNav/></div>
      <!-- 首页主体内容 -->
      <div class="ContensWrap">
        <div class="topConten">
          <div class="myContractFile">
            <div class="title"><span class="name">我的合同文件</span> </div>
            <ul>
              <li><div class="circular" @click="toMyContra('1')">{{contractStateNums.MeSign? contractStateNums.MeSign:'-'}}</div> <span>待我签署</span></li>
              <li><div class="circular" @click="toMyContra('2')">{{contractStateNums.HeSign? contractStateNums.HeSign:'-'}}</div> <span>待他人签署</span></li>
              <li><div class="circular" @click="toMyContra('3')">{{contractStateNums.SuccSign? contractStateNums.SuccSign:'-'}}</div> <span>已完成签署</span></li>
              <li><div class="circular" @click="toMyContra('4')">{{contractStateNums.Refused? contractStateNums.Refused:'-'}}</div> <span>已驳回</span></li>
            </ul>
          </div>

          <div class="creatContra">
            <div class="title"><span class="name">快速创建合同</span> </div>
           <!--  <div class="progress" :style="{width:'300px', height:'5px', backgroundImage:'linear-gradient(to right,#C0C7CB 0%,#C0C7CB '+progress+',#E1E6E9 '+progress+',#E1E6E9 100%)'}">
            </div> -->
            <div class="controls">
              <div class="update" @click="creatContraUpload($event)">上传文件
                <input type="file" id="file" @change="creatContraUpload($event)" v-if="signListData.length>0" accept=".doc,.docx,.pdf"/>
              </div>
              <div class="useContra" @click="creatContraTemplate">使用模板</div>
              <img src="~assets/images/home/right_bg.png" alt="" class="right_bg">
            </div>
          </div>

          <div class="userMessge">
            <div class="title"><span class="name">用户信息</span> </div>
            <div class="content">
              <div class="messge">
                <img :src="contractUserInfo.HeadPicPath" alt="" class="headerPortrait" v-if="contractUserInfo.HeadPicPath">
                <img src="~assets/images/home/toux.png" alt="" class="headerPortrait" v-else>
                <div class="des">
                  <p v-if="!isAuthentication"><span class="name">{{contractUserInfo.Nickname? contractUserInfo.Nickname:contractUserInfo.Account}}</span> <span class="state" @click="personSig">未认证</span></p>
                  <p v-else><span class="name">{{sigTrueName}}</span> <span class="state">已认证</span></p>
                  <p><span class="phone">{{contractUserInfo.Mobile}}</span> <span class="modify" @click="toRouter('/customerCenter/revisePhone')">修改</span></p>
                  <p><span class="email" v-if="contractUserInfo.Email">{{contractUserInfo.Email}}</span><span class="mailBox" @click="toRouter('/customerCenter/reviseEmail')">{{(contractUserInfo.Email && contractUserInfo.IsEmailVerification === 1)? '修改':'绑定邮箱'}}</span> </p>
                </div>
              </div>
              <div class="twoBtn">
                <span class="bt_userMsg" @click="toRouter('/customerCenter')">用户信息</span>
                <span class="myTaocan" @click="toRouter('/customerCenter/meal')">我的套餐</span>
              </div>
            </div>
          </div>
        </div>
        <div class="bottomConten">
          <div class="latelyFile">
            <div class="title"><span class="name">最近文件</span> <span class="more" @click="toRouter('/mana/list')">查看更多&gt;</span></div>
            <div class="contenTabel">
              <div class="tabelTitle">
                <ul><li>序号</li><li>文件名称</li><li>发起人</li><li>发起时间</li><li>文件状态</li><li>操作</li></ul>
              </div>
              <div class="tablelistWrap" v-if="contractListData.length>0">
                <ul class="tableList_item" v-for="(tableItem, index) in contractListData" :key="index">
                  <li>{{index > 8 ? (index + 1) : '0' + (index + 1)}}</li>
                  <li>{{tableItem.Name}}</li>
                  <li>{{tableItem.CreateCustomerName }}</li>
                  <li>{{tableItem.CreateTime | formatDateFn}}</li>
                  <li>{{tableItem.SignedState | fileStateFn(tableItem.signer)}}</li>
                  <li>
                    <span class="look" v-if="tableItem.SignedState != 0" @click="toSignedDetail(tableItem.Id,tableItem)">查看</span>
                    <span v-if="tableItem.SignedState === 0" @click="editSign(tableItem.Id,tableItem.Type)">编辑</span>
                    <span v-if="tableItem.SignedState === 1 && tableItem.signer === 0" @click="signContra(tableItem.Id)">签署</span>
                    <span v-if="tableItem.SignedState === 1 && tableItem.signer === 1" @click="againSign(tableItem)">催签</span>
                    <span v-if="tableItem.SignedState === 4 || tableItem.SignedState === 0" @click="deleSign(tableItem.Id)">删除</span>
                    <a :href="tableItem.DownloadUrl"  target="_blank" v-if="tableItem.SignedState === 2">下载</a>
                    <span v-if="tableItem.SignedState === 3" @click="lookReason(tableItem.Remark)">原因</span>
                  </li>
                </ul>
              </div>
              <!-- 无数据时显示处理 -->
              <div class="tablelistWrap noTableData" v-else>
                <img src="~assets/images/nodataShow.png" alt="">
                <p>您还没有合同文件哦~</p>
              </div>
            </div>
          </div>

          <div class="twoOtherWrap">
            <div class="labelManege">
              <div class="title"><span class="name">签章管理</span> <span class="more" @click="toRouter('/customerCenter/signature')">查看更多&gt;</span></div>
              <div class="content" v-if="signListData.length>0">
                <el-carousel :interval="3000" arrow="always">
                  <el-carousel-item v-for="(item ,index) in signListData" :key="index">
                    <div class="showImg" :class="item.Type ===1? 'gsbg':'grbg'">{{item.Type === 1? item.CompanyName : item.TrueName}}</div>
                  </el-carousel-item>
                </el-carousel>
               <!--  <span class="left_btn">	</span>
                <span class="right_btn"></span> -->
                <!-- <p> 1/3 </p> -->
              </div>
              <div class="content noDataConten" v-else>
                <img src="~assets/images/nodataShow.png" alt="" class="noImg">
                <p class="nodataDes">您还没有可用签章哦~</p>
              </div>
            </div>
            <div class="otherApply">
              <div class="title"><span class="name">其他应用</span> </div>
              <ul>
                <li><a href="https://www.wqbol.com" target="_blank"><div class="icon"><img src="~assets/images/home/wqb_pt.png" alt=""></div><span>微企宝平台</span></a></li>
                <!-- <li><a href="/" target="_blank"><div class="icon"><img src="~assets/images/home/dzfp.png" alt=""></div><span>电子发票</span></a></li> -->
                <li><a href="https://www.wqbol.com/productList?typeIndex=0&productName=All" target="_blank"><div class="icon"><img src="~assets/images/home/yjz.png" alt=""></div><span>云记账</span></a></li>
                <li><a href="https://www.wqbol.com/productDetails/cbf7ea00-20fe-4053-89a4-58275567551a/0" target="_blank"><div class="icon"><img src="~assets/images/home/ydz.png" alt=""></div><span>云代账</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>

   <!--  驳回原因弹窗 -->
   <showReasonDialog :dialogVisible="showReason" :reasonText="reasonText" @colseReasonDialog="coloseDialogs"/>
   <useContractTemplate :dialogVisible="dialogVisible2" @closeDialog="coloseDialogs"/>
   <uploadProgress :dialogVisible="isShowUploadPress" :tageProgress="progress"  @toClosePress="coloseDialogs"/>


  </div>
</template>

<script>
import leftNav from '~/components/leftNav.vue'
import topBanner from '~/components/topBanner.vue'
import showReasonDialog from '~/components/showReasonDialog.vue'
import useContractTemplate from '~/components/useContractTemplate.vue'
import uploadProgress from '~/components/uploadProgress.vue'
import { getDataPort } from '~/store/ajaxAPI/perPort.js'
import getData from "~/store/ajaxAPI/getData"
import tool from "~/assets/lib/tool.js"
import axios from 'axios'

export default {
  data(){
    return {
       imageUrl: '',
       ishavaeDate: true,      //模拟是否有列表数据
       isAuthentication: false,//是否已认证的个人签章
       sigTrueName: '',       //认证后的认证名字
       isShowUploadPress: false, //上传显示
       progress: 0,              //上传进度

       signListData: [],       //可用签章列表
       contractListData: [],   //合同列表
       localStorageUser: '',  //本地存储用户信息
       contractUserInfo:'',   //合同用户信息
       contractStateNums: '',
       showReason: false,     //合同驳回原因 弹窗
       reasonText:'',         //合同驳回原因
       dialogVisible2: false, //使用模板弹窗 显示

       mockCustomer: {"Id":"2029f83e-2254-4feb-a546-b0459e50e0c5","Mobile":"13000000011","Password":"hJODYUfYcc8=","ReturnUrl":"/","Token":"18994D15B5EF927E1AA786275CD1704B9F918FA3FB83C0B1B5039602BE422D5B1D7C7B2FEDF4972BA4266B4F8343D997D27A3BB2D1A02509E478491FDBD4973D5006F1498E964C2C2A12F1CA4A670502125BB0A5D534873D3AFFE2E7D90C451ED49AB40D8D456C503DC63F5E34B340F38BC018C4A43ED3A7F62D93CC71A8C1100FA10E1B9F3FF9A47B8958874C8DA4B0DDB7850274F0B754331D2256CA30A435","LastLoginTime":"/Date(1532326285597)/","ActivityStartTime":"/Date(1514736000000)/","ActivityEndTime":"/Date(1525103940000)/"}

    }
  },
  components: {
    leftNav,
    topBanner,
    showReasonDialog,
    useContractTemplate,
    uploadProgress
  },
  created(){

  },
  mounted(){
  	//模拟登录信息
    //tool.saveToLocal('CustomerMesg',this.mockCustomer)
    //开始
    this.localStorageUser = JSON.parse(window.localStorage.getItem('CustomerMesg'));
    if (this.localStorageUser.Id) {
      //获取合同状态数量
      this.__getContractNumber();
      //获取签章列表 判断是否有可用签章
      //this.__getSignList();

      //获取合同列表
      this.__getContractList();
    }

  },
   methods: {
//---数据获取
     __getContractNumber(){
       var parma = {
         Id: this.localStorageUser.Id
       }
       getData.getContractNumber(parma)
       .then(res=>{
         this.contractStateNums = res.data;
       })
     },
     /* __getSignList(){
       let param = {
          Type : '',
          State:1//可用
      }
       getData.signList(param)
       .then(res => {
         this.signListData = res.data;
         this.signListData.forEach(element => {
           if(element.Type === 0){
              this.isAuthentication = true;
              return
           }
         });
       })
     }, */
     __getContractList(){
       var parma = {
         Id: this.localStorageUser.Id,
         //pageSize: 50
       }
        getData.getContractList(parma)
        .then(res =>{
          this.contractListData = res.data.list;
          //consoleconsole.log('合同列表：',res.data.list)
        })
     },
     getUserInfoData(data){
       this.contractUserInfo = data;
     },
     getSignList(data){ //由头部组件发送请求传值 调用
       this.signListData = data;
       this.signListData.forEach(element => {
           if(element.Type === 0 && element.ReviewState ===1){
             //确定个人签章及已审核状态
              this.isAuthentication = true;
              this.sigTrueName = element.TrueName;
              return
           }
         });
     },
//---路由跳转处理
      toRouter(path){
        this.$router.push(path)
      },
      personSig(){
        this.isAuthentication?  ''  : this.$router.push('/customerCenter/signature/personalCertification')
      },
      creatContraUpload(even){
        if(this.signListData.length>0){//有签章
          let files = even.target.files || even.dataTransfer.files;
          if(!files.length) return;
              if(files[0].type.indexOf('application') < 0){
            this.$message.error('上传必须为文档文件!');
            return false;
          }
          this.isShowUploadPress = true;
          var flieName = files[0].name.split(".")[0];
          window.sessionStorage.setItem('_updlodFlieName', flieName);

          var form = new FormData()
          form.append('file', files[0])
          form.append('Token',this.localStorageUser.Token)
          form.append('type', 'merchantContract')
          var config = {
              onUploadProgress: progressEvent => {
                  //var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
                  var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
                  this.progress = complete  * 1 //100

              }
          }
          axios.post(`${getDataPort}/Upload/Save`,form, config)
            .then((res) => {
                //console.log('上传成功',res.data)
                var resPath = res.data.data.storeResult.path;
                window.sessionStorage.setItem('_updlodResultLookPath', resPath);

                this.isShowUploadPress = false;
                this.$router.push('/mana/create/upload')
          })

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
      creatContraTemplate(){
        if(this.signListData.length>0){
          this.dialogVisible2 = true;
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
      toMyContra(type){
        this.$router.push({path:'/mana/list',query:{type:type}})
      },
      toSignedDetail(id,item){
        if(item.SignedState===1 && item.signer ===1){
          this.$router.push({path:'/mana/detail',query:{Name:'waitForThey',ecId:id}})
        }else{
          this.$router.push({path:'/mana/detail',query:{ecId:id}})
        }
      },
  //---页面效果控制
      //编辑草稿状态 合同
      editSign(sigId,goPageType){
        if(goPageType === 1){
          this.$router.push({path:'/mana/create/upload',query:{Id:sigId}})
        }else{
          this.$router.push({path:'/mana/create/template',query:{id:sigId,type:1}})
        }
      },
      //签署合同
      signContra(id){
        if(this.signListData.length>0){//有签章
            this.$router.push("/mana/chooseSignature?ecId=" + id)
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
      //催签 按钮
      againSign(item){
        this.$confirm('是否提醒对方 尽快签署?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //此处 还需调用催签接口
            var params ={
              Id: item.Id,
              CusId: this.localStorageUser.Id,
              State: 3
            }
            getData.SignContract(params)
              .then(res=>{
                this.$message({
                  type: 'success',
                  message: '消息发送成功!'
                });
             }).catch(err=>{
               this.$message.error(err.data.msg);
             })

          }).catch(()=>{})
      },
      //删除合同
      deleSign(constraId){
        var param = {
          Id: constraId
        }
        this.$confirm('此操作将永久删除该合同, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //此处 还需调用删除合同接口
            getData.DelContract(param)
            .then(res=>{
              //console.log('删除成功',res.data)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.__getContractList(); //重新 更新页面数据
            })

          })
      },
      lookReason(Remark){
        /* var params = {
          Id:sigId,
          CustomerId: this.contractUserInfo.Id
        }
        getData.getContractDetail(params)
        .then(res=>{
           //.log('合同详情',res.data)
           this.reasonText = res.data.Remark;
           this.showReason = true;
        })    */
        this.reasonText = Remark;
        this.showReason = true;
      },
      coloseDialogs(){
        this.showReason = false;
        this.dialogVisible2 = false;
        this.isShowUploadPress = false
      },

    },
    filters: {
      formatDateFn: value => {
        value = parseInt(value.toString().slice(6));
        return tool.formatDate(value,"yyyy-MM-dd hh:mm:ss");
      },
      fileStateFn: (value1,value2) =>{
        switch(value1)
          {//tableItem.SignedState | fileStateFn(tableItem.signer)
          case 0:
            return '草稿'
            break;
          case 1:
            if(value2 === 0){
              return '待我签'
            }else if(value2 === 1){
               return '待他签'
            }else{
              return '待签署'
            }
            break;
          case 2:
            return '已完成'
            break;
          case 3:
            return '已驳回'
            break;
          case 4:
            return '已撤回'
            break;
          default:
            return false;
          }
      }


    }
}
</script>

<style scoped lang="less">
  @import "~assets/common/index.less";
  @import "~assets/less/home.less";
</style>
