<template lang="html" src="./templates/ShSubmit.html"></template>
<script>
export default {
  props: ['user'],
  data() {
    return {
      message: this.message,
      file: this.file
    }
  },
  methods: {
    submit() {
      console.log(this.message)
      console.log(this.file)
      console.log(this.$parent._data.form)
    },
    onFileChange(event) {
      this.file = event.target.files || event.dataTransfer.files
    }
  }
}
</script>