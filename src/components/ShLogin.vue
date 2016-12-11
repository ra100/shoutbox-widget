<style lang="scss" src="./styles/ShLogin.scss"></style>
<template lang="html" src="./templates/ShLogin.html"></template>
<script>
import request from 'superagent'
import Vue from 'vue'
import VueValidator from 'vue-validator'
Vue.use(VueValidator)

const eventHub = new Vue()

export default {
  props: ['socket'],
  data() {
    return {
      form: this.form || false,
      page: this.page || 'login',
      error: this.error || '',
      email: this.email || '',
      password: this.password || '',
      reenteredPassword: this.reenteredPassword || '',
      name: this.name || ''
    }
  },
  computed: {
    matchPassword: () => {
      return this.password === this.reenteredPassword
    },
    passwordLength: () => {
      return this.password.length >= 8
    }
  },
  methods: {
    switchLogin() {
      this.page = 'login'
    },
    switchRegister() {
      this.page = 'register'
    },
    switchForgotten() {
      this.page = 'forgotten'
    },
    twitterLogin() {
      this.form = false
      let uload = () => {
        eventHub.$emit('user-load')
      }
      let oauthWindow = window.open('https://shoutbox.rozhlas.cz/auth/twitter', 'Shoutbox Auth', 'location=0,status=0,width=800,height=400')
      let oauthInterval = window.setInterval(function() {
        if (oauthWindow.closed) {
          window.clearInterval(oauthInterval)
          uload()
        }
      }, 1000)
    },
    emailLogin() {
      this.form = true
    },
    facebookLogin() {
      this.form = false
      let uload = () => {
        eventHub.$emit('user-load')
      }
      let oauthWindow = window.open('https://shoutbox.rozhlas.cz/auth/facebook', 'Shoutbox Auth', 'location=0,status=0,width=800,height=400')
      let oauthInterval = window.setInterval(function() {
        if (oauthWindow.closed) {
          window.clearInterval(oauthInterval)
          uload()
        }
      }, 1000)
    },
    instagramLogin() {
      this.form = false
      let uload = () => {
        eventHub.$emit('user-load')
      }
      let oauthWindow = window.open('https://shoutbox.rozhlas.cz/auth/instagram', 'Shoutbox Auth', 'location=0,status=0,width=800,height=400')
      let oauthInterval = window.setInterval(function() {
        if (oauthWindow.closed) {
          window.clearInterval(oauthInterval)
          uload()
        }
      }, 1000)
    },
    soundcloudLogin() {
      this.form = false
      let uload = () => {
        eventHub.$emit('user-load')
      }
      let oauthWindow = window.open('https://shoutbox.rozhlas.cz/auth/soundcloud', 'Shoutbox Auth', 'location=0,status=0,width=800,height=400')
      let oauthInterval = window.setInterval(function() {
        if (oauthWindow.closed) {
          window.clearInterval(oauthInterval)
          uload()
        }
      }, 1000)
    },
    login() {
      if (!this.email || !this.password) {
        return
      }
      this.$resetValidation()
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
           eventHub.$emit('user-load')
         } else {
           this.error = 'Chyba při přihlašování'
         }
       }).catch((err) => {
         console.error(err)
         this.error = 'Chyba při přihlašování'
       })
    },
    register() {
      if (this.password !== this.reenteredPassword) {
        this.error = 'Hesla se musí shodovat.'
        return
      }
      this.$resetValidation()
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
           eventHub.$emit('user-load')
         } else {
           this.error = res.body.message
         }
       }).catch(err => {
         console.error(err)
         this.error = 'Chyba při registraci'
       })
    },
    resetPassword() {
      this.$resetValidation()
    },
    handleValidate: function (e) {
      e.target.$validity.validate()
    }
  }
}
</script>