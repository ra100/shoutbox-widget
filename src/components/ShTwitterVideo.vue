<template lang="html" src="./templates/ShTwitterVideo.html"></template>
<script>
import icon from 'ceri-icon'

export default {
  props: ['variants', 'img'],
  data () {
    return {
      playing: this.playing || false
    }
  },
  components: {
    icon
  },
  methods: {
    play () {
      this.playing = true
    },
    pause () {
      this.playing = false
    }
  }
}
</script>
