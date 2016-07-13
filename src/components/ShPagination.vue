<template lang="html" src="./templates/ShPagination.html"></template>
<script>
export default {
  props: ['page', 'count'],
  methods: {
    nextPage() {
      this.$parent.nextPage()
    },
    prevPage() {
      this.$parent.prevPage()
    },
    jumpToStart() {
      this.$parent.jumpToStart()
    }
  }
}
</script>