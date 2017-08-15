<style lang="scss" src="./styles/ShFacebookVideo.scss"></style>
<template lang="html" src="./templates/ShFacebookVideo.html"></template>
<script>
export default {
  props: ['video'],
  data () {
    return {
      playing: this.playing || false
    }
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
