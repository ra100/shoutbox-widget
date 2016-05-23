import Vue from 'vue'
import App from './App.vue'
import io from 'socket.io-client'

const socket = io('https://shoutbox.rozhlas.cz')
let name = document.getElementById('shoutbox').getAttribute('data-shoutbox-name')

socket.on('connect', (event) => {
  console.log('Socket connected')
})

console.log(name)

/* eslint-disable no-new */
var app = new Vue({el: '#shoutbox', components: {App}})

console.log(app)
