<style lang="scss" src="./styles/App.scss"></style>
<template lang="html" src="./templates/App.html"></template>
<script>
import ShMessage from './components/ShMessage.vue'
import ShLogin from './components/ShLogin.vue'
import ShSubmit from './components/ShSubmit.vue'
import ShUser from './components/ShUser.vue'
import ShPagination from './components/ShPagination.vue'
import Vue from 'vue'
import socketIOClient from 'socket.io-client'
import sailsIOClient from 'sails.io.js'
import _ from 'lodash/array'
import dateFormat from 'dateformat'
import request from 'superagent'
import linkify from 'vue-linkify'

const PER_PAGE = 10

const io = sailsIOClient(socketIOClient)
io.sails.url = 'https://shoutbox.rozhlas.cz'
io.sails.autoConnect = true
io.sails.reconnection = true
const socket = io.socket

window.CSRF = ''
window.sailsURL = io.sails.url

request.get(`${io.sails.url}/csrfToken`).then(res => {
  window.CSRF = res.body._csrf
})

function sortByDate(a, b) {
  if (new Date(a.created) < new Date(b.created)) {
    return 1
  } else if (new Date(a.created) > new Date(b.created)) {
    return -1
  } else {
    return 0
  }
}

Vue.filter('date', function(value) {
  return dateFormat(new Date(value), 'd.m.yyyy H:MM')
})

Vue.directive('linkified', linkify)

window.eventHub = new Vue()

const App = Vue.component('app', {
  components: {
    ShMessage,
    ShLogin,
    ShSubmit,
    ShPagination,
    ShUser
  },
  data() {
    return {
      name: this.name,
      id: this.id,
      form: this.form,
      moderated: this.moderated,
      messages: this.messages || [],
      newmessages: this.newmessages || [],
      page: this.page || 0,
      user: this.user,
      mode: this.mode || 'normal',
      loginvisible: this.loginvisible || false,
      submitvisible: this.submivisible || false,
      uservisible: this.uservisible || false,
      showMore: this.showMore || true,
      alert: this.alert || false,
      loginFirst: this.loginFirst || false
    }
  },
  created() {
    socket.on('stream', this.processEvent)
    window.eventHub.$on('user-load', this.getUser)
    window.eventHub.$on('user-form', this.showUserForm)
    window.eventHub.$on('login-toggle', this.loginToggle)
    this.reload().then(this.getUser)
  },
  beforeDestroy() {
    window.eventHub.$off('user-load', this.getUser)
    window.eventHub.$off('user-form', this.showUserForm)
    window.eventHub.$off('login-toggle', this.loginToggle)
  },
  methods: {
    reload() {
      this.newmessages = []
      this.messages = []
      this.page = 0
      this.getName()
      return this.getStream()
        .then(this.processStream)
        .then(this.getMessages)
        .then(this.processMessages)
        .catch(console.error)
    },
    getName() {
      this.name = document
        .getElementById('shoutbox')
        .getAttribute('data-shoutbox-name')
    },
    getStream() {
      return new Promise((resolve, reject) => {
        socket.request({
          method: 'get',
          url: '/streams/public',
          data: {
            name: this.name
          },
          headers: {
            'X-CSRF-Token': window.CSRF
          }
        }, resolve)
      })
    },
    processStream(data, err) {
      return new Promise((resolve, reject) => {
        if (err) {
          return reject(new Error(err))
        }
        this.id = data.id
        this.form = data.form
        this.moderated = data.moderated
        resolve()
      })
    },
    getMessages() {
      let skip = this.page * PER_PAGE + (this.newmessages ? this.newmessages.length : 0)
      let url = '/streams/messages'
      if (this.user && this.user.editor) {
        url = '/streams/adminMessages'
      }
      return new Promise((resolve, reject) => {
        socket.request({
          method: 'get',
          url,
          data: {
            id: this.id,
            skip: skip
          },
          headers: {
            'X-CSRF-Token': window.CSRF
          }
        }, resolve)
      })
    },
    processMessages(data, err) {
      return new Promise((resolve, reject) => {
        if (err || !data) {
          return reject(new Error(err))
        }
        const l = data ? data.length : 0
        const newData = data.map(m => {
          if ((this.user && this.user.editor) || !m.relatedMessage) {
            return m
          }
          return {
            ...m,
            relatedMessage: m.relatedMessage.filter(relm => relm.published)}
        })
        this.messages = [...this.messages, ...newData]
        resolve(l)
      })
    },
    processEvent(event) {
      switch (event.verb) {
        case 'addedTo':
          let message = event.added
          if (typeof message === 'undefined') {
            return
          }
          if (!message.published && (!this.user || !this.user.editor)) {
            this.removeMessage(message.id, message.isResponse, message.parentMessage)
          } else {
            if (!message.isResponse) {
              this.addMessage(message)
            } else {
              this.addReply(message)
            }
          }
          break
        case 'messaged':
          if (event.data.action === 'destroyed') {
            this.removeMessage(event.data.id)
          }
          break
      }
    },
    addMessage(message) {
      const updateMessage = m => {
        if (m.id === message.id) {
          return {
            ...message,
            relatedMessage: m.relatedMessage
          }
        }
        return m
      }
      const messages = this.messages.map(updateMessage)
      let newmessages = this.newmessages.map(updateMessage)
      if (new Date(message.created) > new Date(this.messages[0].created)) {
        newmessages.push(message)
        newmessages.sort(sortByDate)
        newmessages = _.slice(newmessages, 0, PER_PAGE)
      }
      this.newmessages = newmessages
      this.messages = messages
    },
    removeMessage(id, response, parent) {
      if (!response) {
        this.messages = this.messages.filter(e => e.id !== id)
        this.newmessages = this.newmessages.filter(e => e.id !== id)
        return
      }
      const removeChildMessage = m => {
        if (m.id === parent && m.relatedMessage) {
          m.relatedMessage = m.relatedMessage.filter(e => e.id !== id)
        }
      }
      this.messages.forEach(removeChildMessage)
      this.newmessages.forEach(removeChildMessage)
    },
    addReply(message) {
      const addReplyMessage = m => {
        if (m.id === message.parentMessage) {
          const newParentMessage = {...m}
          if (newParentMessage.relatedMessage) {
            let rmFound = false
            newParentMessage.relatedMessage = newParentMessage.relatedMessage.map(rm => {
              if (rm.id === message.id) {
                rmFound = true
                return message
              }
              return rm
            })
            if (!rmFound) {
              newParentMessage.relatedMessage.push(message)
            }
          } else {
            newParentMessage.relatedMessage = [message]
          }
          newParentMessage.replies = newParentMessage.relatedMessage ? newParentMessage.relatedMessage.length : 0
          return newParentMessage
        }
        return m
      }
      this.messages = this.messages.map(addReplyMessage)
      this.newmessages = this.newmessages.map(addReplyMessage)
    },
    mergeMessages() {
      let m = _.unionBy(this.messages, this.newmessages, 'id')
      m.sort(sortByDate)
      this.newmessages = []
      this.messages = _.slice(m, 0, PER_PAGE)
    },
    getUser() {
      socket.request({
        method: 'get',
        url: '/users/me',
        headers: {
          'X-CSRF-Token': window.CSRF
        }
      }, (data, resp) => {
        if (resp.statusCode !== 200) {
          this.user = undefined
        } else {
          this.user = {...data, editor: false}
          this.getPermissions()
        }
        this.reload()
      })
    },
    getPermissions() {
      socket.request({
        method: 'get',
        url: `/streams/${this.id}`,
        headers: {
          'X-CSRF-Token': window.CSRF
        }
      }, (data, resp) => {
        if (resp.statusCode === 200) {
          this.user = {
            ...this.user,
            editor: true
          }
          this.getMessages()
            .then(data => {
              this.messages = []
              return data
            })
            .then(this.processMessages)
            .catch(console.error)
        } else {
          this.user = {
            ...this.user,
            editor: false
          }
        }
      })
    },
    getSocket() {
      return socket
    },
    getCsrf() {
      return window.CSRF
    },
    renewCsrf(callback) {
      request.get(`${io.sails.url}/csrfToken`).then(res => {
        window.CSRF = res.body._csrf
        if (callback) {
          callback(res.body._csrf)
        }
      })
    },
    nextPage(callback) {
      this.page++
      this.getMessages()
        .then(this.processMessages)
        .then(l => {
          if (l === 0) {
            this.showMore = false
          }
        })
        .catch(console.error)
        .then(callback)
    },
    setMode(mode) {
      this.mode = mode
    },
    loginShow() {
      this.loginvisible = true
      this.submitvisible = false
    },
    loginHide() {
      this.loginvisible = false
    },
    loginToggle() {
      this.loginvisible = !this.loginvisible
      this.loginFirst = false
      this.submitvisible = false
    },
    submitShow() {
      if (this.user) {
        this.submitvisible = true
      } else {
        this.loginvisible = true
      }
    },
    submitHide() {
      this.loginvisible = false
      this.submitvisible = false
    },
    submitToggle() {
      this.loginFirst = true
      if (this.submitvisible) {
        this.submitvisible = !this.submitvisible
        this.loginvisible = false
        this.uservisible = false
        return
      }
      if (!this.user) {
        this.loginvisible = !this.loginvisible
        return
      }
      this.submitvisible = true
      this.loginvisible = false
      this.uservisible = false
    },
    userShow() {
      this.uservisible = true
      this.submitvisible = false
    },
    userHide() {
      this.uservisible = false
    },
    userToggle() {
      this.uservisible = !this.uservisible
      this.submitvisible = false
    },
    showUserForm() {
      this.user = true
    },
    showAlert() {
      this.alert = true
      setTimeout(() => this.hideAlert(), 10000)
    },
    hideAlert() {
      this.alert = false
    },
    afterSubmit(message) {
      this.submitHide()
      this.showAlert()
      message.published = !this.moderated
      if (message.isResponse) {
        this.addReply(message)
      } else {
        this.addMessage(message)
      }
      this.mergeMessages()
    }
  }
})

export default App
</script>
