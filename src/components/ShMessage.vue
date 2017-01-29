<style lang="scss" src="./styles/ShMessage.scss"></style>
<template lang="html" src="./templates/ShMessage.html"></template>
<script>
import ShMessageTwitter from './ShMessageTwitter.vue'
import ShMessageShout from './ShMessageShout.vue'
import ShMessageFacebook from './ShMessageFacebook.vue'

const feedType = type => ({
  twitter_hashtag: 'twitter',
  twitter_user: 'twitter',
  facebook_page: 'facebook',
  admin: 'shout',
  form: 'shout'
}[type])

export default {
  name: 'sh-message',
  props: ['data', 'socket'],
  data() {
    let m = this.data
    let type = m.feedType
    return {
      type: feedType(type)
    }
  },
  components: {
    ShMessageTwitter,
    ShMessageShout,
    ShMessageFacebook
  },
  methods: {
    getSocket() {
      return this.socket
    }
  }
}
</script>