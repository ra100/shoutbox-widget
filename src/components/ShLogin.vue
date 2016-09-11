<template lang="html" src="./templates/ShLogin.html"></template>
<script>
import request from 'superagent'

export default {
  data() {
    return {
      form: this.form || false,
      loginPage: this.login || true,
      error: this.error || '',
      email: this.email || '',
      password: this.password || '',
      reenteredPassword: this.reenteredPassword || '',
      name: this.name || ''
    }
  },
  computed() {
    return {
      matchPassword: function () {
        return this.password === this.reenteredPassword
      }
    }
  },
  methods: {
    switchLogin() {
      this.loginPage = true
    },
    switchRegister() {
      this.loginPage = false
    },
    twitterLogin() {
      this.form = false
      let uload = () => {
        this.$dispatch('user-load')
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
        this.$dispatch('user-load')
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
        this.$dispatch('user-load')
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
        this.$dispatch('user-load')
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
      this.error = false
      this.loading = true
      let csrf = this.$parent.getCsrf()
      request
       .post('https://shoutbox.rozhlas.cz/auth/local')
       .set('X-CSRF-Token', csrf)
       .withCredentials()
       .send({
         user: {
           email: this.email,
           password: this.password
         },
         _csrf: csrf
       })
       .end((err, res) => {
         this.loading = false
         if (!err && res.ok && res.body) {
           this.$parent._data.user = res.body
         } else {
           this.error = 'Chyba při přihlašování'
         }
       })
    },
    register() {}
  }
}
</script>