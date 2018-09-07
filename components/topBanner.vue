<template>
  <div class="topBannerConten">
    <nuxt-link to="/">
      <img src="~assets/images/logo.png" alt="logo" class="logo">
    </nuxt-link>
    <nuxt-link to="/" tag="span" class="title">微企宝电子合同平台</nuxt-link>
    <div class="userContral">
      <el-dropdown v-show="$route.path !== '/'">
        <span class="el-dropdown-link" @mouseover="hoverInAnmation" @mouseout="hoverOutAnmation">
           <img src="~assets/images/addNew.png" alt="" class="addImg" ref="addImgRotate">
          发起合同<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <div @click="creatContraUpload">上传文件</div>
            <input type="file" :value="fileValue" id="file" ref="file" accept=".doc,.docx,.pdf" @change="creatContraUpload($event)" v-if="signListData.length>0"/>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <div @click="creatContraTemplate">使用模板</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <span v-if="!isAuthentication" class="userNameAndPhone" @click="toRouter('/customerCenter')">{{customerData.Nickname? customerData.Nickname:customerData.Account}}</span>
      <span v-else class="userNameAndPhone" @click="toRouter('/customerCenter')">{{sigTrueName}}</span>
      <div class="msgRemind" @click="toRouter('/customerCenter/notificationMes')">
        <span class="num" v-if="unReadNum != 0">{{unReadNum}}</span>
      </div>
      <img src="~assets/images/closeSeastem.png" alt="colseSystem" class="colseSystem" @click="toQuit">
    </div>
    <!-- 模板选择弹窗 -->
    <useContractTemplate :dialogVisible="dialogVisible2" @closeDialog="closeuseContractTemplateDialog"/> 
    <uploadProgress :dialogVisible="isShowUploadPress" :tageProgress="progress"  @toClosePress="coloseDialogs"/>
  </div>
</template>

<script>
import useContractTemplate from '~/components/useContractTemplate.vue'
import uploadProgress from '~/components/uploadProgress.vue'

import {mapActions, mapState,mapGetters } from 'vuex';
import getData from "~/store/ajaxAPI/getData";
import {websitePort ,getDataPort} from "~/store/ajaxAPI/perPort.js"
//import { getDataPort } from '~/store/ajaxAPI/perPort.js'
import tool from "~/assets/lib/tool.js";
import axios from 'axios'

export default {
  data(){
    return {
      customerData: '',
      _id:"",//用户id
      isAuthentication: false,  //是否认证
      sigTrueName: '',    //认证后的姓名
      signListData: [], //可用签章
      dialogVisible2: false,  // 模板选择
      isShowUploadPress: false, //上传显示

      fileValue:'',           //上传的文件
      progress: 0,              //上传进度
      localStorageUser: ''
    }
  },
  components: {
    useContractTemplate,
    uploadProgress  
  },
  computed:{
	  ...mapGetters({
			notificationData:'notificationMes/notificationMes/notificationData',
			unReadNum:'notificationMes/notificationMes/unReadNum'
		})
	},
	mounted(){
    //开始
		 this.localStorageUser = JSON.parse(window.localStorage.getItem('CustomerMesg'));
		//获取基本资料
		getData.getcustorInfor()
		.then((res)=>{
      this.customerData = res.data;
      this.$emit('getUserInfoData',this.customerData)
      //console.log('用户信息',res.data)
			
		})
		.catch((error)=>{
			if(error.data.code == "300001"){
				//调用退出接口
				getData.loginOut()
				.then((res)=>{
					this.lognOut_X();
					let url = encodeURIComponent(location.href)
					location.href = `${websitePort}/loginAndRegister/login?url=${url}`;
				})
			}
		})
		
		//获取我的id
		this._id = tool.loadFromLocal("CustomerMesg","ALL").Id;
		
		let unParams = {
			id:this._id,
		}
		//获取未读消息数量
		this.getContractMessageNum(unParams)
    //获取可以签章列表数据 用来创建判断
    this.__getSignList()
	},
  methods:{
  	...mapActions({
			'lognOut_X':'lognOut_X',
			'getMessage':'notificationMes/notificationMes/getMessage',
			'getContractMessageNum':'notificationMes/notificationMes/getContractMessageNum'
    }),
    __getSignList(){
       let param = {
          Type : '',
          State:1//可用
      }
       getData.signList(param)
       .then(res => {
         this.signListData = res.data;   
         this.$emit('getSignList',this.signListData);
         
         this.signListData.forEach(element => {
           if(element.Type === 0 && element.ReviewState ===1){
             //确定个人签章及已审核状态
              this.isAuthentication = true;            
              this.sigTrueName = element.TrueName;
              return
           }
         });  
         
       })
     },
    hoverInAnmation(){
      this.$refs.addImgRotate.style.transform = 'rotate(45deg)'
    },
    hoverOutAnmation(){
      this.$refs.addImgRotate.style.transform = 'rotate(0)'
    },
    toRouter(path){
      this.$router.push(path)
    },
    toQuit(){
    	getData.loginOut()
    	.then((res)=>{
				this.lognOut_X();
				let url = encodeURIComponent(location.href)
				location.href = `${websitePort}/loginAndRegister/login?url=${url}`;
			})
    },
    //上传文件及使用模板
     creatContraUpload(even){
        if(this.signListData.length>0){//有签章
          let files = even.target.files || even.dataTransfer.files;
          if(!files.length) return;
          if(files[0].type.indexOf('application') < 0){ 
            this.$message.error('上传必须为文档文件!');
            return false; 
          } 
          this.isShowUploadPress = true;
          // console.log('文件信息',files[0].name.split(".")[0])
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
              //清空上传 输入框值
              this.fileValue = '';
              var resPath = res.data.data.storeResult.path;
              window.sessionStorage.setItem('_updlodResultLookPath', resPath);
              
              this.isShowUploadPress = false;
              
              //如果当前页面为 上传页 需刷新处理
              if(this.$route.path == '/mana/create/upload'){
                window.location.reload()
              }else{
                this.$router.push('/mana/create/upload') 
              }              

            }).catch(err=>{
              console.log('上传失败',err)
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
      closeuseContractTemplateDialog(){this.dialogVisible2 = false;},
      coloseDialogs(){
        this.isShowUploadPress = false
      },
  }
}
</script>

<style scoped lang="less">
  .topBannerConten{
    position: relative;
    width: 100%;
    height: 78px;
    line-height: 78px;
    background-color: #ff3e08;
    img{vertical-align: middle}
    .title{
      font-family: MicrosoftYaHei-Bold;
      font-size: 24px;
      line-height: 20px;
      letter-spacing: 0px;
      color: #ffffff;
      cursor: pointer;
    }
    .userContral{
      position: absolute;
      top: 0;
      right: 30px;
      //width: 300px;
      height: 78px;
      line-height: 78px;
      .addImg{
        margin-top: -5px;
        transition: transform 0.6s;
      }
      & /deep/ .el-dropdown-link{
        font-size: 18px;
        color: #ffffff;
      }
      .userNameAndPhone{
        margin-left: 30px;
        font-family: MicrosoftYaHei;
        font-size: 18px;
        letter-spacing: 0px;
        color: #ffffff;
        cursor: pointer;
      }
      .msgRemind{
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 26px;
        height: 26px;
        background: url('~assets/images/mesege.png') no-repeat;
        margin: 0 30px;
        &:hover{cursor: pointer;}
        img{
          width: 26px;
        }
        .num{
          position: absolute;
          top: -5px;
          right: -15px;
          line-height: 1;
          text-align: center;
          padding: 1px 4px;
          background-color: #ffffff;
          border-radius: 50%;
          border: solid 2px #ff3e08;
          font-size: 12px;
          color: #ff3e08;
        }
      }
      .colseSystem{&:hover{cursor: pointer}}
    }
  }
  /*重置elm-ui 头部下拉样式*/
.el-dropdown-menu{
	top: 55px !important;
	//left: 1470px !important; 
	padding: 12px 12px !important;	
}
.el-dropdown-menu__item{
  position: relative;
  padding: 0 !important;
	font-size: 18px !important;
  color: #000000 !important;
  >div{
    width: 120px;
    height: 100%;
    text-align: center;
  }
  #file{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;        
      cursor: pointer;
      z-index: 20;
      opacity: 0;
  } 
}
</style>
