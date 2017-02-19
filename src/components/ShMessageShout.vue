<template lang="html" src="./templates/ShMessageShout.html"></template>
<script>
import ShImage from './ShImage'
import ShEmbed from './ShEmbed.vue'
import icon from 'vue-icons'
import {urlPattern, processEmbedUrl} from './utils'

export default {
  props: ['data', 'feedType', 'socket'],
  components: {
    ShImage,
    ShEmbed,
    icon
  },
  data() {
    const m = this.data
    const r = m.relatedMessage
    const rc = (r) ? r.length : 0
    return {
      author: m.author,
      text: this.text || m.message,
      mediatype: m.mediaType,
      extended: m.picture,
      replies: rc,
      oembed: null
    }
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
          if (embed.oembed.provider_name !== 'NotAvailable') {
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
