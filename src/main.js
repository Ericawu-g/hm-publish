import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 加载element组件库
import ElementUI from 'element-ui'
// 加载全局全局样式文件
import 'element-ui/lib/theme-chalk/index.css'

// 全局注册element组件库
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
