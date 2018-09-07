<template>
  <div class="ContensWrap" id="uploadContract">
    <div class="title"><span class="back" @click="$router.back(-1)">返回</span><span>创建合同</span></div>
    <div class="formConten" >
      <div class="formWarpOne">
        <div class="contratName">
          <span class="piont">*</span><span class="name">合同名称</span> <input type="text" placeholder="请输入合同名称" v-model="contracName">
        </div>
        <div class="lookAndUpload">
          <div class="showImg">
           <!--  <img :src="suolImgOneUrl" alt=""> v-loading="formLoading" -->
           <canvas id="theCanvas" ref="theCanvas" width="130" height="166"></canvas>
            <!-- <div>共{{suolImg.length}}页</div> -->
          </div>
          <div class="btn btn_look" @click="lookContratVisible = true">查看合同</div>
          <div class="btn btn_upload">重新上传
            <input type="file" id="file" accept=".doc,.docx,.pdf" @change="uploadContrat"/>
          </div>
        </div>
      </div>
      <div class="formWrapTwo">
        <h2>签署人信息</h2>
        <div class="jia_fang">
          <div class="head_title"><span class="icon"></span><span>甲方信息</span></div>
          <div class="contenTabel">
              <div class="tabelTitle">
                <ul><li>签署人姓名/企业名称</li><li>手机号</li><li>操作</li></ul>
              </div>
              <div class="tablelistWrap">
                <ul class="tableList_item">
                  <li v-if="PartyADate.Id">{{PartyADate.Type === 1? PartyADate.CompanyName:PartyADate.ContactName}}</li>
                  <li v-else>
                    <el-dropdown trigger="click"  @command="checkAddTwoType_A" >
                        <span class="el-dropdown-link">
                          添加<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command='1'>添加签署人</el-dropdown-item>
                          <el-dropdown-item divided command='2'>从客户中添加</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                  </li>
                  <li v-if="PartyADate.Id">{{PartyADate.ContactMobile}}</li><li><span v-if="PartyADate.Id" @click="clearTableItem('A')">清除</span></li>
                </ul>
              </div>
          </div>
        </div>

        <div class="yi_fang">
           <div class="head_title"><span class="icon"></span><span>乙方信息</span></div>
            <div class="contenTabel">
                <div class="tabelTitle">
                  <ul><li>签署人姓名/企业名称</li><li>手机号</li><li>操作</li></ul>
                </div>
                <div class="tablelistWrap">
                  <ul class="tableList_item">
                    <li v-if="PartyBDate.Id">{{PartyBDate.Type === 1? PartyBDate.CompanyName:PartyBDate.ContactName}}</li>
                    <li v-else>
                      <el-dropdown trigger="click"  @command="checkAddTwoType_B">
                          <span class="el-dropdown-link">
                            添加<i class="el-icon-caret-bottom el-icon--right"></i>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command='1'>添加签署人</el-dropdown-item>
                            <el-dropdown-item divided command='2'>从客户中添加</el-dropdown-item>
                          </el-dropdown-menu>
                      </el-dropdown>
                    </li>
                    <li v-if="PartyBDate.Id">{{PartyBDate.ContactMobile}}</li><li><span v-if="PartyBDate.Id" @click="clearTableItem('B')">清除</span></li>
                  </ul>
                </div>
            </div>
        </div>
      </div>

      <div class="twoBtn">
        <div class="sendContract" @click="addMerchantContract(1)">发送合同</div>
        <div class="saveDraft" @click="addMerchantContract(0)">存草稿</div>
      </div>

    </div>
    <!-- 弹窗集合 -->
    <addCompanyOrUser :dialogVisible="dialogVisible"   @getAddData = "getAddData" @colseAddDialog="colseAddDialog"></addCompanyOrUser>
    <myUserDialog :dialogVisible="dialogVisible2"   @getSeacheData = "getSeacheData" @colseSeacheDialog="colseSeacheDialog"/>
     <el-dialog
      title="合同信息"
      :visible.sync="lookContratVisible"
      width="70%"
      heigth='800px'
      center
      top="5vh">
      <iframe :src="lookContratUrl"  width="100%" height="780px"></iframe>
    </el-dialog>
    <el-dialog
      title="温馨提示"
      :visible.sync="isSendOrSaveTrue"
      width="378px"
      heigth='237px'
      center
      top="15vh">
        <div class="tipsContent">
            <div>
                <img src="~assets/images/signature/error.png" alt="" class="errorImg">
                <span class="errorrr">确认发送合同</span>
            </div>
            <div class="errBtn">
                <div @click="onlySendConstrat(1)" class="sure">确定</div>
                <div @click="isSendOrSaveTrue = false" class="cancel">取消</div>
            </div>
        </div>
    </el-dialog>
    <uploadProgress :dialogVisible="isShowUploadPress" :tageProgress="progress"  @toClosePress="coloseDialogs"/>
    <div class="loadingCircle" v-show="formLoading">
        	<div id="signLoading"></div>
    </div>
  </div>
</template>

<script>
import addCompanyOrUser from '~/components/customerManage/addCompanyOrUser.vue';
import myUserDialog from '~/components/customerManage/myUserDialog.vue';
import uploadProgress from '~/components/uploadProgress.vue'
import tool from "~/assets/lib/tool.js"
import getData from "~/store/ajaxAPI/getData"
import { getDataPort } from '~/store/ajaxAPI/perPort.js'
import axios from 'axios'

export default {
  layout: "ec",
  name: "mana-create-upload",

  head() {
    return {
      title: "创建合同 - 微企宝",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "上传文件创建合同"
        }
      ]
    };
  },
  data() {
    return {
      dialogVisible: false, //添加弹窗
      dialogVisible2: false, //搜索弹窗
      lookContratVisible: false,  //查看合同
      isSendOrSaveTrue: false,     //确认发送提示
      isShowUploadPress: false,   //上传显示
      progress: 0,              //上传进度
      formLoading: false,     //发送中

      contracId: '',  //当前合同id
      contracName: '',//合同名字
      suolImg:[],     //缩略图
      suolImgOneUrl: '',  //缩略图url
      lookContratUrl: "", //查看合同
      olineLookContratUrl: '', //在线预览
      //https://api.wqbol.net/Upload/idCard/2029f83e-2254-4feb-a546-b0459e50e0c5/e062b1a8-4f9c-4973-bf50-099509569c42.pdf

      aOrbAddParty: 'A',  //默认选择添加甲方信息
      PartyADate: {}, //甲方信息
      PartyBDate: {}, //乙方信息

      localStorageUser:''
    };
  },
  created() {},
  mounted() {
     this.localStorageUser = JSON.parse(window.localStorage.getItem('CustomerMesg'));
     //带有id 合同编辑跳转过来处理
     if(this.$route.query.Id){
       this.contracId = this.$route.query.Id;
       var parma = {
         Id: this.contracId,
         CustomerId: this.localStorageUser.Id
       }
       getData.getContractDetail(parma)
       .then(res=>{
         this.contracName = res.data.Name;
         this.suolImg = res.data.Imgs;
         //目前后台未转图片处理 占时不能用这字段
         //this.suolImgOneUrl = res.data.Imgs[0].ECImage;
         this.lookContratUrl = res.data.DownloadUrl;
         
         this.PartyADate.Id = res.data.SignerId1;
         this.PartyADate.Type = 0;
         this.PartyADate.ContactName = res.data.SignCusName1;
         this.PartyADate.ContactMobile = res.data.SignCusMobile1;

         this.PartyBDate.Id = res.data.SignerId2;
         this.PartyBDate.Type = 0;
         this.PartyBDate.ContactName = res.data.SignCusName2;
         this.PartyBDate.ContactMobile = res.data.SignCusMobile2;

         //console.log('合同详情',res.data)
       })
     }else{
      //从首页或者 头部 “上传文件”
      this.contracName = window.sessionStorage.getItem('_updlodFlieName')
      let sessionPath = window.sessionStorage.getItem('_updlodResultLookPath') || '';
      if(sessionPath){
          this.lookContratUrl = sessionPath
          this.suolImgOneUrl = sessionPath
          this.contracName = window.sessionStorage.getItem('_updlodFlieName')
          this.retrunCavasImg();
      }
     }
     //监听
     this.$watch('lookContratUrl', this.retrunCavasImg)
  },
  destroyed() {},
  methods: {
    //发送及存草稿合同  0存草稿  1发送
    addMerchantContract(state,isend){
      let  loadingInstance =  this.$loading({ fullscreen: false,target:document.getElementById('signLoading'),background: 'rgba(0, 0, 0, 0.7)'});//loading 加载样式
      if(!this.contracName){
        this.$message.error('合同名称不能为空！');
        return
      }
     
      if(state === 1){
         if(!this.PartyADate.Id || !this.PartyBDate.Id){
            this.$message.error('请检查签署人信息不能为空！');
            return
          }
        this.isSendOrSaveTrue = true;
      }else{
        this.formLoading = true;
          var parmas = {
            Id: this.localStorageUser.Id,
            Name: this.contracName,
            State: state,
            SignerAId: this.PartyADate.Id,
            SignerBId: this.PartyBDate.Id,
            Type: 1,
            ContractId: this.contracId,
            ContractTemplateUrl: this.lookContratUrl
          }
          getData.addMerchantContract(parmas)
          .then(res=>{
            //console.log('保存活发送成功',res.data)
            this.formLoading = false;
             loadingInstance.close();
            this.$message({
              message: `${state === 0? '存储草稿' : '发送'}成功！`,
              type: 'success'
            });
            if(this.PartyADate.ContactMobile == this.localStorageUser.Mobile || this.PartyBDate.ContactMobile == this.localStorageUser.Mobile){
              ///mana/chooseSignature?ecId=27ae62f4-5209-48e6-8e90-e27ae8f22ebb
              if(state === 1){
                this.$router.push({path:'/mana/chooseSignature',query:{ecId:res.data.Id}})
              }else{
                //状态 --保存草稿
                this.$router.push('/mana/list')
              }  
            }else{
              this.$router.push('/mana/list')
            }


          })
          .catch(err=>{
            //this.$message.error(err.msg);
            this.formLoading = false;        
             loadingInstance.close();
            this.$message({
              showClose: true,
              message: err.data.msg,
              type: 'error',
              
            });
          })
      }
    

    },
    onlySendConstrat(state){
      let  loadingInstance =  this.$loading({ fullscreen: false,target:document.getElementById('signLoading'),background: 'rgba(0, 0, 0, 0.7)'});//loading 加载样式
       this.isSendOrSaveTrue = false;
       this.formLoading = true;
          var parmas = {
            Id: this.localStorageUser.Id,
            Name: this.contracName,
            State: state,
            SignerAId: this.PartyADate.Id,
            SignerBId: this.PartyBDate.Id,
            Type: 1,
            ContractId: this.contracId,
            ContractTemplateUrl: this.lookContratUrl
          }
          getData.addMerchantContract(parmas)
          .then(res=>{
            //console.log('保存活发送成功',res.data)
            this.formLoading = false;
            loadingInstance.close();
            this.$message({
              message: `${state === 0? '存储草稿' : '发送'}成功！`,
              type: 'success'
            });
            if(this.PartyADate.ContactMobile == this.localStorageUser.Mobile || this.PartyBDate.ContactMobile == this.localStorageUser.Mobile){
              ///mana/chooseSignature?ecId=27ae62f4-5209-48e6-8e90-e27ae8f22ebb
              if(state === 1){
                this.$router.push({path:'/mana/chooseSignature',query:{ecId:res.data.Id,form: 'create'}})
              }else{
                this.$router.push('/mana/list')
              }  
            }else{
              this.$router.push('/mana/list')
            }


          })
          .catch(err=>{
            //this.$message.error(err.msg);
            this.formLoading = false;        
             loadingInstance.close();
            this.$message({
              showClose: true,
              message: err.data.msg,
              type: 'error',
              
            });
          })
    },
    checkAddTwoType_A(command){
      this.aOrbAddParty = 'A';
      if(command =='1'){
        this.dialogVisible = true;

      }else if(command =='2'){
        this.dialogVisible2 = true;

      }else{}
    },
    checkAddTwoType_B(command){
       this.aOrbAddParty = 'B';

      if(command =='1'){
        this.dialogVisible = true;

      }else if(command =='2'){
        this.dialogVisible2 = true;

      }else{}
    },
    //清楚表格数据
    clearTableItem(type){
      type == 'A'? this.PartyADate = {} : this.PartyBDate = {};

    },
    getAddData(data){
      if( this.aOrbAddParty == 'A'){
        this.PartyADate = data;
      }else if(this.aOrbAddParty == 'B'){
        this.PartyBDate = data;
      }else{

      }
      //console.log('添加的信息显示：',data)
    },
    getSeacheData(data){
      if( this.aOrbAddParty == 'A'){
        this.PartyADate = data;
      }else if(this.aOrbAddParty == 'B'){
        this.PartyBDate = data;
      }else{

      }
      //console.log('检索信息：',data)
    },
    colseAddDialog(){
      this.dialogVisible = false;
    },
    colseSeacheDialog(){
      this.dialogVisible2 = false;
    },
    coloseDialogs(){
      this.isShowUploadPress = false;
    },
    //合同上传
    uploadContrat(even){

      let self = this;
      let files = even.target.files || even.dataTransfer.files;

      if(!files.length) return;
      if(files[0].type.indexOf('application') < 0){
        this.$message.error('上传必须为文档文件!');
        return false;
      }
       self.isShowUploadPress = true;
      //console.log('上传文件信息',files);
      var flieName = files[0].name.split(".")[0];
      self.contracName = flieName;

				// 传给后台
				var acv = new FormData();
				acv.append('file', files[0]);
				acv.append('Token',self.localStorageUser.Token);
        acv.append('type', 'merchantContract');
        var config = {
            onUploadProgress: progressEvent => {
                var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
                self.progress = complete  * 1 //100

            }
        }

				axios.post(`${getDataPort}/Upload/Save`,acv,config)
				.then((res)=>{
          //console.log('上传成功',res.data)
          self.suolImgOneUrl = res.data.data.storeResult.path;
          self.lookContratUrl = res.data.data.storeResult.path;
          self.isShowUploadPress = false;
          //this.retrunCavasImg()
				})
				.catch((error)=>{
					// console.log(error);
				})
    },
    //pdf转图片处理
    retrunCavasImg(){
      let sefl = this;
      var url = this.lookContratUrl;
      //this.olineLookContratUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + escape(url);
      //console.log('执行了转换iomg---1')
      //PDFJS.workerSrc = 'pdf.worker.js';
      PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
          pdf.getPage(1).then(function getPageHelloWorld(page) {
            //console.log('执行了转换iomg---2')
              var scale = 0.25;
              var viewport = page.getViewport(scale);
              //var canvas = this.$refs.theCanvas;
              var canvas = document.getElementById('theCanvas');
              // console.log(canvas)
              var context = canvas.getContext('2d');
              var renderContext = {
                  canvasContext: context,
                  viewport: viewport
              };
              page.render(renderContext);
          });
      });
     /*  console.log('在线预览：',this.olineLookContratUrl)
      return this.olineLookContratUrl; */
    }
  },
  components: {
    addCompanyOrUser,
    myUserDialog,
    uploadProgress
	}

};
</script>

<style lang="less" scoped>
@import "~assets/less/mana/upload.less";
/*loading*/
	.loadingCircle{
	    width: 100%;
	    height: 100%;
	    position: absolute;
	    left: 0;
	    top: 0;
	    z-index: 99;
	}
	#signLoading{
	    width: 154px;
	    height: 110px;
	    position: absolute;
	    left: 50%;
	    top: 50%;
	}
</style>
