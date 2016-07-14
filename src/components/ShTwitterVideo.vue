<template lang="html" src="./templates/ShTwitterVideo.html"></template>
<script>
export default {
  props: ['variants', 'img'],
  data() {
    return {
      play: this.play || false
    }
  },
  methods: {
    play() {
      this.play = true
    },
    pause() {
      this.play = false
    }
  }
}
</script>