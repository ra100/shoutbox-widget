import Vue from 'vue'
import App from './App.vue'
import VeeValidate from 'vee-validate'

/* eslint-disable no-new */
Vue.use(VeeValidate)
new Vue({
  el: '#shoutbox-widget',
  template: '<App/>',
  components: { App }
})
