<style lang="scss" src="./styles/ShUser.scss"></style>
<template lang="html" src="./templates/ShUser.html"></template>
<script>
import request from 'superagent'

export default {
  props: ['user'],
  data() {
    return {
    }
  },
  methods: {
    logout() {
      let csrf = this.$parent.getCsrf()
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
          }
        })
    }
  }
}
</script>