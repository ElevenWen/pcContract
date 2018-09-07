import * as types from '~/store/ajaxAPI/mutations_types'
import   getData  from '~/store/ajaxAPI/getData'
import tool from "~/assets/lib/tool.js";

export const state = ()=>({
	notifiData:[],//消息列表
	unreadNum:0,//未读消息数量
	mesInfo:0,//获取消息详情
})

export const getters = {
	notificationData(state){
        return state.notifiData
    },
    unReadNum(state){
        return state.unreadNum
    },
    mesInfoContent(state){
        return state.mesInfo
    },
}

export const mutations = {
	[types.NOTIFICATION](state, data){
        state.notifiData = data;
    },
    [types.UNREADNUM](state, data){
        state.unreadNum = data;
    },
    [types.MESINFO](state, data){
        state.mesInfo = data;
    },
}

export const actions = {
	//消息列表
	getMessage({commit},data){
		return 	getData.getContractMessage(data)
				.then((res)=>{
					let ecData = res.data;
					ecData.list.forEach((val)=>{
						let _value = val.CreateDate.replace(/\D/gi, "");
		  				val.CreateDate = tool.formatDate(_value, "yyyy-MM-dd");
					})
					
					return commit(types.NOTIFICATION,ecData);
				})
				.catch((error)=>{
					
				})
			
	},
	//未读消息数量
	getContractMessageNum({commit},data){
		return 	getData.getContractMessageNum(data)
				.then((res)=>{
					return commit(types.UNREADNUM,res.data.Num);
				})
				.catch((error)=>{
					
				})
			
	},
	//获取消息详情
	getMessageInfo({commit},data){
		return 	getData.getMessageInfo(data)
				.then((res)=>{
					return commit(types.MESINFO,res.data);
				})
				.catch((error)=>{
					
				})
			
	},
}
