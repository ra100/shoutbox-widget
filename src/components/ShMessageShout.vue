<template lang="html" src="./templates/ShMessageShout.html"></template>
<script>
import ShImage from './ShImage'
import icon from 'vue-icons'
const youtubePattern = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)/g

export default {
  props: ['data', 'feedType', 'socket'],
  components: {
    ShImage,
    icon
  },
  data() {
    const m = this.data
    const r = m.relatedMessage
    const rc = (r) ? r.length : 0
    const message = this.processOembed(m.message)
    return {
      author: m.author,
      text: message,
      mediatype: m.mediaType,
      extended: m.picture,
      replies: rc,
      oembed: null
    }
  },
  methods: {
    processOembed(text) {
      // Match youtube and insert oembed
      if (text.match(youtubePattern)) {
        const url = text.match(youtubePattern)[0]
        this.socket.request({
          method: 'get',
          url: '/oembed/youtube',
          data: { url: url },
          headers: {
            'X-CSRF-Token': window.CSRF
          }
        }, (data, err) => {
          if (err.statusCode !== 200) {
            return console.error(err)
          }
          this.mediatype = 'youtube'
          data.style = 'padding-bottom: ' + (data.height / data.width * 100) + '%;'
          this.oembed = data
        })
        // Remove link from text
        return text.replace(url, '').trim()
      }
      return text
    }
  }
}
</script>