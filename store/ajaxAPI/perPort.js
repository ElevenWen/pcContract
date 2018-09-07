//     "devNet"  : "cross-env _NODE_ENV=devNet nuxt",
//     "buildNet": "cross-env _NODE_ENV=startNet   nuxt build",
//     "startNet": "cross-env _NODE_ENV=startNet  nuxt start",
//     "devCom"  : "cross-env _NODE_ENV=devCom nuxt",
//     "buildCom": "cross-env _NODE_ENV=startCom   nuxt build",
//     "startCom": "cross-env _NODE_ENV=startCom   nuxt start",
//     "generateNet": "cross-env _NODE_ENV=generateNet nuxt generate",
//     "generateCom": "cross-env _NODE_ENV=generateCom nuxt generate",
//     "lint": "eslint --ext .js,.vue --ignore-path .gitignore .",
//     "precommit": "npm run lint"

import hostConfig from '../../package.json'

let getDataPort = null; //net 后台端口号  天眼查接口 seo接口 登陆接口
let loginPort = null; // 登陆接口
let port = null; // 端口
let _host = null;
let urlShortPort = null; // 短链接转换接口
let payment_wxCode = null; // 微信支付 支付宝支付 银联支付payment 页面 unionpay页面
let idCardPort = null; // 身份证识别接口
let businessLicensePort = null; // 阿里巴巴营业执照接口
let websitePort = null;//官网地址，跳回商城登录
// ip
let _NODE_ENV = process.env._NODE_ENV; //运行环境


// console.log( process.title,'????')
if (process.title == "browser") { //本地环境
    port = process.env._custom; //本地端口
    _host = process.env._host === '0.0.0.0' ? "localhost" : process.env._host; //本地ip
} else { // 服务器环境
    port = process.env.npm_package_config_nuxt_port; //服务器本地端口
    _host = process.env.npm_package_config_nuxt_host === '0.0.0.0' ? "localhost" : process.env.npm_package_config_nuxt_host; //服务器本地ip
}


// console.log( process.env  )
// console.log( process  )
// if 条件开始
switch (_NODE_ENV) {
    case 'devNet': // net开发环境
        getDataPort = "https://api.wqbol.net";
        payment_wxCode = 'https://api.wqbol.net';
        idCardPort = 'https://dm-51.data.aliyun.com';
        businessLicensePort = 'https://dm-58.data.aliyun.com';
        websitePort = `http://${hostConfig.config.nuxt.host}:${hostConfig.config.nuxt.port}`;
        if (_NODE_ENV.indexOf('devNet') >= 0) { //本地环境
            port = process.env._custom; //本地端口
            _host = process.env._host === '0.0.0.0' ? "localhost" : process.env._host; //本地ip
            loginPort = `http://${_host}:${port}`;
            urlShortPort = `http://${_host}:${port}`;
			
        } else if (_NODE_ENV.indexOf('startNet') >= 0) { //net 服务环境 === 切换环境需要 手动切换域名
            loginPort = `https://www.wqbol.net`;
            urlShortPort = `https://www.wqbol.net`;

        }
        break;
    case 'startNet': // net生产环境
        getDataPort = "https://api.wqbol.net";
        loginPort = 'https://www.wqbol.net';
        payment_wxCode = 'https://api.wqbol.net';
        idCardPort = 'https://dm-51.data.aliyun.com';
        businessLicensePort = 'https://dm-58.data.aliyun.com';
        urlShortPort = `https://www.wqbol.net`;
        websitePort = `https://www.wqbol.net`;
        break;
    case 'generateNet': //net静态站点
        getDataPort = "https://api.wqbol.net";
        loginPort = 'https://www.wqbol.net';
        payment_wxCode = 'https://api.wqbol.net';
        idCardPort = 'https://dm-51.data.aliyun.com';
        businessLicensePort = 'https://dm-58.data.aliyun.com';
        urlShortPort = `https://www.wqbol.net`;
        websitePort = `https://www.wqbol.net`;
        break;
    case 'devCom': // com开发环境
        getDataPort = "https://api.wqbol.com";
        payment_wxCode = 'https://api.wqbol.com';
        idCardPort = 'https://dm-51.data.aliyun.com';
        businessLicensePort = 'https://dm-58.data.aliyun.com';
        websitePort = `http://${hostConfig.config.nuxt.host}:${hostConfig.config.nuxt.port}`;
        if (_NODE_ENV.indexOf('devCom') >= 0) { //本地环境
            loginPort = `http://${_host}:${port}`;
            urlShortPort = `http://${_host}:${port}`;

        } else if (_NODE_ENV.indexOf('startCom') >= 0) { //net 服务环境
            loginPort = `https://www.wqbol.com`;
            urlShortPort = `https://www.wqbol.com`;
        }
        break;
    case 'startCom': // com生产环境
        getDataPort = "https://api.wqbol.com";
        loginPort = 'https://www.wqbol.com';
        payment_wxCode = 'https://api.wqbol.com';
        idCardPort = 'https://dm-51.data.aliyun.com';
        businessLicensePort = 'https://dm-58.data.aliyun.com';
        urlShortPort = `https://www.wqbol.com`;
        websitePort = `https://www.wqbol.com`;
        break;

    case 'generateCom': //com静态站点
        getDataPort = "https://api.wqbol.com";
        loginPort = 'https://www.wqbol.com';
        payment_wxCode = 'https://api.wqbol.com';
        idCardPort = 'https://dm-51.data.aliyun.com';
        businessLicensePort = 'https://dm-58.data.aliyun.com';
        urlShortPort = `https://www.wqbol.com`;
        websitePort = `https://www.wqbol.com`;
        break;
}




// console.log('--------perPort.js----------' ,urlShortPort )
// ------------------ http://api.wqbol.net http://dm-58.data.aliyun.com http://192.168.1.215:10011 http://192.168.1.215:10011 http://acct.wqbol.net
export {
    getDataPort,
    loginPort,
    urlShortPort,
    payment_wxCode,
    idCardPort,
    businessLicensePort,
    websitePort
}
