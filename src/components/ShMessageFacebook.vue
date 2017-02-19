<template lang="html" src="./templates/ShMessageFacebook.html"></template>
<script>
import ShImage from './ShImage'
import ShFacebookVideo from './ShFacebookVideo'
import ShEmbed from './ShEmbed.vue'
import icon from 'vue-icons'
import {urlPattern, processEmbedUrl} from './utils'

export default {
  props: ['data', 'feedType', 'socket'],
  components: {
    ShImage,
    ShFacebookVideo,
    ShEmbed,
    icon
  },
  data() {
    const m = this.data
    return {
      author: m.author,
      mediatype: m.mediaType,
      extended: m.picture,
      link: m.link,
      likes: m.metadata.likes,
      comments: m.metadata.comments,
      media: m.metadata.media,
      video: m.metadata.video,
      oembed: null
    }
  },
  computed: {
    replies: function() { return this.data.relatedMessage ? this.data.relatedMessage.length : 0 },
    text: function() { return this.text || this.data.message }
  },
  created() {
    this.processOembed(this.data.message)
  },
  methods: {
    processOembed(text) {
      // Match url and insert oembed
      if (text.match(urlPattern)) {
        const url = text.match(urlPattern)[0]
        processEmbedUrl(url, this.socket).then(embed => {
          if (embed.provider_name !== 'NotAvailable') {
            this.mediatype = embed.mediatype
            this.oembed = embed.oembed
            // Remove link from text
            this.text = text && text.replace(url, '').trim()
          }
        }).catch(() => {
          // console.error(err)
        })
      }
    }
  }
}
</script>
