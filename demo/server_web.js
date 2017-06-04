var port = parseInt(process.argv[2])
if (isNaN(port)) {
	console.log('Please specify a listen port')
	process.exit(1)
}

var express = require('express')

var app = express()

app.use('/jquery', express.static('../node_modules/jquery/dist'))
app.use('/brain', express.static('../dist'))

app.use(express.static('public'))

app.listen(port)