<template lang="html" src="./templates/ShMessageShout.html"></template>
<script>
export default {
  props: ['data'],
  data() {
    let m = this.data
    return {
      author: m.author,
      text: m.message,
      mediatype: m.mediaType,
      extended: m.picture,
      replies: m.relatedMessage.length
    }
  }
}
</script>