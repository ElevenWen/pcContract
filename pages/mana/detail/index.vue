<template>
  <div class="ContensWrap">
     <header class="headerDom">
      <span class="go-back" @click="$router.back(-1)">返回</span>
      <h1 class="head-title" v-if="ecType === 1">签署合同</h1>
      <h1 class="head-title" v-else>合同详情</h1>

    </header>

    <!-- 法大大合同详情 -->
      <!--  合同状态 0预览  1未签署  2签署 -->
      <!-- 预览文件: 所有通过列表进来都是预览模式且不调用法大大签署页面 -->
      <div class="ec-view" v-if="!signId">
          <iframe :src="ecSrc" class="iframe"></iframe>
          <!-- <div class="empty" v-else>抱歉，暂时无法处理您的请求，请稍后再试。</div> -->
      </div>
      <!-- 进入法大大签署页面 -->
      <div class="ec-view" v-if="signId">
          <iframe :src="signIdSrc" class="iframe iframeFadada"   ref="iframeFadada"></iframe>
      </div>


    <!-- 合同基本信息 -->
    <!-- （0.草稿、1.待签署、2.已完成、3.已拒签、4.已撤销） -->
    <div class="basic-info">
      <h4 class="info-title">合同基本信息</h4>
      <p class="info-item">合同状态：{{ecInfo.statusText}}</p>
      <p class="info-item">合用编号：{{ecInfo.code }}</p>
      <p class="info-item">合同名称：{{ecInfo.name}} </p>
      <p class="info-item"   v-if="showRushReason" >拒签理由：{{ecInfo.Remark}}</p>
      <span class="tool-btn " @click.stop.prevent="_sign()" v-if="showWait">签署</span>
      <span class="tool-btn"  v-if="showRush"     @click="_layerOpen('showReminder')">催签</span>
      <span class="tool-btn"  @click="_layerOpen('showRetract')" v-if="showRevocation">撤回</span>
      <span class="tool-btn" @click="_layerOpen('showRefusal')" v-else-if=" showReject" >拒签</span>

      <a class="xiugaiDafault" v-if="DownloadUrl" :href="DownloadUrl" download="合同" ><span class="tool-btn"  v-if="showDownLoad">下载</span></a>


     </div>

    <!-- 弹窗 -->
    <div class="layer-shade" v-show="showShade"></div>
    <!-- 撤回弹窗 -->
    <div class="layer-dialog" v-if="showRetract">
      <div class="layer-title">温馨提示</div>
      <span class="layer-setwin">
        <a class="layer-close" href="javascript:;" @click="_layerClose('showRetract')"></a>
      </span>
      <div class="layer-content">
          <div class="hasIcon"><img class="img" src="~assets/images/mana/layer/icon0.png">是否撤回？撤回后合同将无法签署哦~</div>
      </div>
      <div class="layer-btn">
        <a class="layer-btn0" @click=" _signContract('2')">确定</a>
        <a class="layer-btn1" @click="_layerClose('showRetract')">取消</a>
      </div>
    </div>
    <!-- 拒签弹窗 -->
    <div class="layer-dialog" v-if="showRefusal">
      <div class="layer-title">拒签原因</div>
      <span class="layer-setwin">
        <a class="layer-close" href="javascript:;" @click="_layerClose('showRefusal')"></a>
      </span>
      <div class="layer-content">
          <textarea v-model="refusalMsg" class="refusal-msg" placeholder="请输入拒绝签署原因，便于对方与您沟通！（3-100字）" maxlength="200"></textarea>
      </div>
      <div class="layer-btn">
        <a class="layer-btn0"  @click="_refusal">确定</a>
        <a class="layer-btn1" @click="_layerClose('showRefusal')">取消</a>
      </div>
    </div>
    <!-- 催签弹窗 -->
    <div class="layer-dialog" v-if="showReminder">
      <div class="layer-title">温馨提示</div>
      <span class="layer-setwin">
        <a class="layer-close" href="javascript:;" @click="_layerClose('showReminder')"></a>
      </span>
      <div class="layer-content">
        <div class="hasIcon"><img class="img" src="~assets/images/mana/layer/icon0.png">是否提醒?</div>
      </div>
      <div class="layer-btn">
        <a class="layer-btn0" @click=" _signContract('3')">确定</a>
        <a class="layer-btn1" @click="_layerClose('showReminder')">取消</a>
      </div>
    </div>

  <!-- 合同第一次操作提示 -->
  <div class="tipsHelp"   v-show="showCloseTipsHelp">
      <!-- <div class="ajaxAPI">

      </div> -->

        <div class="rightInner">
          <img src="../../../assets/images/mana/tipsHelp.png" alt="">
          <div @click="closeTipsHelp">知道了</div>
        </div>

  </div>
  </div>
</template>

<script>
import getData from "~/store/ajaxAPI/getData";
import tool from "~/assets/lib/tool.js";
export default {
  layout: "ec",
  name: "detail-id",
  components: {},
  watch: {
    $route: "fetchRoute"
  },
  head() {
    return {
      title: "电子合同详情 - 微企宝",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "电子合同详情"
        }
      ]
    };
  },
  data() {
    return {
      showCloseTipsHelp: false,
      userId: "", //用户id
      ecId: null, //合同id
      signId: null, // 签章id
      isHasRevocation: false, //撤回权限
      ecType: "", //合同状态 0预览  1待签署  2已完成  3已拒签  4已撤销
      flag: "", //显示法大大页面还是合同预览
      signIdSrc: "", //法大大签署页面显示
      ecSrc: "", //法大大合同URL
      ecInfo: {}, //合同基本信息
      showRefusal: false, //拒签弹窗
      refusalMsg: "", //拒签原因
      isUser: false, //是否合同发起方
      showShade: false, //显示遮罩层
      showRetract: false, //显示撤回弹窗
      showRefusal: false, //显示拒签弹窗
      showReminder: false, //显示催签弹窗
      DownloadUrl: "", //X下载模版
      showRushTrue: false //判断是否催签
    };
  },
  computed: {
    //签署 按钮显示  待签署且是带我签
    showWait() {
      return this.ecInfo.statusText === "待我签" && this.ecType == 0;
    },
    //催签 按钮显示
    showRush() {
      return this.showRushTrue && this.ecType < 2;
    },
    //拒签理由
    showRushReason() {
      return this.ecInfo.statusText === "已驳回";
    },
    //拒签 按钮显示  待我签且不是合同发起人
    showReject() {
      return this.ecInfo.statusText === "待我签" && !this.isHasRevocation;
    },
    //下载按钮显示
    showDownLoad() {
      return this.ecInfo.statusText === "已完成";
    },
    //撤回按钮显示  发起人有权撤回
    showRevocation() {
      return this.isHasRevocation === true && this.ecType < 2;
    }
  },

  created() {
    this.ecId = this.$route.query.ecId;
    this.ecType = Number(this.$route.query.ecType) || 0;
    this.signId = this.$route.query.signId || "";
  },
  beforeMount() {
    // 判断是否登录,有userId
    let _CustomerMesg = tool.loadFromLocal("CustomerMesg", "ALL");
    if (_CustomerMesg && _CustomerMesg.Id) {
      this.userId = _CustomerMesg.Id;
    } else {
      this.$message("请先登录");
    }
    // 判断用户第一次登陆
    if (Boolean(this.signId)) {
      let params = {
        Id: this.userId
      };
      getData
        .checkIsFirst(params)
        .then(res => {
          // console.log(res);
          if (res.success) {
            //第一次登陆
            let params = {
              Id: this.userId
            };
            this.showCloseTipsHelp = true;
            getData
              .AddEnterRecord(params)
              .then(res => {
                console.log(res);
              })
              .catch(error => {
                // console.log(error);
              });
          } else {
            //不是第一次登陆
          }
        })
        .catch(error => {
          //不是第一次签署
          console.log(error.success);
        });
    }
  },
  mounted() {
    // 获取合同详情
    this._getContractInfo();
    // 如果有签章ID，判断为调用法大大签署页面
    if (this.signId) {
      //signIdSrc 包括用户要调用法大大页面
      this._signContract(1);
    }
  },

  destroyed() {
    // 清空拒签理由
    this.refusalMsg = "";
  },
  methods: {
    //关闭 签章提示
    closeTipsHelp() {
      this.showCloseTipsHelp = false;
    },
    // 获取合同详情
    _getContractInfo() {
      let params = {
        Id: this.ecId, //合同Id
        CustomerId: this.userId
      };
      // 获取合同详情
      getData
        .getContractDetail(params)
        .then(res => {
          let _data = res.data;
          // 判断合同状态  注意:若用户为发起人 择拥有撤回权限, 没有拒签权限
          this.isHasRevocation = Boolean(_data.CreateCustomerId == this.userId);
          //合同基本信息
          this.ecInfo = {
            code: _data.ContractNumber,
            name: _data.Name,
            Remark: _data.Remark
          };
          // 签署状态  （0.草稿、1.待签署、2.已完成、3.已拒签、4.已撤销）
          _data.SignedState > 1 ? (this.ecType = _data.SignedState) : "";
          switch (_data.SignedState) {
            case 0:
              this.ecInfo.statusText = "草稿";
              // 出错，应该跳转 create 目录
              //  类型（系统模板、自定义）
              if (_data.Type === 0) {
                this.$router.replace(
                  "/mana/create/template?type=1&id=" + this.ecId
                );
              } else {
                this.$router.replace("/mana/create/upload?Id=" + this.ecId);
              }
              break;
            case 1:
              // 签署人（只用于待签署状态判断 -1.都没签 0.待我签 1.待他签）
              if (_data.signer === 1) {
                this.ecInfo.statusText = "待他签";
                // 若当前账户是合同发起人，则在待他签状态下的操作是：撤回、催签；
                // 当前账户不是合同发起人，则在待他签状态下的操作是：催签；
              } else {
                this.ecInfo.statusText = "待我签";
                // 当前账户是发起方且对方也未签署，对应操作：撤回、催签、签署；若对方已签署，对应的操作：撤回、签署；
                // 当前账户不是发起方且对方也未签署，对应操作：拒签、催签、签署；若对方已签署，对应的操作：拒签、签署；
              }
              // 对方未签署 SignedState1
              if (
                _data.SignedState1 === false &&
                _data.SignedState2 === false
              ) {
                this.showRushTrue = true;
              } else if (_data.SignCusId1 == this.userId) {
                //如果登陆账号为Id1 则判断状态 对方是否有签订 若有则不显示催签订按钮
                this.showRushTrue = !_data.SignedState2;
              } else if (_data.SignCusId2 == this.userId) {
                this.showRushTrue = !_data.SignedState1;
              }
              break;
            case 2:
              this.ecInfo.statusText = "已完成";
              this.DownloadUrl = _data.DownloadUrl;
              // 对应的操作：下载、打印；
              break;
            case 3:
              this.ecInfo.statusText = "已驳回";
              // 显示拒签理由；
              break;
            case 4:
              this.ecInfo.statusText = "已撤回";
              // 没有相关操作；
              break;
          }

          // this.ecSrc  = _data.Imgs[0].ECImage;
          // this.ecSrc = _data.ViewpdfUrl;
          this.ecSrc = _data.PdfFilePath;
          
        })
        .catch(error => {
          // console.log(error);
        });
    },
    // 签署合同页面操作：（0.拒签 1.签署 2.撤回 3.催签）
    _signContract(state) {
      let that = this;
      let params = {
        Id: this.ecId, //  合同Id   string   不可
        CusId: this.userId, //  用户Id   string   不可
        State: state + "", //  签署状态（0.拒签 1.签署 2.撤回 3.催签）   string   不可
        SignId: this.signId, //   签章Id   string   可
        Remark: state == 0 ? this.refusalMsg : "" //   拒签理由   string   可
      };
      getData
        .SignContract(params)
        .then(res => {
          if (state == 1) {
            //替换为法大大的 签署页面
            this.signIdSrc = res.data.link;
            return;
          } else if (state == 2) {
            this._layerClose("showRetract");
          } else if (state == 3) {
            this._layerClose("showReminder");
          }
          if (res.success == true) {
            if (state == 0) {
              this._layerClose("showRefusal");
            } else if (state == 3) {
              res.msg = "催签提醒发送成功！";
            }
            this.$message({
              message: res.msg,
              type: "success",
              duration: 1000,
              onClose: function() {
                state != 3 && that.$router.push("/mana/list");
              }
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          // console.log(error);
          if (state == 0) {
            this._layerClose("showRefusal");
          } else if (state == 2) {
            this._layerClose("showRetract");
          } else if (state == 3) {
            this._layerClose("showReminder");
            error.data.msg = error.data.msg || "24小时只能催一次！";
          }
          this.$message.error(error.data.msg);
        });
    },
    // 打开弹窗
    _layerOpen(item) {
      this.showShade = true;
      this[item] = true;
    },
    // 关闭弹窗
    _layerClose(item) {
      this.showShade = false;
      this[item] = false;
    },
    // 签署合同
    _sign() {
      //还未选择签章   判断是否有可用的签章若有择跳转签章选择页面
      let params = {
        Id: this.userId, //  用户Id   string   不可
        Type: "", //  签章类型(0=个人、1=公司)   int   可
        State: "1", // 审核状态（0.待审核 1.审核通过 2.驳回）   int   可
        Name: "", //  抬头名称（模糊匹配）   string   可
        containTyc: "" // 1 数据库 2天眼查 3 数据库+天眼查   int   可
      };

      getData
        .GetCustomerSignatureList(params)
        .then(res => {
          if (res.data.list.length) {
            this.$router.push({
              //有签章
              path: "/mana/chooseSignature?ecId=" + this.ecId
            });
          } else {
            this.$router.push({
              //请先申请可用签章
              path: "/customerCenter/signature"
            });
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },
    // 拒签
    _refusal() {
      this.refusalMsg = this.refusalMsg.trim();
      let len = this.refusalMsg.length;
      if (len < 3 || len > 100) {
        this.$message.warning("请输入3-100个字符");
        return;
      }
      this._signContract(0);
    },
    // 监听路由
    fetchRoute() {
      // reset
      this.ecType = Number(this.$route.query.ecType) || 0;
      this.refusalMsg = "";
    }
  }
};
</script>


<style lang="less" src="~/assets/less/mana/detail.less" scoped></style>

<style>
.tipsHelp {
  position: absolute;
  left: 0;
  top: 54px;
  height: calc(100vh - 154px);
  width: 100%;
}

.rightInner {
  display: inline-block;
  width: 1200px;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}
.rightInner img {
  margin: 320px 0 0 76px;
}
.rightInner div {
  background: #ff3e08;
  display: inline-block;
  padding: 10px 20px;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  margin: 47px 0 0 378px;
}
</style>
