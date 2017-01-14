<template lang="html" src="./templates/ShMessageFacebook.html"></template>
<script>
import ShImage from './ShImage'
import ShFacebookVideo from './ShFacebookVideo'
import icon from 'vue-icons'
import {youtubePattern, processEmbedData} from './utils'

export default {
  props: ['data', 'feedType', 'socket'],
  components: {
    ShImage,
    ShFacebookVideo,
    icon
  },
  data() {
    const m = this.data
    const r = m.relatedMessage
    const rc = (r) ? r.length : 0
    const message = this.processOembed(m.message)
    console.log(m)
    return {
      author: m.author,
      text: message,
      mediatype: m.mediaType,
      extended: m.picture,
      link: m.link,
      likes: m.metadata.likes,
      comments: m.metadata.comments,
      media: m.metadata.media,
      video: m.metadata.video,
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
          const embed = processEmbedData(data)
          this.mediatype = embed.mediatype
          this.oembed = embed.oembed
        })
        // Remove link from text
        return text.replace(url, '').trim()
      }
      return text
    }
  }
}
</script>