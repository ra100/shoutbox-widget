export const youtubePattern = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)/g

// source https://mathiasbynens.be/demo/url-regex
export const urlPattern = /(http(?:s?):\/\/[^\s/$.?#].[^\s]*)/g

export const processEmbedUrl = (url, socket) => {
  let requestPath = '/oembed/embed'
  if (url.match(youtubePattern)) {
    requestPath = '/oembed/youtube'
  }
  return new Promise((resolve, reject) => {
    socket.request({
      method: 'get',
      url: requestPath,
      data: { url },
      headers: {
        'X-CSRF-Token': window.CSRF
      }
    }, (data, err) => {
      if (err.statusCode !== 200) {
        return reject(new Error(err))
      }
      const oembed = {...data}
      oembed.style = 'padding-bottom: ' + (oembed.height / oembed.width * 100) + '%;'
      resolve({mediatype: 'embed', oembed})
    })
  })
}

export const getParameterByName = (param, url) => {
  if (!url) url = window.location.href
  const name = param.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export const getHostname = (url) => {
  const parser = document.createElement('a')
  parser.href = url
  return parser.hostname
}
