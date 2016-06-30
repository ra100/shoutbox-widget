<template lang="html" src="./templates/ShSubmit.html"></template>
<script>
export default {
  props: ['user'],
  data() {
    return {
      message: this.message,
      file: this.file,
      loading: this.loading || false
    }
  },
  methods: {
    submit() {
      if (!this.message || this.message.length === 0) {
        return
      }
      this.loading = true
      let socket = this.$parent.getSocket()
      let payload = {
        message: this.message,
        feed: this.$parent._data.form,
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
        this.$parent.addMessage(data.message)
        this.$parent.mergeMessages()
        this.resetInput()
      })
    },
    resetInput() {
      this.message = ''
      this.file = undefined
    },
    onFileChange(event) {
      this.file = event.target.files[0] || event.dataTransfer.files[0]
    },
    logout() {
      let socket = this.$parent.getSocket()
      socket.get('/logout', () => {
        this.$parent._data.user = undefined
      })
    }
  }
}
</script>