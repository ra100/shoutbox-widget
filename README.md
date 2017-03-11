# shoutbox-widget

> Shoutbox widget in Vue.js

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8082
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## USAGE

Include in html

```html
<div id="shoutbox" class="box EXPANDDIRECTION" data-shoutbox-name="STREAM_MACHINE_NAME">
  <app id="shoutbox-widget"/>
</div>
```

*   `EXPANDDIRECTION` - can be `left` or `right`, default: `left`
*   `STREAM_MACHINE_NAME` - name of the stream in social feed backend

Link js files

```html
<script type="text/javascript" src="path/to/script/shoutbox.js"></script>
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## LICENSE

Czech Radio logo (c) Český Rozhlas.
