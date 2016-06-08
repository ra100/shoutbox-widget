<template lang="html" src="./templates/ShMessageTwitter.html"></template>
<script>
const entityTypes = ['hashtags', 'urls', 'user_mentions', 'media', 'symbols']

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
    let text = []
    let mediatype = this.getTwitterMediaType()
    text = this.textSplit()
    return {
      author: m.author,
      text: text,
      likes: m.metadata.likes,
      shares: m.metadata.shares,
      mediatype: mediatype,
      extended: m.metadata.media_ext
    }
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
    getTwitterMediaType() {
      let meta = this.data.metadata
      if (typeof meta.media === 'undefined') {
        return 'none'
      }
      switch (meta.media_ext[0].type) {
        case 'photo':
          if (meta.media_ext.length > 0) {
            return 'gallery'
          } else {
            return 'photo'
          }

        case 'animated_gif':
          return 'gif'

      }
    }
  }
}
</script>