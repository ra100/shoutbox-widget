<style lang='scss' src='./styles/ShEmbed.scss'></style>
<template lang="html" src="./templates/ShEmbed.html"></template>
<script>
import icon from 'vue-icons'
import ShImage from './ShImage'

const getType = provider => {
  const providers = {
    Instagram: 'photo',
    MetaInspector: 'inspector',
    NotAvailable: 'unavailable',
    Facebook: 'facebook'
  }

  if (!providers[provider]) {
    return 'html'
  }
  return providers[provider]
}

export default {
  props: ['data'],
  data() {
    const provider = this.data.provider_name
    return {
      type: getType(provider)
    }
  },
  components: {
    ShImage,
    icon
  }
}
</script>