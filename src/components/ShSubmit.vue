<template lang="html" src="./templates/ShSubmit.html"></template>
<script>
import request from 'superagent'

export default {
  props: ['user'],
  data() {
    return {
      message: this.message,
      file: this.file,
      loading: this.loading || false,
      error: this.error || false
    }
  },
  methods: {
    postMessage() {
      this.loading = true
      let socket = this.$parent.getSocket()
      let payload = {
        message: this.message,
        stream: this.$parent._data.id,
        _csrf: this.$parent.getCsrf()
      }
      if (typeof this.file !== 'undefined') {
        payload.image = {
          data: this.file,
          name: this.file.name
        }
      }
      socket.post('/messages/submit', payload, (data, err) => {
        this.loading = false
        if (data.message) {
          this.$parent.addMessage(data.message)
          this.$parent.mergeMessages()
          this.resetInput()
        }
      })
    },
    resetInput() {
      this.error = false
      this.message = ''
      this.file = undefined
    },
    onFileChange(event) {
      this.error = false
      this.file = event.target.files[0] || event.dataTransfer.files[0]
    },
    logout() {
      let csrf = this.$parent.getCsrf()
      request.get('https://shoutbox.rozhlas.cz/logout')
        .set('X-CSRF-Token', csrf)
        .set('X-Requested-With', 'XMLHttpRequest')
        .withCredentials()
        .end((err, res) => {
          if (!err && res.ok && res.body) {
            this.$parent._data.user = undefined
            this.$parent.renewCsrf()
          }
        })
    }
  }
}
</script>