export default function ({store,error,route ,redirect }) {
	if(process.server  & store.state.authUser == null)  {

	}

	if( process.client){
	}
	//route 此处获取route路由, 限制用户登录
//	if(route.fullPath  == '/cart/cart'){// 进入cart.vue 页面要求必须为登录状态
//		if (!store.state.authUser) { //未鉴权提示403
//
//		    return    redirect('/loginAndRegister/login'); //重定向登录页面暂时为根目录
//		}
//	}
 

 
}