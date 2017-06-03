<style lang="scss" src="./styles/ShLogin.scss"></style>
<template lang="html" src="./templates/ShLogin.html"></template>
<script>
import request from 'superagent'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate)

export default {
  props: ['socket', 'login-first'],
  data() {
    return {
      form: this.form || false,
      page: this.page || 'login',
      error: this.error || '',
      email: this.email || '',
      password: this.password || '',
      reenteredPassword: this.reenteredPassword || '',
      name: this.name || '',
      errors: this.$validator.errorBag,
      matchPassword: () => {
        return this.password === this.reenteredPassword
      },
      passwordLength: () => {
        return this.password.length >= 8
      }
    }
  },
  methods: {
    switchLogin() {
      this.$validator.errorBag.clear()
      this.page = 'login'
    },
    switchRegister() {
      this.$validator.errorBag.clear()
      this.page = 'register'
    },
    switchForgotten() {
      this.$validator.errorBag.clear()
      this.page = 'forgotten'
    },
    twitterLogin() {
      this.form = false
      let oauthWindow = window.open('https://shoutbox.rozhlas.cz/auth/twitter', 'Shoutbox Auth', 'location=0,status=0,width=800,height=400')
      let oauthInterval = window.setInterval(function() {
        if (oauthWindow.closed) {
          window.clearInterval(oauthInterval)
          window.eventHub.$emit('user-load')
        }
      }, 1000)
    },
    emailLogin() {
      this.form = true
    },
    facebookLogin() {
      this.form = false
      let oauthWindow = window.open('https://shoutbox.rozhlas.cz/auth/facebook', 'Shoutbox Auth', 'location=0,status=0,width=800,height=400')
      let oauthInterval = window.setInterval(function() {
        if (oauthWindow.closed) {
          window.clearInterval(oauthInterval)
          window.eventHub.$emit('user-load')
        }
      }, 1000)
    },
    instagramLogin() {
      this.form = false
      let oauthWindow = window.open('https://shoutbox.rozhlas.cz/auth/instagram', 'Shoutbox Auth', 'location=0,status=0,width=800,height=400')
      let oauthInterval = window.setInterval(function() {
        if (oauthWindow.closed) {
          window.clearInterval(oauthInterval)
          window.eventHub.$emit('user-load')
        }
      }, 1000)
    },
    soundcloudLogin() {
      this.form = false
      let oauthWindow = window.open('https://shoutbox.rozhlas.cz/auth/soundcloud', 'Shoutbox Auth', 'location=0,status=0,width=800,height=400')
      let oauthInterval = window.setInterval(function() {
        if (oauthWindow.closed) {
          window.clearInterval(oauthInterval)
          window.eventHub.$emit('user-load')
        }
      }, 1000)
    },
    login() {
      this.$validator.validateAll()
      if (this.errors.any()) {
        return
      }
      if (!this.email || !this.password) {
        return
      }
      this.error = false
      this.loading = true
      let csrf = window.CSRF
      request
       .post('https://shoutbox.rozhlas.cz/auth/local')
       .set('X-CSRF-Token', csrf)
       .withCredentials()
       .send({
         identifier: this.email,
         password: this.password,
         type: 'local',
         _csrf: csrf
       })
       .then(res => {
         this.loading = false
         if (res.ok && res.body && res.body.status !== 'error') {
           window.eventHub.$emit('user-load')
         } else {
           if (res.body.error === 'Error.Passport.Already.Authenticated') {
             window.eventHub.$emit('reload')
             window.eventHub.$emit('user-load')
             return
           }
           this.error = res.body.error || 'Chyba při přihlašování'
         }
       }).catch(err => {
         console.error(err.response)
         this.error = (err.response.body && err.response.body.error) ? err.response.body.error : 'Chyba při přihlašování'
       })
    },
    register() {
      if (this.password !== this.reenteredPassword) {
        this.error = 'Hesla se musí shodovat.'
        return
      }
      if (this.name.length === 0) {
        this.error = 'Musíte zadat přezdívku'
        return
      }
      if (this.email.length === 0) {
        this.error = 'Musíte zadat email'
        return
      }
      if (this.password.length <= 8 || this.reenteredPassword.length <= 8) {
        this.error = 'Heslo musí být aspoň 8 znaků dlouhé'
        return
      }
      this.loading = true
      let csrf = window.CSRF
      request
       .post('https://shoutbox.rozhlas.cz/auth/local/register')
       .set('X-CSRF-Token', csrf)
       .withCredentials()
       .send({
         email: this.email,
         username: this.name,
         displayname: this.name,
         password: this.password,
         _csrf: csrf
       }).then(res => {
         this.loading = false
         if (res.ok && res.body && res.body.status !== 'error') {
           window.eventHub.$emit('repload')
           window.eventHub.$emit('user-load')
         } else {
           this.error = res.body.message
         }
       }).catch(err => {
         console.error(err)
         this.error = 'Chyba při registraci'
       })
    },
    resetPassword() {},
    handleValidate: function (e) {
      e.target.$validity.validate()
    }
  }
}
</script>
