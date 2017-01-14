export const youtubePattern = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)/g

export const processEmbedData = data => {
  const oembed = {...data}
  oembed.style = 'padding-bottom: ' + (oembed.height / oembed.width * 100) + '%;'
  return {mediatype: 'youtube', oembed}
}
