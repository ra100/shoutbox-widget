<style lang="scss" src="./styles/App.scss"></style>
<template lang="html" src="./templates/App.html"></template>
<script>
import ShMessage from './components/ShMessage.vue'
import Vue from 'vue'
import socketIOClient from 'socket.io-client'
import sailsIOClient from 'sails.io.js'
import _ from 'lodash'

const PER_PAGE = 10

const io = sailsIOClient(socketIOClient)
io.sails.url = 'https://shoutbox.rozhlas.cz'
const socket = io.socket

socket.on('connect', () => {
  socket.get('/csrfToken', (data) => {
    io.sails.headers = {
      'x-csrf-token': data._csrf
    }
  })
})

function sortByDate(a, b) {
  return (new Date(a.created) < new Date(b.created))
}

var App = Vue.component('app', {
  components: {
    ShMessage
  },
  data() {
    return {
      name: this.name,
      id: this.id,
      form: this.form,
      messages: this.messages,
      newmessages: this.newmessages,
      page: this.page
    }
  },
  computed() {
    return {
      new_count: function() {
        console.log('kikotina')
        return this.newmessages.length
      }
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
    },
    removeMessage(id) {
      this.messages = this.messages.filter(function(e) {
        return (e.id !== id)
      })
      this.newmessages = this.newmessages.filter(function(e) {
        return (e.id !== id)
      })
    },
    mergeMessages() {
      let m = _.unionBy(this.messages, this.newmessages, 'id')
      m.sort(sortByDate)
      this.newmessages = []
      this.messages = _.slice(m, 0, PER_PAGE)
    }
  }
})

export default App
</script>