<style lang="scss" src="./styles/ShMessage.scss"></style>
<template lang="html" src="./templates/ShMessage.html"></template>
<script>
import ShMessageTwitter from './ShMessageTwitter.vue'
import ShMessageShout from './ShMessageShout.vue'
import ShMessageFacebook from './ShMessageFacebook.vue'
import ShMessageAdmin from './ShMessageAdmin.vue'
import ShMessageInstagram from './ShMessageInstagram.vue'
import ShSubmit from './ShSubmit.vue'

const feedType = type => ({
  twitter_hashtag: 'twitter',
  twitter_user: 'twitter',
  facebook_page: 'facebook',
  admin: 'shout',
  form: 'shout',
  instagram_user: 'instagram'
})[type]

const messageState = (published, reviewed) => ({
  true: {true: 'approved', false: 'published'},
  false: {true: 'rejected', false: 'not-published'}
})[published || false][reviewed || false]

export default {
  name: 'sh-message',
  props: ['data', 'socket', 'user', 'stream', 'feed', 'afterSubmit', 'renewCsrf'],
  data() {
    return {
      showReplies: this.showReplies || false,
      showReply: this.showReply || false
    }
  },
  computed: {
    type: function() {
      return feedType(this.data.feedType)
    },
    replies: function() {
      const l = this.data.relatedMessage ? this.data.relatedMessage.length : 0
      return this.showReplies
      ? this.data.relatedMessage || []
      : (this.data.relatedMessage && this.data.relatedMessage.slice(l - 2, l)) || []
    },
    replyCount: function() {
      return this.data.relatedMessage ? this.data.relatedMessage.length : 0
    },
    messageState: function() {
      return messageState(this.data.published, this.data.reviewed)
    }
  },
  components: {
    ShMessageTwitter,
    ShMessageShout,
    ShMessageFacebook,
    ShMessageAdmin,
    ShMessageInstagram,
    ShSubmit
  },
  methods: {
    getSocket() {
      return this.socket
    },
    showMoreReplies() {
      this.showReplies = true
    },
    toggleReply() {
      if (this.user) {
        this.showReply = !this.showReply
        return
      }
      window.eventHub.$emit('login-toggle')
    },
    sumbit(message) {
      this.showReply = false
      this.afterSubmit(message)
    }
  }
}
</script>
