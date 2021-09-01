import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import VueCompositionApi from '@vue/composition-api'
import FosungUI from 'fosung-ui'
import 'fosung-ui/lib/theme-chalk/index.css'
Vue.use(VueCompositionApi)
Vue.use(FosungUI)
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
