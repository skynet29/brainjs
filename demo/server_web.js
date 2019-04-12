const publicPath = process.env.PUBLIC

var express = require('express')

var app = express()


app.use(express.static(publicPath))

app.listen(9000, function() {
	console.log('Server listening on port 9000 ...')
})