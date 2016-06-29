<template lang="html" src="./templates/ShLogin.html"></template>
<script>
export default {
  methods: {
    twitterLogin() {
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
    }
  }
}
</script>