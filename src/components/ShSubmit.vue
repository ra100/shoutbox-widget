<style lang="scss" src="./styles/ShSubmit.scss"></style>
<template lang="html" src="./templates/ShSubmit.html"></template>
<script>
import request from 'superagent'
import icon from 'vue-icons'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate)

let retry = 0

export default {
  props: ['user', 'socket'],
  components: {
    icon
  },
  data() {
    return {
      message: this.message,
      file: this.file,
      image: this.image,
      loading: this.loading || false,
      error: this.error || false,
      errors: this.$validator.errorBag
    }
  },
  methods: {
    postMessage() {
      this.loading = true
      let payload = {
        message: this.message,
        stream: this.$parent._data.id
      }
      if (typeof this.file !== 'undefined') {
        payload.image = {
          data: this.file,
          name: this.file.name
        }
      }
      request
        .post(window.sailsURL + '/messages/submit')
        .withCredentials()
        .set('X-CSRF-Token', window.CSRF)
        .send(payload)
        .end((err, data) => {
          this.loading = false
          if (err || !data.ok) {
            if (data.text === 'CSRF mismatch' && retry < 3) {
              retry++
              this.$parent.renewCsrf(this.postMessage)
              return
            } else {
              retry = 0
              this.error = 'Chyba odeslání'
              return
            }
          }
          retry = 0
          if (data.body.message) {
            this.$parent.addMessage(data.body.message)
            this.$parent.mergeMessages()
            this.resetInput()
          }
        })
    },
    selectFile() {
      this.$refs.upload.click()
    },
    removeFile() {
      this.image = undefined
      this.file = undefined
    },
    resetInput() {
      this.error = false
      this.message = ''
      this.file = undefined
      this.image = undefined
    },
    onFileChange(event) {
      this.error = false
      this.file = event.target.files[0] || event.dataTransfer.files[0]
      this.$validator.validateAll()
      if (!this.errors.has('upload') && this.file) {
        this.image = window.URL.createObjectURL(this.file)
      }
    }
  }
}
</script>