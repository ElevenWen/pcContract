import axios from 'axios'
import qs from 'qs'
import { getDataPort } from './perPort.js'
import tool from "~/assets/lib/tool";

var axios_hub = axios.create({
	baseURL: getDataPort, // 线上开发环境
	timeout: 123123,
});




axios_hub.defaults.timeout = 123123;
axios_hub.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios_hub.defaults.retry = 2;
axios_hub.defaults.retryDelay = 1000;


// 线上开发环境
axios_hub.defaults.baseURL = getDataPort;
//
// 线上生产环境

//POST传参序列化
axios_hub.interceptors.request.use((config) => {
	var token = "";
	
	if(process.client && tool.loadFromLocal("CustomerMesg","ALL")){
		token = tool.loadFromLocal("CustomerMesg","ALL").Token;
	}
  	if(config.method  === 'post'){
	  	var patt2 = new RegExp("/Upload/Save");
	  	if(!patt2.test(config.url)){
		    config.data.datatype = 'json';
		    config.data.Token = token;
		    config.data = qs.stringify(config.data);
		    // console.log(config)
	   	}
	}else if (config.method  === 'get') {
		if (config.params) {
     //当属性存在覆盖
			config.params.Token = token;
			config.params.datatype = "json";
		}else{
     //不存在添加
			config.params = {
				"Token" :token,
				"datatype":"json"
			}
		}
    }
    return config;
},(error) =>{
    return Promise.reject(error);
});

//返回状态判断
axios_hub.interceptors.response.use((res) =>{
    if(!res.data.success){
       return Promise.reject(res)
    }
    return res;
}, (error) => {
    return Promise.reject(error).then(function(reason) {
            // 未被调用
          }, function(reason) {
          });
});
export default{
    fetch(type, url, params) {
        return new Promise((resolve, reject) => {
            switch(type){
                case 'post':
                    axios_hub.post(url, params)
                    .then(response => {
                      resolve(response.data);
                    } )
                    .catch((error) => {
                       reject(error)
                    })
                    break;
                case 'get':
                    axios_hub.get(url, params)
                    .then(response => {
                      resolve(response.data);
                    })
                    .catch((error) => {
						reject(error)
                    })
                    break;
                case 'all':
               		axios_hub.all(url, params)
                    .then(response => {
                      resolve(response.data);
                    },err =>{
                      reject(err);
                    })
                    .catch((error) => {
                        reject(error)
                    })
                    break;
            }

        })
    }
}

