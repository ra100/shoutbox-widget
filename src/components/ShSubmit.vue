<template lang="html" src="./templates/ShSubmit.html"></template>
<script>
export default {
  props: ['user', 'socket'],
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
      let payload = {
        message: this.message,
        stream: this.$parent._data.id,
        _csrf: window.CSRF
      }
      if (typeof this.file !== 'undefined') {
        payload.image = {
          data: this.file,
          name: this.file.name
        }
      }
      this.socket.post('/messages/submit', payload, (data, err) => {
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
    }
  }
}
</script>