<style lang="scss" src="./styles/ShUser.scss" scoped></style>
<template lang="html" src="./templates/ShUser.html"></template>
<script>
import request from 'superagent'
import icon from 'vue-icons'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate)

export default {
  props: ['user', 'socket'],
  components: {
    icon
  },
  data() {
    return {
      displayname: this.user.displayname,
      picture: this.user.picture,
      file: this.file,
      loading: false,
      error: '',
      errors: this.$validator.errorBag
    }
  },
  methods: {
    logout() {
      const csrf = window.CSRF
      request.get('https://shoutbox.rozhlas.cz/logout')
        .set('X-CSRF-Token', csrf)
        .set('X-Requested-With', 'XMLHttpRequest')
        .withCredentials()
        .end((err, res) => {
          if (!err && res.ok && res.body) {
            this.$parent._data.user = undefined
            this.$parent._data.loginvisible = false
            this.$parent._data.uservisible = false
            this.$parent._data.submitvisible = false
            this.$parent.renewCsrf()
            window.eventHub.$emit('user-load')
          }
        })
    },
    updateUser() {
      const csrf = window.CSRF
      const payload = {}
      payload.displayname = this.displayname
      if (this.file) {
        payload.image = {
          data: this.file,
          name: this.file.name
        }
      }
      request.post('https://shoutbox.rozhlas.cz/users/updateme')
        .set('X-CSRF-Token', csrf)
        .set('X-Requested-With', 'XMLHttpRequest')
        .withCredentials()
        .send(payload)
        .end((err, res) => {
          if (err) {
            return console.error(err)
          }
          if (res.ok && res.body) {
            window.eventHub.$emit('user-load')
          }
        })
    },
    selectFile() {
      this.$refs.upload.click()
    },
    onFileChange(event) {
      this.error = false
      this.file = event.target.files[0] || event.dataTransfer.files[0]
      this.$validator.validateAll()
      if (!this.errors.has('upload') && this.file) {
        this.picture = window.URL.createObjectURL(this.file)
      }
    }
  }
}
</script>
