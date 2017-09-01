<template lang="html">
  <span>
    <template v-if="expandable && !expanded">
      <div class="text" v-html="trimmed" v-linkified:options="{ className: 'link' }"/>
      <span class="show-more" @click="expand">Zobrazit celé</span>
    </template>
    <div v-else class="text" v-html="text" v-linkified:options="{ className: 'link' }"/>
  </span>
</template>

<script>
import clip from 'text-clipper'
const HTML_REGEX = /<[a-z][\s\S]*>/i
const MAX_LENGTH = 300

export default {
  props: ['text'],
  data () {
    return {
      expanded: false
    }
  },
  computed: {
    trimmed: function () {
      return clip(this.text, MAX_LENGTH, {html: HTML_REGEX.test(this.text), maxLines: 3})
    },
    expandable: function () {
      return this.text.length > this.trimmed.length
    }
  },
  methods: {
    expand () {
      this.expanded = true
    }
  }
}
</script>

<style lang='scss' @scoped>
@import '../styles/variables';
.show-more {
  cursor: pointer;
  color: $link;
}
</style>