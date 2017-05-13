<template lang="html" src="./templates/ShFacebookVideo.html"></template>
<script>
import icon from 'vue-icons'

export default {
  props: ['video'],
  data() {
    return {
      playing: this.playing || false
    }
  },
  components: {
    icon
  },
  methods: {
    play() {
      this.playing = true
    },
    pause() {
      this.playing = false
    }
  }
}
</script>
