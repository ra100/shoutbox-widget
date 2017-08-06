<style lang="scss" src="./styles/ShFacebookVideo.scss"></style>
<template lang="html" src="./templates/ShFacebookVideo.html"></template>
<script>
import icon from 'ceri-icon'

export default {
  props: ['video'],
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
