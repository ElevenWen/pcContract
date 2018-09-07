import Vue from 'vue'
import tool from "~/assets/lib/tool.js";

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import axios from 'axios'
Vue.prototype.$http = axios;

//通过cookie再把数据存localstorage
if(process.client && tool.getSSOCookie()){
	tool.saveToLocal('CustomerMesg',tool.getSSOCookie());
}

//没有cookie则清除本地,且为本地开发时不执行
if(process.client && !tool.getSSOCookie() && process.env._NODE_ENV != "devNet"){
	tool.removeLocal('CustomerMesg');
}
