<template lang="html" src="./templates/Message.html"></template>
<script>
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
      author: m.author,
      type: type
    }
  }
}
</script>