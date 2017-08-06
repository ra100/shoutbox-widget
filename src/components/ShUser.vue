<style lang="scss" src="./styles/ShUser.scss" scoped></style>
<template lang="html" src="./templates/ShUser.html"></template>
<script>
import request from 'superagent'
import icon from 'ceri-icon'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate)

export default {
  props: ['user', 'socket'],
  components: {
    icon
  },
  data () {
    return {
      displayname: this.user.displayname,
      picture: this.user.picture,
      file: this.file,
      email: this.user.email,
      password: '',
      newPassword: '',
      reenteredPassword: '',
      loading: false,
      error: '',
      success: false
    }
  },
  computed: {
    matchPassword () {
      return this.newPassword === this.reenteredPassword
    },
    passwordLength () {
      return this.newPassword.length >= 8
    },
    nameChanged () {
      return this.user.displayname !== this.displayname
    },
    emailChanged () {
      return this.user.email !== this.email
    },
    passwordValid () {
      if (!this.newPassword) {
        return true
      }
      if (this.passwordLength && this.matchPassword && this.password) {
        return true
      }
      return false
    }
  },
  methods: {
    logout () {
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
            this.$parent.renewCsrf(() => window.eventHub.$emit('user-load'))
          }
        })
    },
    updateUser () {
      this.clearError()
      this.loading = true
      const payload = {_csrf: window.CSRF}
      if (this.nameChanged) {
        payload.displayname = this.displayname
      }
      if (this.emailChanged) {
        payload.email = this.email
      }
      if (this.newPassword) {
        payload.password = this.newPassword
        payload.oldPassword = this.password
      }
      if (this.file) {
        payload.image = {
          data: this.file,
          name: this.file.name
        }
      }
      this.socket.post('https://shoutbox.rozhlas.cz/users/updateme', payload, (data, jwres) => {
        this.loading = false
        if (jwres.statusCode !== 200) {
          if (typeof jwres.body === 'string') {
            if (jwres.body === 'CSRF mismatch') {
              this.error = 'Sezení vypršelo, obnovte stránku'
              return
            }
            this.error = jwres.body
            return
          }
          if (jwres.body.code === 'E_VALIDATION' && jwres.body.invalidAttributes.email) {
            this.error = 'Email již existuje'
            return
          }
          this.error = 'Chyba odeslání'
          return console.error(jwres)
        }
        this.success = true
        this.password = ''
        this.newPassword = ''
        this.reenteredPassword = ''
        window.eventHub.$emit('user-load')
      })
    },
    selectFile () {
      this.$refs.upload.click()
    },
    onFileChange (event) {
      this.error = false
      this.file = event.target.files[0] || event.dataTransfer.files[0]
      this.$validator.validateAll()
      if (!this.errors.errors.find(f => f.field === 'upload') && this.file) {
        this.picture = window.URL.createObjectURL(this.file)
      }
    },
    clearError () {
      this.error = ''
      this.success = ''
    }
  }
}
</script>
