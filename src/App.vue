<style lang="scss" src="./styles/App.scss"></style>
<template lang="html" src="./templates/App.html"></template>
<script>
import ShMessage from './components/ShMessage.vue'
import ShLogin from './components/ShLogin.vue'
import ShSubmit from './components/ShSubmit.vue'
import Vue from 'vue'
import socketIOClient from 'socket.io-client'
import sailsIOClient from 'sails.io.js'
import _ from 'lodash/array'
import dateFormat from 'dateformat'
import Favico from 'favico.js'

const PER_PAGE = 10

const io = sailsIOClient(socketIOClient)
io.sails.url = 'https://shoutbox.rozhlas.cz'
const socket = io.socket

const favicon = new Favico()
let CSRF = ''

socket.on('connect', () => {
  socket.get('/csrfToken', (data) => {
    CSRF = data._csrf
    io.sails.headers = {
      'X-CSRF-Token': data._csrf
    }
  })
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
  return dateFormat(new Date(value), 'd.m.yyyy H:MM:ss')
})

var App = Vue.component('app', {
  components: {
    ShMessage,
    ShLogin,
    ShSubmit
  },
  data() {
    return {
      name: this.name,
      id: this.id,
      form: this.form,
      messages: this.messages,
      newmessages: this.newmessages,
      page: this.page,
      user: this.user
    }
  },
  created() {
    this.init()
    socket.on('stream', this.processEvent)
  },
  methods: {
    init() {
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
      return new Promise((resolve, reject) => {
        socket.get('/streams/messages', {
          id: this.id,
          skip: this.page
        }, resolve)
      })
    },
    processMessages(data, err) {
      return new Promise((resolve, reject) => {
        if (err) {
          return reject(err)
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
            this.addMessage(message)
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
      if (new Date(message.created) > new Date(m[m.length - 1].created)) {
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
      return CSRF
    }
  },
  events: {
    'user-load': function() {
      this.getUser()
    }
  }
})

export default App
</script>