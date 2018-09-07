<template>
  <div class="leftNavConten">
    <ul class="oneNavWrap">
      <li v-for="(item,index) in navData" :key="index" class="oneNav-item">
        <span class="icon" :class="{'activeIcon': nowRoutePath === item.path && item.isactived}"  @click="isRefresh(item.path)"></span>
        <span  :class="{'activeNav': item.path.length > 1 && nowRoutePath.indexOf(item.path) > -1 && item.isactived}" 
          @click="isRefresh(item.path)" v-if="$route.path !== '/'">{{item.title}}</span>
        <span  :class="{'activeNav': nowRoutePath === item.path && item.isactived}" v-else @click="isRefresh(item.path)">{{item.title}}</span>
        <ul class="twoNaWrap">
          <li v-for='(twoNav, tIndex) in item.twoNav' :key="tIndex" class="twoNav-item" >
            <span :class="{'activeNav': twoNav.path === nowRoutePath}" @click="isRefresh(twoNav.path)">{{twoNav.title}}
              <span v-if="twoNav.isHaveIcon" class="twoNavIcon">{{unReadNum===0? '': unReadNum}}</span>
            </span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapActions, mapState,mapGetters } from 'vuex';
export default {
  data(){
    return {
      navData:[
        {title:'系统首页',path: '/',isactived: true},
        {title:'合同管理',path: '/mana/list',isactived: true
          /* twoNav:[
            {title:'合同列表',path: '/mana/list'},
            {title:'创建合同-上传',path: '/mana/create/upload'},
            {title:'创建合同-模板',path: '/mana/create/template'},
            {title:'合同预览',path: '/mana/detail'},
          ] */
        },
        {title:'我的模板',path: '/myTemplate',isactived: true},
        {title:'用户中心',path:'/customerCenter',twoNav:[
          {title:'用户信息',path:'/customerCenter'},
          {title:'我的套餐',path:'/customerCenter/meal'},
          {title:'我的签章',path:'/customerCenter/signature'},
          {title:'消息',path:'/customerCenter/notificationMes',isHaveIcon: true}
        ]},
        {title:'客户管理',path:'/customerManage',twoNav:[
          {title:'我的客户',path:'/customerManage'}
        ]}
      ],
      oneIndex: 0,  //默认首页 0
      twoIndex: 0,
     
    }
  },
  mounted () {
    
    
  },
  
  computed:{
	  ...mapGetters({
			unReadNum:'notificationMes/notificationMes/unReadNum'
    }),
    nowRoutePath: function(){
      var nowPath = ''
      if(this.$route.path == '/customerCenter/' 
      || this.$route.path =='/customerCenter/reviseEmail'
      || this.$route.path == '/customerCenter/revisePwd'
      || this.$route.path == '/customerCenter/revisePhone'){
        nowPath = '/customerCenter'
      }else if(this.$route.path == '/customerCenter/signature/companyCertification'
      || this.$route.path == '/customerCenter/signature/personalCertification'){
        nowPath = '/customerCenter/signature'
      }else if(this.$route.path == '/mana/chooseSignature'
      || this.$route.path == '/mana/detail'
      || this.$route.path == '/mana/create/template'
      || this.$route.path == '/mana/create/upload'){
        nowPath = '/mana/list'
      }else if(this.$route.path == '/customerCenter/meal/mealList'){
        nowPath = '/customerCenter/meal'
      }else{
        nowPath = this.$route.path;
      }
      //console.log('返回的路由',nowPath)
      return nowPath
    }
	},
   methods: {
      isRefresh(path){
        this.$router.push(path)
        if(path == this.$route.path){
          window.location.reload()
           //console.log('刷新~~',path)
        }     
        //console.log('当前打印',path)
      }
    }
}
</script>

<style type="stylesheet/css" scoped lang="less">
 .leftNavConten{
    overflow-x: hidden;
   width: 100%;
	 height: 100%;
   background-color: #ffffff;
   .oneNavWrap{
     width: 100%;
     .oneNav-item{
       width: 100%;
       min-height: 60px;
       line-height: 60px;
       text-align: center;
       font-family: MicrosoftYaHei;
       border-bottom: 1px solid #e5e5e5;
       cursor: pointer;
       .icon{
         padding: 8px;
         margin-right: 16px;
         background-repeat: no-repeat;
         background-position-y: 7px;
       }
       &:nth-child(1){
         .icon{
            background-image: url('~assets/images/home/home_icon.png');
          }
          .activeIcon{
            background-image: url('~assets/images/home/home_icon_a.png');
          }
       }
       &:nth-child(2){
         .icon{
           background-image: url('~assets/images/home/contractman_icon.png');
         }
         .activeIcon{
            background-image: url('~assets/images/home/contractman_icon_a.png');
          }
       }
       &:nth-child(3){
         .icon{
            background-image: url('~assets/images/home/myTempalet.png');
         }
         .activeIcon{
            background-image: url('~assets/images/home/myTempalet_a.png');
          }
       }
       &:nth-child(4){
         .icon{
            background-image: url('~assets/images/home/user_icon.png');
         }
         .activeIcon{
            background-image: url('~assets/images/home/user_icon_a.png');
          }
       }
        &:nth-child(5){
         border-bottom: none;
         .icon{
           background-image: url('~assets/images/home/userMan_icon.png');
          }
         .activeIcon{
            background-image: url('~assets/images/home/userMan_icon_a.png');
          }
       }
       .textTitle{
         font-size: 16px;
         color: #000000;
         &:hover{
          cursor: pointer;
         }
       }
       span{
         font-size: 16px;
         color: #000000;
         &:hover{
          cursor: pointer;
         }
       }
       .activeNav{
          color: #ff3e08;
        }
     }
     .twoNaWrap{
       padding-left: 105px;
       .twoNav-item{
         text-align: left;
         height: 34px;
         font-size: 16px;
         line-height: 34px;
         color: #555555;
         &:hover{
          cursor: pointer;
         }
       }
       .activeNav{
          color: #ff3e08;
        }
     }
   }
    .twoNavIcon{
      color: #ff3e08 !important;
    }
 }

</style>
