<template lang="html" src="./templates/ShMessageInstagram.html"></template>
<script>
import ShImage from './ShImage'
import ShInstagramVideo from './ShInstagramVideo'
import icon from 'ceri-icon'

export default {
  props: ['data', 'feedType', 'socket'],
  components: {
    ShImage,
    ShInstagramVideo,
    icon
  },
  data () {
    const m = this.data
    return {
      author: m.author,
      text: this.text || m.message,
      mediatype: m.mediaType,
      extended: m.metadata.media
    }
  }
}
</script>
