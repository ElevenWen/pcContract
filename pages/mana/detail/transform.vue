<template>
  <div class="whiteBackground">
 <!-- 法大大合同签署完毕后的承载页面  -->
  </div>
</template>

<script>
import getData from "~/store/ajaxAPI/getData";
import tool from "~/assets/lib/tool.js";
export default {
  
  components: {}, 
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
     
    };
  },
   beforeRouteEnter (to, from, next) {  //合同签署完毕
    if(process.client){  
      if (top.location.href != self.location.href) {
       // top.location.href = location.href;   
        top.location.href =  'https://ec.wqbol.com/mana/list';   
        next(vm => { 
           // 通过 `vm` 访问组件实例
         })  
      } else{
        console.log(1)
         next(vm => { 
           // 通过 `vm` 访问组件实例
         }) 
      } 
    } else{  //服务器
        console.log(2)
    
       next(vm => { 
           // 通过 `vm` 访问组件实例
       }) 
    } 
  },

   
};
</script>

 

<style scoped>
.whiteBackground{
  background: red;
  width: 100%;
  height: 100%;
}
 
</style>
