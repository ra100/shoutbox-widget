<style lang="scss" src="./styles/ShSubmit.scss" scoped></style>
<template lang="html" src="./templates/ShSubmit.html"></template>
<script>
let retry = 0

export default {
  props: ['user', 'socket', 'parentId', 'stream', 'feed', 'afterSubmit', 'renewCsrf'],
  data () {
    return {
      message: '',
      file: '',
      image: '',
      loading: false,
      error: false
    }
  },
  methods: {
    postMessage () {
      this.loading = true
      const url = '/messages/submit'
      let payload = {
        message: this.message,
        stream: this.stream,
        feed: this.feed,
        _csrf: window.CSRF
      }
      if (typeof this.file !== 'undefined' && this.file !== '') {
        payload.image = {
          data: this.file,
          name: this.file.name
        }
      }
      if (this.user && this.user.editor) {
        payload.reviewed = true
        payload.published = true
      }
      if (this.parentId) {
        payload.parentMessage = this.parentId
        payload.isResponse = true
      }
      this.socket.post(url, payload, (data, jwres) => {
        this.loading = false
        if (![200, 201].includes(jwres.statusCode)) {
          console.error(jwres.statusCode)
          if (data.text === 'CSRF mismatch' && retry < 3) {
            retry++
            this.renewCsrf(this.postMessage)
            return
          } else {
            retry = 0
            this.error = 'Chyba odeslání'
            return
          }
        }
        retry = 0
        if (data) {
          this.afterSubmit(data)
          this.resetInput()
        }
      })
    },
    selectFile () {
      this.$refs.upload.click()
    },
    removeFile () {
      this.image = undefined
      this.file = undefined
    },
    resetInput () {
      this.error = false
      this.message = ''
      this.file = undefined
      this.image = undefined
    },
    onFileChange (event) {
      this.error = false
      this.file = event.target.files[0] || event.dataTransfer.files[0]
      this.$validator.validateAll()
      if (!this.errors.errors.find(f => f.field === 'upload') && this.file) {
        this.image = window.URL.createObjectURL(this.file)
      }
    }
  }
}
</script>
