import Vue from 'vue'
import App from './App.vue'

/* eslint-disable no-new */
new Vue({
  el: '#shoutbox-widget',
  template: '<App :title="title"/>',
  render (h) {
    return h(App, {
      props: {
        title: this.$el.attributes.title && this.$el.attributes.title.value
      }
    })
  }
})
