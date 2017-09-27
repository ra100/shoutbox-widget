<style lang="scss" src="./styles/ShMessageAdmin.scss"></style>
<template lang="html" src="./templates/ShMessageAdmin.html"></template>
<script>
import ShSubmit from './ShSubmit'

const logError = (data, jwres) => {
  if (jwres.statusCode !== 200) {
    console.error(jwres.body)
  }
}

export default {
  components: {
    ShSubmit
  },
  props: ['data', 'socket', 'user', 'stream', 'renewCsrf', 'type'],
  data () {
    return {
      showReply: this.showReply || false,
      toggle: this.toggle || false
    }
  },
  methods: {
    review () {
      this.socket().request({
        method: 'put',
        url: `/messages/${this.data.id}`,
        data: {
          id: this.data.id,
          reviewed: true
        },
        headers: {
          'X-CSRF-Token': window.CSRF
        }
      }, logError)
      this.toggle = false
    },
    reject () {
      this.socket().request({
        method: 'put',
        url: `/messages/${this.data.id}`,
        data: {
          id: this.data.id,
          reviewed: true,
          published: false
        },
        headers: {
          'X-CSRF-Token': window.CSRF
        }
      }, logError)
      this.toggle = false
    },
    publish () {
      this.socket().request({
        method: 'put',
        url: `/messages/${this.data.id}`,
        data: {
          id: this.data.id,
          published: true,
          reviewed: true
        },
        headers: {
          'X-CSRF-Token': window.CSRF
        }
      }, logError)
      this.toggle = false
    },
    unpublish () {
      this.socket().request({
        method: 'put',
        url: `/messages/${this.data.id}`,
        data: {
          id: this.data.id,
          published: false,
          reviewed: true
        },
        headers: {
          'X-CSRF-Token': window.CSRF
        }
      }, logError)
      this.toggle = false
    },
    remove () {
      // DELETE doesn't work in Fx and maybe other browsers
      this.socket().request({
        method: 'get',
        url: `/messages/destroy/${this.data.id}`,
        headers: {
          'X-CSRF-Token': window.CSRF
        }
      }, logError)
      this.toggle = false
    },
    toggleFloat () {
      this.toggle = !this.toggle
    }
  }
}
</script>
