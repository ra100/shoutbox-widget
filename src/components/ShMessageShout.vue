<template lang="html" src="./templates/ShMessageShout.html"></template>
<script>
import icon from 'vue-icons'

export default {
  props: ['data'],
  components: {
    icon
  },
  data() {
    let m = this.data
    let r = m.relatedMessage
    let rc = (r) ? r.length : 0
    return {
      author: m.author,
      text: m.message,
      mediatype: m.mediaType,
      extended: m.picture,
      replies: rc
    }
  }
}
</script>