<template lang="html" src="./templates/ShTwitterVideo.html"></template>
<script>
import icon from 'vue-icons'

export default {
  props: ['variants', 'img'],
  data() {
    return {
      play: this.play || false
    }
  },
  components: {
    icon
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