<template lang="html" src="./templates/ShMessageShout.html"></template>
<script>
import ShImage from './ShImage'
import icon from 'vue-icons'

export default {
  props: ['data', 'feedType'],
  components: {
    ShImage,
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