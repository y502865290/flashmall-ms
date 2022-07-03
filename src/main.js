import { createApp } from 'vue'
import App from './App.vue'
import Router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from './axios/index'
import vuex from './store/index'
import baseUrl from './url/index'
import systemAuthority from './authority/index';

const app = createApp(App)
app.use(vuex)
app.use(Router)
app.use(ElementPlus)
app.use(ElementPlusIconsVue)
app.config.globalProperties.$http = axios
app.config.globalProperties.$url = baseUrl

/**
 * 导入权限的index文件，然后运行里面的初始化方法
 * 以及赋一个全局标识符
 */
app.config.globalProperties.$power = systemAuthority
systemAuthority.init()


/**
 * element 的 icon引用
 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  /**
   * 守卫路由
   */
Router.beforeEach((to,from,next)=>{
  window.document.title = to.meta.title
  let username = vuex.state.user.username
  let authority = vuex.state.authority
  if(username == undefined || authority == undefined){
    if(to.path == '/'){
      next()
    }else{
      let token = sessionStorage.getItem("token")
      if(token == null){
        next('/')
        return 
      }
      axios.get(baseUrl.SysUserControllerBaseUrl + '/getUserWithAuthority',{
        params:{
          token:token
        }
      }).then((res)=>{
        if(res.data.code == 2000){
          vuex.commit('setUser',res.data.data.user)
          vuex.commit('setAuthority',res.data.data.authorityVo.authorityMap)
          next()
        }else{
          next('/')
        }
      })
    }
  }else{
    next()
  }

})


app.mount('#app')

