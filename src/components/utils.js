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
      console.log(url, data)
      if (err.statusCode !== 200) {
        return reject(err)
      }
      const oembed = {...data}
      oembed.style = 'padding-bottom: ' + (oembed.height / oembed.width * 100) + '%;'
      resolve({mediatype: 'embed', oembed})
    })
  })
}
