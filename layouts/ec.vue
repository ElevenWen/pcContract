<template>
  <div class="commonWrap">
    <!-- 公共头部 -->
    <div class="headerWrap"><topBanner/></div>

    <div class="middleWrap">
      <!-- 左边公共导航 -->
      <div class="leftNavWrap"><leftNav/></div>

      <!-- 主体内容 -->
      <!-- <div class="ContensWrap"> -->
      <nuxt/>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import leftNav from "~/components/leftNav.vue";
import topBanner from "~/components/topBanner.vue";

export default {
  components: {
    leftNav,
    topBanner
  }
};
</script>

<style lang="less" scoped>
// 全局样式
.commonWrapa {
  min-width: 1900px;
  // min-width: 1400px;
  // .middleWrap .leftNavWrap {
  //   flex: none;
  // }
  // .middleWrap .ContensWrap{
  //   flex: 1;
  //   width: auto;
  // }
}
.middleWrap {
  display: flex;
  overflow: hidden;
  width: 100%;
  height: calc(100% - 78px);
  // 内容区
  /deep/ .ContensWrap {
    // overflow-x: hidden;
    // flex: 88.5;
    // margin: 20px;
    // width: 1640px;
    height: 100%;
    background-color: #fff;
    > header {
      position: relative;
      border-bottom: 1px solid #e5e5e5;
      background-color: #fff;
      .head-title {
        margin-left: 80px;
      }
    }
    .go-back {
      position: absolute;
      margin-left: 20px;
      padding-left: 13px;
      line-height: 59px;
      font-size: 16px;
      color: #666;
      background: url(~assets/images/back.png) no-repeat 0 22px;
      cursor: pointer;
    }
    .head-title {
      margin-left: 20px;
      height: 59px;
      line-height: 59px;
      font-size: 18px;
      font-weight: bold;
      color: #000;
    }
  }
}
</style>
<style lang="less" src="~/assets/less/mana/layer.less"></style>
