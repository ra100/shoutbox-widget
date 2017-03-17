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
  props: ['data', 'socket', 'user', 'stream', 'renewCsrf', 'type'],
  data() {
    return {
      showReply: this.showReply || false,
      toggle: this.toggle || false
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
      this.toggle = false
    },
    unreview() {
      this.socket.put(`/messages/${this.data.id}`, {
        id: this.data.id,
        reviewed: false,
        _csrf: window.CSRF
      })
      this.toggle = false
    },
    publish() {
      this.socket.put(`/messages/${this.data.id}`, {
        id: this.data.id,
        published: true,
        reviewed: true,
        _csrf: window.CSRF
      })
      this.toggle = false
    },
    unpublish() {
      this.socket.put(`/messages/${this.data.id}`, {
        id: this.data.id,
        published: false,
        reviewed: true,
        _csrf: window.CSRF
      })
      this.toggle = false
    },
    remove() {
      this.socket.delete(`/messages/${this.data.id}`, {
        _csrf: window.CSRF
      })
      this.toggle = false
    },
    toggleFloat() {
      this.toggle = !this.toggle
    }
  }
}
</script>
