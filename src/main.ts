import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import i18n from './i18n'
import vSelect from "vue-select";
import Api from "@molgenis/vip-report-api"

Vue.config.productionTip = false

Vue.component('v-select', vSelect)

declare global {
  interface Window {
    api: any;
  }
}

Vue.prototype.$api = new Api(window.api)

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
