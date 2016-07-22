import Vue from 'vue'
import App from './App.vue'
import VueValidator from 'vue-validator'

/* eslint-disable no-new */
Vue.use(VueValidator)
new Vue({
  el: '#shoutbox',
  components: {App}
})
