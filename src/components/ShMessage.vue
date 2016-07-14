<template lang="html" src="./templates/ShMessage.html"></template>
<script>
import ShMessageTwitter from './ShMessageTwitter.vue'
import ShMessageShout from './ShMessageShout.vue'
export default {
  props: ['data'],
  data() {
    let m = this.data
    let type = m.feedType
    switch (type) {
      case 'twitter_hashtag':
      case 'twitter_user':
        type = 'twitter'
        break
      case 'admin':
      case 'form':
        type = 'shout'
        break
    }
    return {
      type: type
    }
  },
  components: {
    ShMessageTwitter,
    ShMessageShout
  },
  methods: {
    getSocket() {
      return this.$parent.getSocket()
    }
  }
}
</script>