import api from './getDataPack';
import login from './login';
import businessLicense from './businessLicense';
import idCard from './idcard';

/*
 *api.fech argument
 * argument[0] :method
 * argument[1] :url
 * argument[2] :parmas
 * return response.data
 */
export default {
	// 判断是否是第一次创建合同
	checkIsFirst(params) {
	    return api.fetch('get', "/MerContract/IsFirst", params);
	},
	// 获取基本资料
	getcustorInfor(params) {
	    return api.fetch('get', "/Customer/GetCustomerInfo", params);
	},
	// 获取验证码
	getVerification(params) {
	    return api.fetch("post", "/Customer/SendMobileVerifyCode", params);
	},
	// 修改密码
  	changePsd(params) {
    	return api.fetch("get", "/Customer/UpdatePwd", params);
  	},
  	// 变更手机/邮箱认证
  	changeTelOrMail(params) {
    	return api.fetch("get", "/SecurityCenter/ChangeCertification", params);
  	},
  	// 变更邮箱认证第二步
  	changeEmail(params) {
    	return api.fetch("get", "/MerContract/EditECEmail", params);
  	},
  	// 变更手机认证第二步
  	changeTel(params) {
    	return api.fetch("get", "/SecurityCenter/ChangeCertificationMoblie", params);
  	},
  	login(params) {
	    return login.fetch('post', '/api/login', params);
	},
	//登录退出
  	loginOut(params) {
    	return login.fetch('post', '/api/logout', params);
  	},
	//支付方式列表
	getPayTypeList(params){
      return api.fetch("post","/Customer/GetPayTypeList",params);
    },
    // 获取客户签章列表
  	signList(params) {
    	return api.fetch("post", "/ElectronicContract/GetCustomerSignatureList", params);
  	},
  	// 通过客户签章ID获取信息
  	getSignById(params) {
    	return api.fetch("post", "/ElectronicContract/GetCustomerSignatureById", params);
  	},
  	//个人中心我的公司列表数据
 	mycompanyList() {
    	return api.fetch('get', '/Customer/CusCompanyList')
  	},
  	//上传头像
  	upNetImage(params) {
    	return api.fetch('post', "/Upload/Save", params);
  	},
  	// 身份证识别
  	idcard(params) {
    	return idCard.fetch("post", "/rest/160601/ocr/ocr_idcard.json", params);
  	},
  	//阿里营业执照
  	businessLicense(method, params) {
    	return businessLicense.fetch(method, "/rest/160601/ocr/ocr_business_license.json", params);
  	},
  	// 个人/企业签章-实名认证
  	realNameCertification(params) {
    	return api.fetch("post", "/MerContract/RealNameCertification", params);
  	},
  	//获取套餐商品列表
  	getMealList(params){
		  return api.fetch("post", "/MerContract/GetContractPack", params);
	},		  
	//获取合同列表
	GetContractList(params){
		return api.fetch('get','/MerContract/GetContractList',params)
	},  
  	//获取我的套餐商品列表
  	getMyMealList(params){
  		return api.fetch("post", "/MerContract/GetMyPackageList", params);
  	},
  	//购买套餐
  	buyECPackage(params){
  		return api.fetch("post", "/MerContract/BuyECPackage", params);
  	},
  	//购买套餐的详情
  	getECPackageInfo(params){
  		return api.fetch("post", "/MerContract/GetECPackageInfo", params);
  	},
  	//获取订单套餐列表
  	getECPackageList(params){
  		return api.fetch("post", "/MerContract/GetECPackageList", params);
	},
	//支付页面 银联支付
  	unionPay(data) {
    	return api.fetch('post', '/Payment/Unionpay', data);
  	},
  	//支付页面 支付宝支付
  	alibabaPay(data) {
    	return api.fetch('post', '/payment/AlipayScanCode', data);
  	},
  	//支付页面 微信二维码
  	wxPayCode(data) {
    	return api.fetch('post', '/Payment/MakeActivityPayQRCode', data);
  	},
  	//使用账户余额支付
	getBalancePay(params){
      return api.fetch("post","/Payment/BalancePay",params);
    },
    //获取消息列表
	getContractMessage(params){
      return api.fetch("post","/MerContract/GetContractMessage",params);
    },
    //获取消息未读数量
	getContractMessageNum(params){
      return api.fetch("post","/MerContract/GetContractMessageNum",params);
    },
    //获取消息详情
	getMessageInfo(params){
      return api.fetch("post","/MerContract/GetMessageInfo",params);
    },
    //删除消息
	delMessage(params){
      return api.fetch("post","/MerContract/DelMessage",params);
    },
		
		//-------------刘鹏 合同新接口---------------
		//GetCustomerSignatureList
	getContractNumber(params){
  		return api.fetch("post", "/MerContract/GetContractNumber", params);
	},
	//获取 合同列表
	getContractList(params){
  		return api.fetch("post", "/MerContract/GetContractList", params);
	},
	//获取合同详情
	getContractDetail(params){
  		return api.fetch("post", "/MerContract/GetContractInfo", params);
	},
	//获取签署人列表（公司 / 个人）
	getCustomerSignerList(params){
  		return api.fetch("post", "/MerContract/GetSignerList", params);
	},
	//新增签署人（公司 / 个人信息）
	getAddSigner(params){
  		return api.fetch("post", "/MerContract/AddSigner", params);
	},
	//编辑 修改签署人信息 (个人 / 公司)
	getEditSigner(params){
  		return api.fetch("post", "/MerContract/EditSigner", params);
	},
	//删除 签署人信息 (个人 / 公司)
  	getDelSigner(params){
    	return api.fetch("post", "/MerContract/DelSigner", params);
  	},
	//合同签署
	SignContract(params){
		return api.fetch('post','/MerContract/SignContract',params)
	},
	//删除合同
	DelContract(params){
		return api.fetch('post','/MerContract/DelContract',params)
	},
	//获取签章列表
	GetCustomerSignatureList(params){
		return api.fetch('post','/MerContract/GetCustomerSignatureList',params)
	},
	//获取模板分类 
	GetTemplateClass(params){
		return api.fetch('get','/MerContract/GetTemplateClass',params)
	},
	// 获取我的模板分类 
	GetMyTemplateClass(params){
		return api.fetch('post','/MerContract/GetMyTemplateClass',params)
	},

	//获取系统模板列表 
	getContractTemplateList(params){
		return api.fetch('post','/MerContract/ContractTemplateList',params)
	},
	//获取我的模板列表
	getCustomerTemplateList(params){
		return api.fetch('post','/MerContract/GetCustomerTemplateList',params)
	},
	//删除我的领用模板
	delMyContractTemplate(params){
		return api.fetch('post','/MerContract/DelContractTemplate',params)
	},
	//获取系统合同模板详情
	getContractTemplateInfo(params){
		return api.fetch('post','/MerContract/ContractTemplateInfo',params)
	},
	//用户领用系统模板
	addMyTemplate(params){
		return api.fetch('post','/MerContract/AddMyTemplate',params)
	},
	//创建合同
	addMerchantContract(params){
		return api.fetch('post','/MerContract/EditsMerchantContract',params)
	},
	// 邮箱认证
	checkEmail(params){
		return api.fetch("get","/SecurityCenter/ChangeCertificationConfirm",params);
	},
}
