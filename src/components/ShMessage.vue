<style lang="scss" src="./styles/ShMessage.scss"></style>
<template lang="html" src="./templates/ShMessage.html"></template>
<script>
import ShMessageTwitter from './ShMessageTwitter.vue'
import ShMessageShout from './ShMessageShout.vue'

const feedType = type => ({
  twitter_hashtag: 'twitter',
  twitter_user: 'twitter',
  admin: 'shout',
  form: 'shout'
}[type])

export default {
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
    ShMessageShout
  },
  methods: {
    getSocket() {
      return this.socket
    }
  }
}
</script>