import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VueRangedatePicker from 'vue-rangedate-picker'
Vue.use(VueRangedatePicker)
Vue.component("DatePicker", VueRangedatePicker)

new Vue({
  render: h => h(App)
}).$mount('#app')
