<template lang="html" src="./templates/ShTwitterVideo.html"></template>
<script>
export default {
  props: ['variants', 'img'],
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
