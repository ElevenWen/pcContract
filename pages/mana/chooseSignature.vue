<template>
  <div class="ContensWrap">
    <header>
      <span class="go-back" @click="_routeBack">返回</span>
      <h1 class="head-title">选择签署签章</h1>
      <nuxt-link to="/customerCenter/signature" tag="span" class="head-btn">签章管理</nuxt-link>
    </header>

    <!-- 签章列表 signList 签章类型（0.个人签章,1.企业签章） -->
    <div class="sign-list">
      <ul v-if="signList.length">
        <li
          v-for="(item, index) in signList" :key="item.Id"
          :class="['sign-item', {'active': item.Id == signId, 'personal': item.Type === 0, 'enterprise': item.Type === 1} ]"
        >
          <p class="sign-name"
            @click="_choose(item.Id)"
          >{{item.Type === 0 ? item.TrueName : item.CompanyName }}</p>
          <div class="toolbar">
            <i class="el-icon-ec-choose" @click="_choose(item.Id)"></i>
            <span class="toolbar-span" @click="_choose(item.Id)">可用签章</span>
          </div>
        </li>
      </ul>
    </div>
    <span class="next-btn" @click="_next()">下一步</span>

  </div>
</template>

<script>
import getData from "~/store/ajaxAPI/getData";
import tool from "~/assets/lib/tool.js";

export default {
  layout: "ec",
  name: "mana-chooseSignature",
  components: {},
  watch: {
    //$route: "fetchRoute"
  },
  head() {
    return {
      title: "选择可用签章 - 微企宝",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "选择可用签章"
        }
      ]
    };
  },
  data() {
    return {
      signList: [], //签章列表
      signId: null, //被选中的签章id
      userId: null //用户Id
    };
  },
  created() {},
  mounted() {
    // console.log(this.$route);
    let _CustomerMesg = tool.loadFromLocal("CustomerMesg", "ALL");
    // 判断是否登录,有userID
    if (_CustomerMesg && _CustomerMesg.Id) {
      this.userId = _CustomerMesg.Id;
      // 获取可用签章列表
      this._getSignList();
    } else {
      this.$message("您没有登录，请先登录");
    }
  },
  destroyed() {},
  methods: {
  	// 返回
  	_routeBack(){
  		console.log(this.$route)
  		if (this.$route.query.form == 'create') {
  			this.$router.push('/mana/list');
  		} else{
  			this.$router.back(-1);
  		} 		
  	},
    // 获取可用签章列表
    _getSignList() {
      let params = {
        Id: this.userId,
        State: 1 //审核状态（0.待审核 1.审核通过 2.驳回）
      };
      getData
        .GetCustomerSignatureList(params)
        .then(res => {
          if (res.success) {
            this.signList = res.data.list;
            // 默认选中第一个签章
            if (res.data.recordCount) {
              this.signId = this.signList[0].Id;
            }
          } else {
            this.signList = [];
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          let msg = error.data.msg;
          if (msg.indexOf("对于“WQBEShop.Web.Controllers") === 0) {
            this.$message.error("必要参数为空！");
            // console.log(error);
          } else {
            this.$message.error(msg);
          }
        });
    },
    // 选择签章
    _choose(id) {
      this.signId = id;
    },
    // 前往下一步 去签署
    _next() {
      // ecType 0预览  1未签署  2签署
      if (this.signId) {
        var ecId = this.$route.query.ecId;
        this.$router.push({
          path: "/mana/detail?ecId=" + ecId + "&ecType=1&signId=" + this.signId
        });
      }
    }
  }
};
</script>

<style lang="less" src="~/assets/less/mana/chooseSignature.less" scoped></style>
