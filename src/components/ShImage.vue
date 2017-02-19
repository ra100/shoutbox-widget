<style lang='scss' src='./styles/ShImage.scss'></style>
<template lang='html' src='./templates/ShImage.html'></template>
<script>
const escListener = (evt, callback) => {
  evt = evt || window.event
  let isEscape = false
  if ('key' in evt) {
    isEscape = (evt.key === 'Escape' || evt.key === 'Esc')
  } else {
    isEscape = (evt.keyCode === 27)
  }
  if (isEscape) {
    callback()
  }
}

export default {
  props: ['thumb', 'img', 'width', 'height'],
  data() {
    return {
      show: false
    }
  },
  methods: {
    maximize() {
      escListener(this.minimize())
      document.onkeydown = (event) => { escListener(event, this.minimize) }
      this.show = true
    },
    minimize() {
      document.onkeydown = null
      this.show = false
    }
  }
}
</script>
