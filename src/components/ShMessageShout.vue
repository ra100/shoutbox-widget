<template lang="html" src="./templates/ShMessageShout.html"></template>
<script>
export default {
  props: ['data'],
  data() {
    let m = this.data
    let mediatype = this.getShoutMediaType()
    return {
      author: m.author,
      text: m.message,
      mediatype: mediatype,
      extended: m.picture
    }
  },
  methods: {
    getShoutMediaType() {
      let meta = this.data.picture
      if (typeof meta === 'undefined') {
        return 'none'
      } else {
        return 'photo'
      }
    }
  }
}
</script>