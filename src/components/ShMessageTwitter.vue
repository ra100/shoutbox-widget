<style lang="scss" src="./styles/ShTwitterVideo.scss"></style>
<template lang="html" src="./templates/ShMessageTwitter.html"></template>
<script>
import ShTwitterVideo from './ShTwitterVideo.vue'
import ShImage from './ShImage.vue'
import ShEmbed from './ShEmbed.vue'
import icon from 'vue-icons'
import {urlPattern, processEmbedUrl} from './utils'
const entityTypes = ['hashtags', 'urls', 'user_mentions', 'media', 'symbols']

const compareEntities = (a, b) => {
  if (a.index === b.index) {
    return 0
  } else if (a.index > b.index) {
    return 1
  } else {
    return -1
  }
}

const parseEntities = (entities) => {
  let out = []
  for (let t in entityTypes) {
    let type = entityTypes[t]
    for (let i in entities[type]) {
      let entity = entities[type][i]
      entity.entity_type = type
      out.push({
        index: entity.indices[0],
        type: type,
        entity: entity}
      )
    }
  }
  out.sort(compareEntities)
  return out
}

const getNeedle = (type, entity) => {
  const types = {
    user_mentions: () => '@' + entity.screen_name,
    hashtags: () => '#' + entity.text,
    media: () => entity.url,
    urls: () => entity.url
  }
  if (typeof types[type] !== 'function') {
    return null
  }
  return types[type]()
}

// split text into chunks so we can join it in template with formatted hashtags,
// users, links, and media
const textSplit = (message, entities) => {
  let text = message
  let out = []
  entities.forEach(entity => {
    let needle = getNeedle(entity.type, entity.entity)
    let start = text.indexOf(needle)
    if (start > 0) {
      out.push({
        text: text.substr(0, start),
        entity: null
      })
    }
    out.push({
      text: text.substr(start, needle.length),
      entity: entity.entity
    })
    text = text.substr(start + needle.length)
  })
  if (text.length > 0) {
    out.push({
      text: text,
      entity: null
    })
  }
  return out
}

export default {
  props: ['data', 'socket'],
  data() {
    let m = this.data
    let text = textSplit(
      this.data.message,
      parseEntities(this.data.metadata.entities)) || []
    if (this.oembed === undefined) {
      this.processOembed(text)
    }
    return {
      author: m.author,
      text: this.text || text,
      likes: m.metadata.likes,
      link: m.link || null,
      shares: m.metadata.shares,
      mediatype: this.mediatype || m.mediaType,
      oembed: this.oembed || null,
      extended: m.metadata.media_ext,
      replies: m.relatedMessage ? m.relatedMessage.length : 0
    }
  },
  components: {
    ShTwitterVideo,
    ShImage,
    ShEmbed,
    icon
  },
  methods: {
    processOembed(text) {
      text.forEach(e => {
        if (e.entity && e.entity.expanded_url && !e.entity.expanded_url.includes('twitter')) {
          // Match youtube and insert oembed
          if (e.entity.expanded_url.match(urlPattern)) {
            const url = e.entity.expanded_url
            processEmbedUrl(url, this.socket).then(embed => {
              this.mediatype = embed.mediatype
              this.oembed = embed.oembed
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    }
  }
}
</script>
