import Vue from 'vue'
import ElementUI from 'element-ui'
import '../theme/index.css'
import './assets/styles/index.scss'

import App from './App.vue'
import router from './router'
import store from './store'
import plugin from './plugin'

Vue.use(ElementUI)
Vue.use(plugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
