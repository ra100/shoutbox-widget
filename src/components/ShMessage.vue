<style lang="scss" src="./styles/ShMessage.scss"></style>
<template lang="html" src="./templates/ShMessage.html"></template>
<script>
import ShMessageTwitter from './ShMessageTwitter.vue'
import ShMessageShout from './ShMessageShout.vue'
import ShMessageFacebook from './ShMessageFacebook.vue'
import ShMessageAdmin from './ShMessageAdmin.vue'
import ShSubmit from './ShSubmit.vue'

const feedType = type => ({
  twitter_hashtag: 'twitter',
  twitter_user: 'twitter',
  facebook_page: 'facebook',
  admin: 'shout',
  form: 'shout'
}[type])

export default {
  name: 'sh-message',
  props: ['data', 'socket', 'user', 'stream', 'afterSubmit', 'renewCsrf'],
  data() {
    let m = this.data
    let type = m.feedType
    return {
      type: feedType(type),
      showReplies: this.showReplies || false,
      showReply: this.showReply || false
    }
  },
  computed: {
    replies: function() {
      return this.showReplies
      ? this.data.relatedMessage || []
      : (this.data.relatedMessage && this.data.relatedMessage.slice(0, 2)) || []
    },
    replyCount: function() {
      return this.data.relatedMessage ? this.data.relatedMessage.length : 0
    },
    messageState: function() {
      if (this.data.published) {
        if (this.data.reviewed) {
          return 'approved'
        }
        return 'published'
      }
      if (this.data.reviewed) {
        return 'rejected'
      }
      return 'not-published'
    }
  },
  components: {
    ShMessageTwitter,
    ShMessageShout,
    ShMessageFacebook,
    ShMessageAdmin,
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
      this.showReply = !this.showReply
    },
    sumbit(message) {
      this.afterSubmit(message)
      this.showReply = false
    }
  }
}
</script>
