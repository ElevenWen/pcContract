<template>
  <div class="ContensWrap">
    <h1 class="head-title">合同列表</h1>
    <!-- tab选项卡 -->
    <div class="tabs" id="nav">
      <ul class="tab-ul clearfix">
        <nuxt-link
          v-for="(item, index) in navList" :key="index"
          :class="['tab-item', {'active': navIdx === index}]"
          :to="{query: {type: index}}"
          tag="li"

        >{{item.Name}}</nuxt-link>
      </ul>
    </div>

    <!-- 列表 -->
    <div class="ec-list">
      <!--搜索栏-->
      <div class="query">
        <ul>
          <li class="query-item">
            <span class="query-text">合同名称</span>
            <input type="text" class="query-input" placeholder="请输入合同名称" maxlength="50" v-model="ecName">
          </li>
          <li class="query-item">
            <span class="query-text">合同编号</span>
            <input type="text" class="query-input" placeholder="请输入合同编号" maxlength="50" v-model="ecCode">
          </li>
          <li class="query-item">
            <span class="query-text">发起人</span>
            <input type="text" class="query-input" placeholder="请输入发起人" maxlength="50" v-model="ecSponsor">
          </li>
          <li class="query-item time">
            <el-date-picker
              v-model="ecDate"
              type="daterange"
              size="mini"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </li>
          <li class="query-item">
            <span class="query-btn" @click="search">查询</span>
          </li>
        </ul>
      </div>
      <!--表格-->
      <div class="table_box">
        <div class="title">
          <ul>
            <li>序号</li>
            <li>合同编号</li>
            <li>合同名称</li>
            <li>发起人</li>
            <li>更新时间</li>
            <li>文件状态</li>
            <li>操作</li>
          </ul>
        </div>
        <div class="content" v-if="contractList.length">
          <ul>
            <li v-for="(item,index) in contractList" :key="index">
              <!-- 序号显示为数据下标 + 1， -->
              <span>{{(pageIndex == 1 && index < 9) ? '0' + (index + 1) : ((pageIndex - 1) * pageSize + index + 1) }}</span>
              <span>{{item.ContractNumber}}</span>
              <span>{{item.Name}}</span>
              <span>{{item.CreateCustomerName}}</span>
              <span>{{item.timer}}</span>
              <span>{{item.new}}</span>
              <span v-if="item.new == '已完成'">
                <button @click="check(item.Id)">查看</button>
                <button><a :href="item.DownloadUrl" download="合同">下载</a></button>
              </span>
              <span v-if="item.new == '待我签'">
                <button @click="check(item.Id)">查看</button>
                <button @click="sign(item.Id)">签署</button>
              </span>
              <span v-if="item.new == '待他签'">
                <nuxt-link :to="'/mana/detail?Name=waitForThey&ecId=' + item.Id" tag="button">查看</nuxt-link>
                <button @click="_showReminder(item.Id)">催签</button>
              </span>
              <span v-if="item.new == '已撤回'">
                <button @click="check(item.Id)">查看</button>
                <button @click="_showDel(item.Id)">删除</button>
              </span>
              <span v-if="item.new == '已驳回'">
                <button @click="check(item.Id)">查看</button>
                <button @click="_showReason(item.Remark)">原因</button>
              </span>
              <span v-if="item.new == '草稿'">
                <button @click="edit(item.Type,item.Id)">编辑</button>
                <button @click="_showDel(item.Id)">删除</button>
              </span>
            </li>
          </ul>
        </div>
        <!--分页-->
        <div class="pagination" v-if="msg && contractList.length">
          <el-pagination
            @size-change="pageSizeChange"
            @current-change="pageCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10,25,50,100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <div class="list-empty" v-if="!contractList.length">
        <span v-if="loadingStatus">正在加载中~</span>
        <span v-else>当前分类暂无合同</span>
      </div>
    </div>

    <!-- 弹窗 -->
    <div class="layer-shade" v-show="showShade"></div>
    <!-- 催签弹窗 -->
    <div class="layer-dialog" v-if="showReminder">
      <div class="layer-title">温馨提示</div>
      <span class="layer-setwin">
        <a class="layer-close" href="javascript:;" @click="_layerClose('showReminder')"></a>
      </span>
      <div class="layer-content">
        <div class="Icon">
          <img class="img" src="~assets/images/mana/layer/icon0.png">
          <span>是否提醒？</span>
        </div>
      </div>
      <div class="layer-btn">
        <a class="layer-btn0" @click="_reminder()">确定</a>
        <a class="layer-btn1" @click="_layerClose('showReminder')">取消</a>
      </div>
    </div>
    <!-- 删除弹窗 -->
    <div class="layer-dialog" v-if="showDel">
      <div class="layer-title">温馨提示</div>
      <span class="layer-setwin">
        <a class="layer-close" href="javascript:;" @click="_layerClose('showDel')"></a>
      </span>
      <div class="layer-content">
        <div class="hasIcon"><img class="img" src="~assets/images/mana/layer/icon0.png"><span>此操作将删除合同, 是否继续？</span></div>
      </div>
      <div class="layer-btn">
        <a class="layer-btn0" @click="_del()">确定</a>
        <a class="layer-btn1" @click="_layerClose('showDel')">取消</a>
      </div>
    </div>
    <!-- 已驳回原因弹窗 -->
    <div class="layer-dialog" v-if="showReason">
      <div class="layer-title">已驳回原因</div>
      <span class="layer-setwin">
        <a class="layer-close" href="javascript:;" @click="_layerClose('showReason')"></a>
      </span>
      <div class="layer-content">
        <div class="reason-msg">{{reason}}</div>
      </div>
      <div class="layer-btn">
        <a class="layer-btn0" @click="_layerClose('showReason')">确定</a>
      </div>
    </div>
    <div class="loadingCircle" v-show="isShowLoading">
        	<div id="signLoading"></div>
    </div>
  </div>
</template>

<script>
import getData from "~/store/ajaxAPI/getData";
import tool from "~/assets/lib/tool.js";

export default {
  layout: "ec",
  name: "mana-list",
  watch: {
    $route: "fetchRoute"
  },
   
  head() {
    return {
      title: "合同列表 - 微企宝",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "合同管理列表页"
        }
      ]
    };
  },
  data() {
    return {
      userId: null, //用户Id
      navIdx: "", //选中的合同状态
      navList: [
        { Name: "所有合同" },
        { Name: "待我签" },
        { Name: "待他签" },
        { Name: "已完成" },
        { Name: "已驳回" },
        { Name: "已撤回" },
        { Name: "草稿箱" }
      ], //合同选项卡列表
      contractList: [], //列表数据
      SignedState: "", //签署状态
      signer: "", //签署人
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      msg: false,
      ecId: "", //合同id
      keyword: "", //合同名称
      ContractNo: "", //合同编号
      CreateCustomerName: "", //发起人
      StartTime: "", //开始时间
      EndTime: "", //结束时间
      reason: "", //拒签原因
      // loading:true,
      isShowLoading: false, //是否显示loading
      //----------------------------------
      ecName: "", //合同名称
      ecCode: "", //合同编号
      ecSponsor: "", //发起人
      ecDate: "", //选择日期范围
      loadingStatus: true, // 列表加载中
      showShade: false, //显示遮罩层
      showReminder: false, //显示催签弹窗
      showDel: false, //显示删除弹窗
      showReason: false //显示已驳回原因弹窗
    };
  },
  beforeRouteEnter (to, from, next) {  //合同签署完毕
    if(process.client){ 
      console.log(top.location.href   )
      console.log(  self.location.href  )


       
      if (top.location.href != self.location.href) {
        // top.location.href = location.href;  
        top.location.href =  'https://ec.wqbol.net/mana/list';  
        
        next(vm => { 
           // 通过 `vm` 访问组件实例
         })  
      } else{
         next(vm => { 
           // 通过 `vm` 访问组件实例
         }) 
      } 
    } else{  //服务器
       next(vm => { 
           // 通过 `vm` 访问组件实例
       }) 
    } 
  },
  beforeMount() { 
    // query合同状态type映射选中的合同状态navIdx
    this.navIdx = Number(this.$route.query.type) || 0;
    // 判断合同状态下标
    this.checkType();
    // 判断是否登录,有userId
    let _CustomerMesg = tool.loadFromLocal("CustomerMesg", "ALL");
    if (_CustomerMesg && _CustomerMesg.Id) {
      this.userId = _CustomerMesg.Id;
      // 根据query type请求数据
      this.getList();
    } else {
      this.$message("请先登录");
    }
  },
  mounted() { 
    let loadingInstance = this.$loading({
      fullscreen: false,
      target: document.getElementById("signLoading"),
      background: "rgba(0, 0, 0, 0.7)"
    }); //loading 加载样式
    // this.isShowLoading = true;
  },
  methods: {
    //列表
    getList() {
      let params = {
        params: {
          Id: this.userId,
          SignedState: this.SignedState,
          signer: this.signer,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keyword,
          ContractNo: this.ContractNo,
          CreateCustomerName: this.CreateCustomerName,
          StartTime: this.StartTime,
          EndTime: this.EndTime
        }
      };
      this.loadingStatus = true;
      getData
        .GetContractList(params)
        .then(res => {
          // this.loadingInstance.close();
          this.isShowLoading = false;
          this.loadingStatus = false;
          this.total = res.data.recordCount;
          this.msg = res.success;
          this.contractList = res.data.list;
          let arr = res.data.list;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].SignedState == 1) {
              if (arr[i].signer == -1) {
                arr[i].new = "待我签";
              } else if (arr[i].signer == 0) {
                arr[i].new = "待我签";
              } else if (arr[i].signer == 1) {
                arr[i].new = "待他签";
              }
            } else if (arr[i].SignedState == 0) {
              arr[i].new = "草稿";
            } else if (arr[i].SignedState == 2) {
              arr[i].new = "已完成";
            } else if (arr[i].SignedState == 3) {
              arr[i].new = "已驳回";
            } else if (arr[i].SignedState == 4) {
              arr[i].new = "已撤回";
            }
            //格式化时间
            var str = arr[i].CreateTime.replace(/[^0-9]/gi, "");
            arr[i].timer = tool.formatDate(str, "yyyy-MM-dd hh:mm:ss");
          }
          // console.log('正确的',res)
        })
        .catch(error => {
          // console.log(error);
        });
    },
    //每页条数
    pageSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getList();
    },
    //当前页数
    pageCurrentChange(val) {
      this.pageIndex = val;
      this.getList();
    },
    //搜索
    search() {
      let _arr = this.ecDate || "";
      this.keyword = this.ecName;
      this.ContractNo = this.ecCode;
      this.CreateCustomerName = this.ecSponsor;
      this.StartTime = _arr.length ? _arr[0] : "";
      this.EndTime = _arr.length ? _arr[1] : "";
      this.getList();
    },
    // 判断合同状态下标 同步改变签署状态SignedState、签署人signer
    checkType() {
      if (this.navIdx === 0) {
        //5)">所有合同
        this.SignedState = "";
        this.signer = "";
      } else if (this.navIdx === 1) {
        //1,0)">待我签
        this.SignedState = 1;
        this.signer = 0;
      } else if (this.navIdx === 2) {
        //1,1)">待他签
        this.SignedState = 1;
        this.signer = 1;
      } else if (this.navIdx === 3) {
        //2)">已完成
        this.SignedState = 2;
        this.signer = "";
      } else if (this.navIdx === 4) {
        //3)">已驳回
        this.SignedState = 3;
        this.signer = "";
      } else if (this.navIdx === 5) {
        // 4)">已撤回
        this.SignedState = 4;
        this.signer = "";
      } else if (this.navIdx === 6) {
        //0)">草稿箱
        this.SignedState = 0;
        this.signer = "";
      }
    },
    // nav栏点击
    getOwnData(index) {
      // reset
      this.ecName = "";
      this.ecCode = "";
      this.ecSponsor = "";
      this.ecDate = "";
      this.keyword = "";
      this.ContractNo = "";
      this.CreateCustomerName = "";
      this.StartTime = "";
      this.EndTime = "";
      this.pageIndex = 1;
      // set
      // this.navIdx = index;
      this.isShowLoading = true;
      this.checkType();
      this.getList();
    },
    // 关闭弹窗
    _layerClose(item) {
      this.showShade = false;
      this[item] = false;
    },
    // 催签弹窗
    _showReminder(id) {
      this.ecId = id;
      this.showShade = true;
      this.showReminder = true;
    },
    // 催签
    _reminder() {
      let params = {
        Id: this.ecId,
        CusId: this.userId,
        State: 3
      };
      getData
        .SignContract(params)
        .then(res => {
          this._layerClose("showReminder");
          if (res.success) {
            this.$message.success("催签提醒发送成功！");
          }
          // else {
          //   this.$message.error(res.msg);
          // }
        })
        .catch(error => {
          this._layerClose("showReminder");
          this.$message.error(error.data.msg || "24小时只能催一次！");
        });
    },
    // 删除弹窗
    _showDel(id) {
      this.ecId = id;
      this.showShade = true;
      this.showDel = true;
    },
    // 删除
    _del() {
      this._layerClose("showDel");
      let params = {
        Id: this.ecId
      };
      getData
        .DelContract(params)
        .then(res => {
          if (res.success) {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },
    // 已驳回原因弹窗
    _showReason(reason) {
      this.showShade = true;
      this.showReason = true;
      this.reason = reason;
    },
    //签署
    sign(id) {
      this.ecId = id;
      let params = {
        Id: this.userId
      };
      getData
        .GetCustomerSignatureList(params)
        .then(res => {
          if (res.data.recordCount) {
            this.$router.push("/mana/chooseSignature?ecId=" + id);
          } else {
            this.$confirm("你还没有可用签章，是否去申请?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.$router.push("/customerCenter/signature");
              })
              .catch(() => {});
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },
    //查看
    check(id) {
      this.ecId = id;
      this.$router.push({ path: "/mana/detail", query: { ecId: this.ecId } });
    },
    //编辑
    edit(type, id) {
      if (type == 0) {
        this.$router.push({
          path: "/mana/create/template",
          query: { id: id, type: 1 }
        });
      } else if (type == 1) {
        this.$router.push(`/mana/create/upload?Id=${id}`);
      }
    },
    // 监听路由
    fetchRoute() { 
      // query合同状态type映射选中的合同状态navIdx
      this.navIdx = Number(this.$route.query.type) || 0;
      this.checkType();
      // reset
      // this.ecName = "";
      // this.ecCode = "";
      // this.ecSponsor = "";
      // this.ecDate = "";
      // this._getList({});
      this.getOwnData();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~assets/less/table.less";
.ec-list {
  height: calc(100vh - 230px);
  min-height: 380px;
}
.table_box {
  .title {
    ul {
      width: 1598px;
      height: 36px;
      line-height: 36px;
      background: rgb(239, 239, 239);
      li {
        float: left;
        text-align: center;
        color: rgb(85, 85, 85);
        font-size: 14px;
        &:nth-child(1) {
          width: 80px;
        }
        &:nth-child(2) {
          width: 310px;
        }
        &:nth-child(3) {
          width: 409px;
        }
        &:nth-child(4),
        &:nth-child(5),
        &:nth-child(6) {
          width: 200px;
        }
        &:nth-child(7) {
          width: 193px;
        }
      }
    }
  }
  .content {
    overflow: auto;
    width: 1598px;
    height: calc(100vh - 412px);
    min-height: 180px;
    max-height: 601px;
    ul {
      li {
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #eee;
        border-right: 1px solid #eee;
        &:nth-child(odd) {
          background: white;
        }
        &:nth-child(even) {
          background: rgb(249, 249, 249);
        }
        span {
          display: inline-block;
          text-align: center;
          border-left: 1px solid #eee;
          color: rgb(85, 85, 85);
          font-size: 14px;
          &:nth-child(1) {
            width: 80px;
          }
          &:nth-child(2) {
            width: 310px;
          }
          &:nth-child(3) {
            width: 409px;
          }
          &:nth-child(4),
          &:nth-child(5),
          &:nth-child(6) {
            width: 200px;
          }
          &:nth-child(7) {
            width: 152px;
            padding-left: 30px;
            button {
              width: 50px;
              height: 26px;
              background: rgb(0, 150, 255);
              border-radius: 2px;
              color: #fff;
              a {
                color: #fff;
                &:active {
                  color: #fff;
                }
              }
              &:nth-child(1) {
                margin-right: 10px;
              }
              &:nth-child(2) {
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
}
.pagination {
  overflow: hidden;
  margin-top: 30px;
  .el-pagination {
    float: right;
  }
}
/*loading*/
.loadingCircle {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
}
#signLoading {
  width: 154px;
  height: 110px;
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
