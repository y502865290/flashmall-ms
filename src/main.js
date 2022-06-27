import { createApp } from 'vue'
import App from './App.vue'
import Router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(Router)
app.use(ElementPlus)
app.use(ElementPlusIconsVue)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.mount('#app')

