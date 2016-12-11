<template lang="html" src="./templates/ShSubmit.html"></template>
<script>
import request from 'superagent'
let retry = 0
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
      request
        .post(window.sailsURL + '/messages/submit')
        .send(payload)
        .set('X-CSRF-Token', window.CSRF)
        .end((err, data) => {
          this.loading = false
          if (err || !data.ok) {
            if (data.text === 'CSRF mismatch' && retry < 3) {
              retry++
              this.$parent.renewCsrf(this.postMessage)
              return
            } else {
              retry = 0
              console.error(err)
              this.error = 'Chyba odeslání'
              return
            }
          }
          retry = 0
          if (data.body.message) {
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