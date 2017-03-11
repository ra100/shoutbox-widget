<style lang="scss" src="./styles/ShMessageAdmin.scss"></style>
<template lang="html" src="./templates/ShMessageAdmin.html"></template>
<script>
import icon from 'vue-icons'
import ShSubmit from './ShSubmit'

export default {
  components: {
    ShSubmit,
    icon
  },
  props: ['data', 'socket', 'user', 'stream', 'renewCsrf'],
  data() {
    return {
      showReply: this.showReply || false
    }
  },
  methods: {
    getSocket() {
      return this.socket
    },
    review() {
      this.socket.put(`/messages/${this.data.id}`, {
        id: this.data.id,
        reviewed: true,
        _csrf: window.CSRF
      })
    },
    unreview() {
      this.socket.put(`/messages/${this.data.id}`, {
        id: this.data.id,
        reviewed: false,
        _csrf: window.CSRF
      })
    },
    publish() {
      this.socket.put(`/messages/${this.data.id}`, {
        id: this.data.id,
        published: true,
        reviewed: true,
        _csrf: window.CSRF
      })
    },
    unpublish() {
      this.socket.put(`/messages/${this.data.id}`, {
        id: this.data.id,
        published: false,
        reviewed: true,
        _csrf: window.CSRF
      })
    }
  }
}
</script>
