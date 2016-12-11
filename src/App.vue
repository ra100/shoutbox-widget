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
import Favico from 'favico.js'
import request from 'superagent'
import Velocity from 'velocity-animate'

const PER_PAGE = 10

const io = sailsIOClient(socketIOClient)
io.sails.url = 'https://shoutbox.rozhlas.cz'
const socket = io.socket

const favicon = new Favico()
window.CSRF = ''

request.get(`${io.sails.url}/csrfToken`).then(res => {
  window.CSRF = res.body._csrf
  io.sails.headers = {
    'X-CSRF-Token': res.body._csrf
  }
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

const eventHub = new Vue()

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
      messages: this.messages || [],
      newmessages: this.newmessages || [],
      page: this.page || 0,
      user: this.user,
      mode: this.mode || 'normal',
      loginvisible: this.loginvisible || false,
      submitvisible: this.submivisible || false,
      uservisible: this.uservisible || false
    }
  },
  created() {
    socket.on('stream', this.processEvent)
    eventHub.$on('user-load', this.getUser)
    eventHub.$on('user-form', this.showUserForm)
    this.newmessages = []
    this.page = 0
    this.getName()
    this.getStream()
      .then(this.processStream)
      .then(this.getMessages)
      .then(this.processMessages)
      .catch(console.error)
    this.getUser()
  },
  beforeDestroy() {
    eventHub.$off('user-load', this.getUser)
    eventHub.$off('user-form', this.showUserForm)
  },
  methods: {
    getName() {
      this.name = document
        .getElementById('shoutbox')
        .getAttribute('data-shoutbox-name')
    },
    getStream() {
      return new Promise((resolve, reject) => {
        socket.get('/streams/public', {
          name: this.name
        }, resolve)
      })
    },
    processStream(data, err) {
      return new Promise((resolve, reject) => {
        if (err) {
          return reject()
        }
        this.id = data.id
        this.form = data.form
        resolve()
      })
    },
    getMessages() {
      let skip = this.page * PER_PAGE + this.newmessages.length
      return new Promise((resolve, reject) => {
        socket.get('/streams/messages', {
          id: this.id,
          skip: skip
        }, resolve)
      })
    },
    processMessages(data, err) {
      return new Promise((resolve, reject) => {
        if (err || !data) {
          return reject(err)
        }
        while (data.length < 9 && (this.messages.length + data.length) >= 9) {
          data.push(_.last(this.messages))
        }
        this.messages = data
        resolve()
      })
    },
    processEvent(event) {
      switch (event.verb) {
        case 'addedTo':
          let message = event.added
          if (typeof message === 'undefined') {
            return
          }
          if (!message.published) {
            this.removeMessage(message.id)
            return
          } else {
            if (message.isResponse !== true) {
              this.addMessage(message)
            }
          }
          break
        case 'removedFrom':
          this.removeMessage(event.removedId)
          break
      }
    },
    addMessage(message) {
      let m = this.messages
      for (let i in m) {
        if (m[i].id === message.id) {
          m[i] = message
          return
        }
      }
      let n = this.newmessages
      if (new Date(message.created) > new Date(m[0].created)) {
        n.push(message)
        n.sort(sortByDate)
        n = _.slice(n, 0, PER_PAGE)
      }
      this.updateNewCount()
    },
    removeMessage(id) {
      this.messages = this.messages.filter(function(e) {
        return (e.id !== id)
      })
      this.newmessages = this.newmessages.filter(function(e) {
        return (e.id !== id)
      })
      this.updateNewCount()
    },
    mergeMessages() {
      let m = _.unionBy(this.messages, this.newmessages, 'id')
      m.sort(sortByDate)
      this.newmessages = []
      this.messages = _.slice(m, 0, PER_PAGE)
      this.updateNewCount()
    },
    updateNewCount() {
      favicon.badge(this.newmessages.length)
    },
    getUser() {
      socket.get('/users/me', null, (data, resp) => {
        if (resp.statusCode !== 200) {
          this.user = undefined
        } else {
          this.user = data
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
        io.sails.headers = {
          'X-CSRF-Token': res.body._csrf
        }
        if (callback) {
          callback(res.body._csrf)
        }
      })
    },
    nextPage() {
      this.page++
      this.getMessages()
        .then(this.processMessages)
        .catch(console.error)
    },
    prevPage() {
      if (this.page > 0) {
        this.page--
        this.getMessages()
          .then(this.processMessages)
          .catch(console.error)
      }
    },
    jumpToStart() {
      this.page = 0
      this.newmessages = []
      this.getMessages()
        .then(this.processMessages)
        .catch(console.error)
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
      if (this.submitvisible) {
        this.submitvisible = !this.submitvisible
        this.loginvisible = false
        return
      }
      if (!this.user) {
        this.loginvisible = !this.loginvisible
        return
      } else {
        this.submitvisible = true
        this.loginvisible = false
      }
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
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style['max-height'] = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 100
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, 'max-height': '1000px' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 100
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, 'max-height': 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})

export default App
</script>