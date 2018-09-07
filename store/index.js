import  tool from '~/assets/lib/tool'

export const state = () => ({
  authUser:null
})

export const mutations = {
  loginDVisible(state,data) {
    if( typeof window != "undefined"  ){  //防止在vue加前登录报错
       tool.saveToLocal('CustomerMesg',data);
       
       tool.addCookie(JSON.stringify(data),24);
    }
    state.authUser = data || null
  },
  lognOut_X_M(state,data){
    if( typeof window != "undefined"  ){  //防止在vue加前登录报错
      tool.removeLocal('CustomerMesg');
      
      tool.delCookie();
    }
    state.authUser = null
  },
  SET_USER(state,data) {
    state.authUser = data
  },
}


export const actions = {
  nuxtServerInit({ //初始化服务器,获取服务器数据
    commit
  }, {
    req,
    route
  }) { //第一次调用未undefined
    if (req.session && req.session.authUser) { 
        commit('SET_USER', req.session.authUser)
    }else{
        commit('lognOut_X_M', null);
    }
  },
  loginDialogVisible({commit}){
    commit('loginDialogVisible')
  },
  //签入
  loginDVisible({commit},data='null') {
      commit('loginDVisible',data)
    
  },
  lognOut_X({commit},data){//签出
    console.log(' 签出 ')
       commit('lognOut_X_M', null)
  }
}


export const getters = {
  loginDialogVisible(state) {
    return state.loginDialogVisible;
  },
}
