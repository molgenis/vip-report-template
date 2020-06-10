import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import i18n from './i18n'
import Api from "@molgenis/vip-report-api"
import router from './router'
import store from './store/store'

Vue.config.productionTip = false

declare global {
  interface Window {
    api: any;
  }
}

Vue.prototype.$api = new Api(window.api)

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
