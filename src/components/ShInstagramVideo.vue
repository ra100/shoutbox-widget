<style lang="scss" src="./styles/ShFacebookVideo.scss"></style>
<template lang="html" src="./templates/ShInstagramVideo.html"></template>
<script>
export default {
  props: ['video', 'img'],
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
