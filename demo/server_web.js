
var express = require('express')

var app = express()

const clients = [
	{name: 'Marc', age: 47},
	{name: 'Brigitte', age: 22}
]

app.get('/api/clients', function(req, res) {

	res.json(clients)
})


app.use(express.static('../dist'))

app.listen(9000, function() {
	console.log('Server listening on port 9000 ...')
})