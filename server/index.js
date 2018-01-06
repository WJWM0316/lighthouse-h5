var express = require('express');
const path = require('path')
// var proxyMiddleware = require('http-proxy-middleware')
// var config = require('../config')
var app = express();

// proxy
// const proxyTable = config.server.proxyTable
// Object.keys(proxyTable).forEach(function (context) {
//   var options = proxyTable[context]
//   if (typeof options === 'string') {
//     options = {target: options}
//   }
//   app.use(proxyMiddleware(context, options))
// })

// serve pure static assets
app.use('/static', express.static(path.resolve(__dirname, '../dist/static')))

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')({
  index: '/index.html',
  verbose: true
}))

// /index.html
app.get('/index.html', function (req, res) {
  var options = {
    root: __dirname + '/../dist/',
  }

  var fileName = 'index.html'

  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err)
      res.status(err.status).end()
    }
  })
})

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
