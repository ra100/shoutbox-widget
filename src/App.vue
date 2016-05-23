<style lang="scss" src="./styles/App.scss"></style>
<template lang="pug" src="./templates/App.pug"></template>
<script>
import Hello from './components/Hello.vue'
import Vue from 'vue'
import socketIOClient from 'socket.io-client'
import sailsIOClient from 'sails.io.js'

const io = sailsIOClient(socketIOClient)
io.sails.url = 'https://shoutbox.rozhlas.cz'
const socket = io.socket

socket.on('connect', () => {
  console.log('Socket connected')
  socket.get('/csrfToken', (data) => {
    io.sails.headers = {
      'x-csrf-token': data._csrf
    }
  })
})

var App = Vue.component('app', {
  state: {
    name: '',
    id: '0',
    form: {},
    messages: [],
    page: 0
  },
  components: {
    Hello
  },
  created() {
    this.init()
  },
  methods: {
    init() {
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
        console.log(this.id)
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
        console.log(this.messages)
        resolve()
      })
    }
  }
})

export default App
</script>