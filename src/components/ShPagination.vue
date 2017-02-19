<style lang="scss" src="./styles/ShPagination.scss"></style>
<template lang="html" src="./templates/ShPagination.html"></template>
<script>
export default {
  props: ['page'],
  data() {
    return {
      loading: this.loading || false
    }
  },
  methods: {
    nextPage() {
      this.loading = true
      this.$parent.nextPage(() => {
        this.loading = false
      })
    }
  }
}
</script>
