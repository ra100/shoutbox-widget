import Vue from 'vue'
import App from './App.vue'
import VueMoment from 'vue-moment'

Vue.use(VueMoment)

/* eslint-disable no-new */
new Vue({
  el: '#shoutbox',
  components: {App}
})
