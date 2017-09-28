<template lang="html" src="./templates/ShMessageFacebook.html"></template>
<script>
import ShImage from './ShImage'
import ShFacebookVideo from './ShFacebookVideo'
import ShEmbed from './ShEmbed.vue'
import ShTextTrim from './ShTextTrim.vue'
import {urlPattern, processEmbedUrl, getParameterByName, getHostname} from './utils'

const FB_LINK_REDIRECT = 'https://l.facebook.com/l.php'

export default {
  props: ['data', 'feedType', 'socket'],
  components: {
    ShImage,
    ShFacebookVideo,
    ShEmbed,
    ShTextTrim
  },
  data () {
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
  created () {
    this.processOembed(this.data.message)
    if (this.data.metadata.media) {
      this.processMedia(this.data.metadata.media)
    }
  },
  methods: {
    processOembed (text) {
      // Match url and insert oembed
      if (text.match(urlPattern)) {
        let url = text.match(urlPattern)[0]
        if (url.indexOf(FB_LINK_REDIRECT) === 0) {
          url = decodeURIComponent(getParameterByName('u', url))
        }
        processEmbedUrl(url, this.socket()).then(embed => {
          if (embed.provider_name !== 'NotAvailable') {
            this.mediatype = embed.mediatype
            this.oembed = embed.oembed
            // Remove link from text
            this.text = text && text.replace(url, '').trim()
          }
        }).catch((err) => {
          console.error(err)
        })
      }
    },
    processMedia (media) {
      const promises = media.map(m =>
        new Promise(resolve => {
          const url = decodeURIComponent(getParameterByName('u', m.url))
          switch (m.type) {
            case 'animated_image_share':
              return resolve({
                type: 'oembed',
                oembed: {
                  html: '',
                  host: getHostname(url),
                  provider_name: 'Facebook',
                  image: m.media.image.src,
                  animated: url,
                  url
                }
              })

            case 'share':
              return resolve({
                provider_name: 'Facebook',
                type: 'share',
                link_title: m.title,
                link_description: m.description,
                image: m.media.image && m.media.image.src,
                link_url: url,
                url
              })
            case 'video_inline':
              if (this.oembed) { break }
              return processEmbedUrl(m.url, this.socket()).then(embed => {
                if (embed.provider_name !== 'NotAvailable') {
                  this.video = {
                    format: [{}, {}, {picture: embed.oembed.image}, {
                      embed_html: embed.oembed.html,
                      picture: embed.oembed.image,
                      width: embed.oembed.width,
                      height: embed.oembed.height,
                      filter: true,
                      format: 'format'
                    }]
                  }
                }
                return m
              }).catch((err) => {
                console.error(err)
              })

            case 'video_share_youtube':
              processEmbedUrl(
                decodeURIComponent(getParameterByName('u', m.url)),
                this.socket())
                .then(embed => {
                  if (embed.provider_name !== 'NotAvailable') {
                    this.mediatype = embed.mediatype
                    this.oembed = embed.oembed
                  }
                })
                .catch((err) => {
                  console.error(err)
                })
              break
          }
          return resolve(m)
        })
      )
      Promise.all(promises).then(newMedia => { this.media = newMedia })
    }
  }
}
</script>
