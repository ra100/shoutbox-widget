<template lang="html" src="./templates/ShMessageTwitter.html"></template>
<script>
import ShTwitterVideo from './ShTwitterVideo.vue'
const entityTypes = ['hashtags', 'urls', 'user_mentions', 'media', 'symbols']
const youtubePattern = /youtube.com\//g

function compareEntities(a, b) {
  if (a.index === b.index) {
    return 0
  } else if (a.index > b.index) {
    return 1
  } else {
    return -1
  }
}

function parseEntities(entities) {
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

export default {
  props: ['data'],
  data() {
    let m = this.data
    let text = this.textSplit() || []
    if (this.oembed === undefined) {
      this.processOembed(text)
    }
    return {
      author: m.author,
      text: this.text || text,
      likes: m.metadata.likes,
      shares: m.metadata.shares,
      mediatype: this.mediatype || m.mediaType,
      oembed: this.oembed || null,
      extended: m.metadata.media_ext
    }
  },
  components: {
    ShTwitterVideo
  },
  methods: {
    // split text into chunks so we can join it in template with formatted hashtags,
    // users, links, and media
    textSplit() {
      let text = this.data.message
      let out = []
      let entities = parseEntities(this.data.metadata.entities)
      for (let e in entities) {
        let entity = entities[e]
        let needle = ''
        switch (entity.type) {
          case 'user_mentions': needle = '@' + entity.entity.screen_name
            break
          case 'hashtags': needle = '#' + entity.entity.text
            break
          case 'media':
          case 'urls': needle = entity.entity.url
            break
          default: null
        }
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
      }
      if (text.length > 0) {
        out.push({
          text: text,
          entity: null
        })
      }
      return out
    },
    getEntity(index) {
      let entities = this.data.metadata.entities
      if (typeof entities === 'undefined') {
        return null
      }
      for (let t in entityTypes) {
        for (let i in entities[entityTypes[t]]) {
          if (entities[entityTypes[t]][i].indices[0] === index) {
            let ent = entities[entityTypes[t]][i]
            ent.entity_type = entityTypes[t]
            return ent
          }
        }
      }
      return null
    },
    processOembed(text) {
      for (let e of text) {
        if (e.entity && e.entity.expanded_url) {
          // Match youtube and insert oembed
          if (e.entity.expanded_url.match(youtubePattern)) {
            let socket = this.$parent.getSocket()
            socket.get('/oembed/youtube', {url: e.entity.expanded_url}, (data, err) => {
              if (err.statusCode !== 200) {
                return console.error(err)
              }
              this.mediatype = 'youtube'
              let iframe = document.createElement('DIV')
              iframe.innerHTML = data.html
              iframe.firstChild.setAttribute('width', '100%')
              iframe.firstChild.setAttribute('height', 'auto')
              data.html = iframe.innerHTML
              this.oembed = data
            })
          }
        }
      }
    }
  }
}
</script>