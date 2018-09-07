

const express = require('express')
var qs = require('querystring')
// Create express router
const router = express.Router()
var request = require('request');
// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
var app = express();
const fs = require("fs");


let  loginPort = null;                 //net 后台端口号  天眼查接口 seo接口 登陆接口
let xinlang = 'https://api.t.sina.com.cn/short_url/shorten.json'; // 短链接转换接口
let _NODE_ENV = process.env._NODE_ENV;
// let port = process.env.npm_package_config_nuxt_port ;  //本地端口
// let _host = process.env.npm_package_config_nuxt_host === '0.0.0.0'  ? "localhost" : process.env.npm_package_config_nuxt_host; //本地ip


// console.log( process.env )

if(( _NODE_ENV.indexOf('Net') >= 0)){
  loginPort = `https://api.wqbol.net`; //case 'devNet' || 'startNet'  ||  'generateNet':// net开发环境 || net生产环境 || net静态站点

  // loginPort = `//api.wqbol.net`; //case 'devNet' || 'startNet'  ||  'generateNet':// net开发环境 || net生产环境 || net静态站点

}else if(( _NODE_ENV.indexOf('Com') >= 0)){
  loginPort =  `https://api.wqbol.com`; // case 'devCom' || 'startCom' || 'generateCom':// com开发环境 || com生产环境 || com静态站点
}


router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
});
// Add POST - /api/login

function getHeader() {
  return {
    "Content-type": "application/json;text/html;text/plain; charset=UTF-8",//发送头 不能少否则后台可能无法解析
    "Accept": "text/html,text/plain,*/*",
  };
}



router.post('/login', (req, res) => {
  var bodyTemp =  req.body;
  bodyTemp.dataType = 'json';
  let option1 = {
    json: true, //参数格式
    header : getHeader(),
    body: bodyTemp//参数
  };


  request.post(`${loginPort}/Customer/Login`, option1, function(error, response, body) {
    if(typeof body  == 'undefined'){
      return res.json({
          code: 401 ,
          data:{
           message: '登录失败，请检查账号密码输入是否正确'
          }
      })
    }

    if(typeof body != 'object'){
      // var error = body.indexOf('错误提示');
      var abc = body.indexOf("用户名或密码")
      var edf = body.indexOf("执行加密")
        if(abc > 0){
          req.session.authUser = null;

          return  res.json({
              code: 401 ,
              data:{
                 message: '登录失败，请检查账号密码输入是否正确'
              }
            })
        }else if( edf > 0 ){
           req.session.authUser = null;
           return  res.json({
            code: 402 ,
            data:{
                 message: '登录超时'
               }
            })
        }else {
           req.session.authUser = null;
           return  res.json({
            code: 403 ,
            data:{
                 message: '未知错误'
               }
            })
        }
    }
    else{
      req.session.authUser = body.data
      body.code = 400
      // console.log(' req.session.authUser', req.session.authUser)
      return res.json(body)
    }
  })
})

// Add POST - /api/logout
router.post('/logout', (req, res) => {
  // console.log('退出')
  delete req.session.authUser
  return res.json({
    code:400,
    data:{
      logout:true
    }
  })
})

// Export the server middleware
module.exports = {
  path: '/api',
  handler: router
}
