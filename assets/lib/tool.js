import getd from '~/store/ajaxAPI/getData.js';
import hostConfig from '../../package.json';

/***
*  saveToLocal  loadFromLocal
*  _navigatorName__:浏览器key, id:存储 本地的Value对应key,value:本地存储id对应的value值:,若没有数据返回{Booean,default:false}
*  举例1:this.commonTool.saveToLocal("businessSearchKey","id","searchName","北京百度网讯科技有限公司") ==>businessSearchKey (对应浏览器key) ;{"id":{"searchName":"北京百度网讯科技有限公司"}}(对应浏览器value)
*  举例2:this.commonTool.saveToLocal("businessSearchKey",{ 'tab':{name:'tab'},'content':{name:'content'} }); ==>businessSearchKey (对应浏览器key) ;{"tab":{"name":"tab"},"content":{"name":"content"}}(对应浏览器value)
*
*
*
***/
const saveToLocal =  function saveToLocal(_navigatorName_,id, key, value) {
	if(typeof id  ==='object' && !Array.isArray(id) ){//判断对象
		let value = JSON.stringify(id);
		window.localStorage.setItem(_navigatorName_, value);//存入数据格式 {_navigatorName_:id}
	}else{
		let navigatorName = window.localStorage[_navigatorName_];

		if (!navigatorName) {
			navigatorName = {};
			navigatorName[id] = {};
		} else {
			navigatorName = JSON.parse(navigatorName);
			if (!navigatorName[id]) {
				navigatorName[id] = {};
			}
		}
		navigatorName[id][key] = value;
		window.localStorage[_navigatorName_] = JSON.stringify(navigatorName);
	}
};


/***
* loadFromLocal
*  举例1:this.commonTool.loadFromLocal('businessSearchKey',"id",'searchName') ==>  return "北京百度网讯科技有限公司"
*  举例2:this.commonTool.loadFromLocal('businessSearchKey',"ALL") ==> return { 'tab':{name:'tab'},'content':{name:'content'} }
***/
const loadFromLocal = function loadFromLocal(_navigatorName_,id, key, def) {
	let navigatorName = window.localStorage[_navigatorName_];
	if (!navigatorName) {
		return def;
	}

	if(id.toUpperCase()==="ALL"){
		//获取_navigatorName_ 下所有数据
		let idALL = JSON.parse(navigatorName)
		return idALL;
	}else{
		//id 下面所有数据
		navigatorName = JSON.parse(navigatorName)[id];
		if (!navigatorName) {
			return def;
		}	//选择所有数据

		if( key!= undefined && (key.toString().trim() == ""  || key.toString().trim().toUpperCase() == "ALL") ){
			return navigatorName;
		}
		let ret = navigatorName[key];
		return ret || def;
	}

};

const removeLocal = function removeLocal(_navigatorName_){
	let navigatorName = window.localStorage[_navigatorName_];
	if (navigatorName) {
		window.localStorage.removeItem(_navigatorName_);
	}
}

//调用方法 formatDate(1497974400000, "yyyy-MM-dd hh:mm:ss")
function padLeftZero(str){
	return  ('00' + str).substr(str.length);
}
function formatDate(date, fmt) {
 var dataTemp = null ;
  if(date==undefined){
    return
  }

  if (date.toString().length >  10) {
    dataTemp = new Date(Number(date));
  } else {
     dataTemp = new Date(date.replace(/\./ig,"-"));
  }
  if (/(y+)/.test(fmt)) {
    // //console.log(RegExp.$1)
    //yeal+ '' 转为字符
    // .substr(4- RegExp.$1.length) 看是yy 还是yyyy
    fmt = fmt.replace(RegExp.$1, (dataTemp.getFullYear() + '').substr(4 - RegExp.$1.length))
  };
  let o = {
    'M+': dataTemp.getMonth() + 1,
    'd+': dataTemp.getDate(),
    'h+': dataTemp.getHours(),
    'm+': dataTemp.getMinutes(),
    's+': dataTemp.getSeconds(),
  }

  for (let k in o) {
    //new RegExp( `(${k})`)  等价于  new RegExp( (M+) )
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    };
    // //console.log(RegExp.$1);
	}


  return fmt;
};

//正则判断(str:判断类型，val:输入框的值)
function regularJudgement(str,val){
	//console.log(str)
	//手机号判断
	if (str == "phone") {
		var reg = /(^1[3|4|5|7|8][0-9]{9}$)/.test(val);
		if (reg) {
			return true;
		} else{
			return false;
		}//验证码判断
	}else if (str == "noteCode") {
		if (val.length>5) {
			return true;
		} else{
			return false;
		}//税号/账号判断
	}else if (str == "taxNumber") {
		var reg = /^[A-Za-z0-9]{15,}$/.test(val);
		//console.log(reg)
		if (reg) {
			return true;
		} else{
			return false;
		}//公司地址/名称
	}else if (str == "companyAddress") {
		//console.log(val)
		var reg = /^[\(\)\（\）\u4e00-\u9fa5\w]{5,}$/.test(val);
		if (reg &&  val != undefined&& val.trim().length !=0) {
			return true;
		} else{
			return false;
		}//电话判断
	}else if (str == "telephone") {
		var reg = /^((\(\d{3,4}\)|\d{3,4}-)?\d{7,8})|(1[3|4|5|7|8][0-9]{9})$/.test(val.trim());
		if (reg) {
			return true;
		} else{
			return false;
		}
	}else if(str == "person"){
		//console.log(val)
		if (val!=undefined && val.length>=2) {
			return true;
		} else{
			return false;
		}
	}else if (str == "bankArrout") {
		var reg = /^[0-9]{6,}$/.test(val);
		if (reg) {
			return true;
		} else{
			return false;
		}//税号/账号判断
	}else if (str == "idcardNum") { //身份证号==只验证格式
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)$/.test(val.trim());
		if (reg) {
			return true;
		} else {
			return false;
		}
	} else if (str == "credictNum") { //统一社会信用代码
		var reg = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/g.test(val.trim());
		if (reg) {
			return true;
		} else {
			return false;
		}
	}else if(str == "email"){
		var reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/.test(val.trim());
		if (reg) {
			return true;
		} else {
			return false;
		}
	}else{
		return
	}
}

// 验证身份证号==会验证地区时间
function IdentityCodeValid(code) {
	var code = code.toUpperCase();
	var city = {
	  11: "北京",
	  12: "天津",
	  13: "河北",
	  14: "山西",
	  15: "内蒙古",
	  21: "辽宁",
	  22: "吉林",
	  23: "黑龙江 ",
	  31: "上海",
	  32: "江苏",
	  33: "浙江",
	  34: "安徽",
	  35: "福建",
	  36: "江西",
	  37: "山东",
	  41: "河南",
	  42: "湖北 ",
	  43: "湖南",
	  44: "广东",
	  45: "广西",
	  46: "海南",
	  50: "重庆",
	  51: "四川",
	  52: "贵州",
	  53: "云南",
	  54: "西藏 ",
	  61: "陕西",
	  62: "甘肃",
	  63: "青海",
	  64: "宁夏",
	  65: "新疆",
	  71: "台湾",
	  81: "香港",
	  82: "澳门",
	  91: "国外 "
	};
	var tip = "";
	var pass = true;

	if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
	  tip = "身份证号格式错误";
	  pass = false;
	} else if (!city[code.substr(0, 2)]) {
	  tip = "地址编码错误";
	  pass = false;
	} else {
	  //18位身份证需要验证最后一位校验位
	  if (code.length == 18) {
		code = code.split('');
		//∑(ai×Wi)(mod 11)
		//加权因子
		var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		//校验位
		var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
		var sum = 0;
		var ai = 0;
		var wi = 0;
		for (var i = 0; i < 17; i++) {
		  ai = code[i];
		  wi = factor[i];
		  sum += ai * wi;
		}
		var last = parity[sum % 11];
		if (parity[sum % 11] != code[17]) {
		  tip = "校验位错误";
		  pass = false;
		}
	  }
	}
	return {
	  flag: pass,
	  message: tip
	};
  }

// 上传身份证识别图片  inputId为input的id  type为传入的类型（1==身份证正面，2==身份证反面，3==营业执照）
// info为页面传入的值（放在对象中传入）  self为页面的this
function uploadIdcard(inputId, type, info, self) {
	// return new Promise((resolve,reject)=>{
	var obj = {};
	// console.log("info", info);
	// 选择的文件对象
	var file = null;
	var baseStr = null;
	var eleFile = document.querySelector(inputId);

	// self.loading = true; //点击上传时 进入等待

	// 压缩图片需要的一些元素和对象
	var reader = new FileReader(),
	  img = new Image();
	  
	file = eleFile.files[0];
	
	if(!eleFile.files.length) return;
	self.isShowLoading = true;
	let  loadingInstance =  self.$loading({ fullscreen: false ,target:document.getElementById('signLoading'),background: 'rgba(0, 0, 0, 0.7)'});//loading 加载样式
	// 选择的文件是图片
	if (file.type.indexOf("image") == 0) {
	  reader.readAsDataURL(file); //转base64
	}
	// 缩放图片需要的canvas
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');

	// base64地址图片加载完毕后
	img.onload = function () {
	  // 图片原始尺寸
	  var originWidth = this.width;
	  var originHeight = this.height;
	  // 最大尺寸限制
	  var maxWidth = 400,
		maxHeight = 400;
	  // 目标尺寸
	  var targetWidth = originWidth,
		targetHeight = originHeight;
	  // 图片尺寸超过400x400的限制
	  if (originWidth > maxWidth || originHeight > maxHeight) {
		if (originWidth / originHeight > maxWidth / maxHeight) {
		  // 更宽，按照宽度限定尺寸
		  targetWidth = maxWidth;
		  targetHeight = Math.round(maxWidth * (originHeight / originWidth));
		} else {
		  targetHeight = maxHeight;
		  targetWidth = Math.round(maxHeight * (originWidth / originHeight));
		}
	  }

	  // canvas对图片进行缩放
	  canvas.width = targetWidth;
	  canvas.height = targetHeight;
	  // 清除画布
	  context.clearRect(0, 0, targetWidth, targetHeight);
	  // 图片压缩
	  context.drawImage(img, 0, 0, targetWidth, targetHeight);
	  baseStr = canvas.toDataURL("image/png"); //压缩后base64数据
	};

	//传给后台
	function uploadImgToNet() {
	  var token = loadFromLocal("CustomerMesg", "ALL").Token;
	  var acv = new FormData();
	  acv.append('file', file);
	  acv.append('Token', token);
	  if (type = 1 || type == 2) {
		acv.append('type', 'idCard');
	  } else if (type == 3) {
		acv.append('type', 'businessLicense');
	  }
//	  console.log("acv", acv);

	  getd.upNetImage(acv)
		.then((res) => {
		  obj.Img = res.data.storeResult.path;
		  Object.assign(info, obj);
		})
		.catch((error) => {
		  console.log('idcard', error);
		})
	}

	// 对接阿里云身份证识别接口
	function recognitionIdcard(params) {
	  getd.idcard(params)
		.then((response) => {
		  // console.log('身份证正面', response)
		  self.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭  加载完毕后停止loading 界面
			loadingInstance.close();
			self.isShowLoading = false;
		  });
		  if (type == 1) {
			obj.name = response.name;
			obj.code = response.num;
			Object.assign(info, obj);
			uploadImgToNet();
		  } else if (type == 2) {
			uploadImgToNet();
		  }
		})
		.catch((error) => {
		  console.log(error);
			info.name = "";
			info.code = "";
			info.Img = "";
			// console.log("营业执照错误info",info);
		  self.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭  加载完毕后停止loading 界面
			loadingInstance.close();
			self.isShowLoading = false;
			self.$message({
	          showClose: true,
	          message: '请重新上传清晰的身份证图像',
	          type: 'error'
	        });
			eleFile.value = "";
		  });
		});
	}

	// 对接阿里云营业执照识别接口
	function businessLicense(params) {
	  getd.businessLicense("post", params)
		.then((response) => {
		  // console.log('营业执照', response)
		  self.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭  加载完毕后停止loading 界面
			loadingInstance.close();
			self.isShowLoading = false;
		  });
		  var objResult = JSON.parse(response.outputs[0].outputValue.dataValue);
		  // that.creditCodeC = obj.reg_num;
		  // that.companyName = obj.name;
		  obj.name = objResult.name;
		  obj.code = objResult.reg_num;
		  Object.assign(info, obj);
		  //传给后台
		  uploadImgToNet();
		  //判断是否识别出
		  if (objResult.name && (objResult.name != "FailInRecognition")) {
			obj.name = objResult.name;
		  } else {
			obj.name = "";
		  }
		  if (objResult.reg_num && (objResult.reg_num != "FailInRecognition")) {
			obj.code = objResult.reg_num;
		  } else {
			obj.code = "";
		  }
		})
		.catch((error) => {
		  // console.log("营业执照错误", error);
			info.name = "";
			info.code = "";
			info.Img = "";
			// console.log("营业执照错误info",info);
		  // that.$message.error('请重新上传清晰的营业执照图像');
		  
		  self.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭  加载完毕后停止loading 界面
			loadingInstance.close();
			self.isShowLoading = false;
			self.$message({
	          showClose: true,
	          message: '请重新上传清晰的营业执照图像',
	          type: 'error'
	        });
			//防止二次选择同张图片无效
			eleFile.value = "";
		  });
		});
	}

	// 文件base64化，以便获知图片原始尺寸
	reader.onload = function (e) {
	  //压缩前base64数据
	  var imgData = e.target.result;
	  // console.log("imgData",imgData);
	  imgData = imgData.substring(imgData.indexOf(",") + 1); //去掉base64前的字符串
	  if (type == 1) { //身份证正面
		var params = {
		  "image": imgData, //图片二进制数据的base64编码
		  "configure": "{\"side\":\"face\"}" //身份证正反面类型:face/back
		}
		recognitionIdcard(params);
	  } else if (type == 2) { //身份证反面
		var params = {
		  "image": imgData, //图片二进制数据的base64编码
		  "configure": "{\"side\":\"back\"}" //身份证正反面类型:face/back
		}
		recognitionIdcard(params);
	  } else if (type == 3) { //营业执照
		var params = {
		  "inputs": [{
			"image": {
			  "dataType": 50,
			  "dataValue": imgData
			}
		  }]
		}
		businessLicense(params);
	  }
	}
  } // uploadIdcard End

	


	function padLeftZero(str) {
		return ('00' + str).substr(str.length);
	}
	
	// 调用方法 formatDate(1497974400000, "yyyy-MM-dd mm:ss")

function formatDate(date, fmt) {

  var dataTemp = null;
  if (date == undefined) {
    return
  }

  if (date.toString().length > 10) {
    dataTemp = new Date(Number(date));
  } else {
    dataTemp = new Date(date.replace(/\./ig, "-"));
  }
  //console.log(dataTemp)
  if (/(y+)/.test(fmt)) {
    // //console.log(RegExp.$1)
    //yeal+ '' 转为字符
    // .substr(4- RegExp.$1.length) 看是yy 还是yyyy 
    //console.log(        RegExp.$1, (dataTemp.getFullYear()  ) );
    fmt = fmt.replace(RegExp.$1, (dataTemp.getFullYear() + '').substr(4 - RegExp.$1.length));
  };
  // console.log(fmt)
  let o = {
    'M+': dataTemp.getMonth() + 1,
    'd+': dataTemp.getDate(),
    'h+': dataTemp.getHours(),
    'm+': dataTemp.getMinutes(),
    's+': dataTemp.getSeconds(),
  }

  for (let k in o) {
    //new RegExp( `(${k})`)  等价于  new RegExp( (M+) )
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    };
    // //console.log(RegExp.$1); 
  }
  return fmt;
};

//添加cookie (objValue:内容,objHours：时间)
let _NODE_ENV = process.env._NODE_ENV;
function addCookie(objValue,objHours){
	let str = "sso"+ "=" + escape(objValue); 
　　if(objHours > 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失 
	　　let date = new Date(); 
	　　let ms = objHours*3600*1000; 
	　　date.setTime(date.getTime() + ms); 
		
		//设置域名
		let regN = /Net/;
		let regC = /Com/;
		
		//本地dev
		let reg = /(devNet)|(devCom)/;
		
		let domain = "";
		if(regN.test(_NODE_ENV)){
			domain = ".wqbol.net";
		}else if(regC.test(_NODE_ENV)){
			domain = ".wqbol.com";
		}else if(reg.test(_NODE_ENV)){
			domain = hostConfig.config.nuxt.host;
		}
		
	　　str += "; expires=" + date.toGMTString()+"; path=/; domain="+domain; 
　　} 
　　document.cookie = str; 
}

//获取cookie
function getSSOCookie(){ 
    let arrStr = document.cookie.split("; "); 
    for(let i = 0;i < arrStr.length;i ++){ 
        let temp = arrStr[i].split("="); 
        if(temp[0] == "sso") { 
          return JSON.parse(unescape(temp[1])); 
        } 
    } 
    return ""; 
}

//删除cookie
function delCookie(){
	//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间 
    var date =  new  Date(); 
    date.setTime(date.getTime() - 10000); 
    
    //设置域名
	let regN = /Net/;
	let regC = /Com/;
	
	//本地dev
	let reg = /(devNet)|(devCom)/;
	
	let domain = "";
	if(regN.test(_NODE_ENV)){
		domain = ".wqbol.net";
	}else if(regC.test(_NODE_ENV)){
		domain = ".wqbol.com";
	}else if(reg.test(_NODE_ENV)){
		domain = hostConfig.config.nuxt.host;
	}
	
	document.cookie = "sso" + "=a; expires=" + date.toGMTString()+"; path=/; domain="+domain; 
}

export default{
	saveToLocal,
	loadFromLocal,
	removeLocal,
	regularJudgement,
	uploadIdcard,
	IdentityCodeValid,
	formatDate,
	IdentityCodeValid,
	addCookie,
	getSSOCookie,
	delCookie,
	formatDate
}
