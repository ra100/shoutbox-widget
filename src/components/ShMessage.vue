<template lang="html" src="./templates/ShMessage.html"></template>
<script>
import ShMessageTwitter from './ShMessageTwitter.vue'
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
    }
    return {
      type: type
    }
  },
  components: {
    ShMessageTwitter
  }
}
</script>