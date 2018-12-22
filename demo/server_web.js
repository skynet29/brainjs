
var express = require('express')

var app = express()

app.use('/lib', express.static('../dist'))
app.use('/externals', express.static('../externals'))

app.use(express.static('public'))

app.listen(9000, function() {
	console.log('Server listening on port 9000 ...')
})