<style lang='scss' src='./styles/ShEmbed.scss'></style>
<template lang="html" src="./templates/ShEmbed.html"></template>
<script>
import icon from 'vue-icons'
import ShImage from './ShImage'
import ShFacebookVideo from './ShFacebookVideo'

const getType = provider => {
  const providers = {
    Instagram: 'photo',
    MetaInspector: 'inspector',
    NotAvailable: 'unavailable',
    Twitter: 'twitter',
    Facebook: 'facebook'
  }

  if (!providers[provider]) {
    return 'html'
  }
  return providers[provider]
}

const filter = (provider, html) => {
  const filters = {
    // remove <script tag>
    twitter: html => html.match(/(<p.*<\/p>)/g)[0]
  }
  if (!filters[provider]) {
    return html
  }
  return filters[provider](html)
}

export default {
  props: ['data'],
  data() {
    const provider = this.data.provider_name
    const type = getType(provider)
    return {
      type,
      filtered: filter(type, this.data.html)
    }
  },
  components: {
    ShImage,
    ShFacebookVideo,
    icon
  }
}
</script>