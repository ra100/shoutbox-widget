<template lang="html" src="./templates/ShSubmit.html"></template>
<script>
export default {
  props: ['user'],
  data() {
    return {
      message: this.message,
      file: this.file,
      loading: this.loading || false,
      email: this.email || null,
      name: this.name || null,
      error: this.error || false
    }
  },
  methods: {
    submit() {
      if (!this.message || this.message.length === 0 || (this.user === true && (!this.email || !this.name))) {
        return
      }
      this.error = false
      this.loading = true
      if (this.user === true) {
        let socket = this.$parent.getSocket()
        socket.post('/auth/emaillogin', {
          user: {
            email: this.email,
            name: this.name
          },
          _csrf: this.$parent.getCsrf()
        }, (data, res) => {
          this.loading = false
          if (res.statusCode === 200 && data) {
            this.$parent._data.user = data
            this.postMessage()
          } else {
            this.error = 'Chyba při přihlašování'
          }
        })
      } else {
        this.postMessage()
      }
    },
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
      let socket = this.$parent.getSocket()
      socket.get('/logout', () => {
        this.$parent._data.user = undefined
      })
    }
  }
}
</script>