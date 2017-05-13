<template lang="html" src="./templates/ShMessageFacebook.html"></template>
<script>
import ShImage from './ShImage'
import ShFacebookVideo from './ShFacebookVideo'
import ShEmbed from './ShEmbed.vue'
import icon from 'vue-icons'
import {urlPattern, processEmbedUrl} from './utils'

const FB_LINK_REDIRECT = 'https://l.facebook.com/l.php?u='

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
      oembed: null,
      text: m.message
    }
  },
  created() {
    this.processOembed(this.data.message)
  },
  methods: {
    processOembed(text) {
      // Match url and insert oembed
      if (text.match(urlPattern)) {
        let url = text.match(urlPattern)[0]
        if (url.indexOf(FB_LINK_REDIRECT) === 0) {
          url = decodeURIComponent.replace(FB_LINK_REDIRECT, '')
        }
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
