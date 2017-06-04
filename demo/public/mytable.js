(function() {

var html = `
  <input type="text" bn-model="filter" placeholder="filter by name" bn-update="input"><br>
	<table border="1">
		<thead>
			<tr>
				<th>Name</th>
				<th>City</th>
        <th>Action</th>
			</tr>
		</thead>

		<tbody bn-each="@getFilteredClients">
			<tr>
				<td bn-text="name"></td>
				<td bn-text="city"></td>
        <td><button bn-event="click: onDelete">Delete</button></td>
			</tr>
		</tbody>
	</table>

	<p>Toto: <span bn-text="toto"></span></p>

`
var model = {
  init: function() {
    console.log('init')
    this.filter = ''
    this.toto = ''

    this.clients = [
      {
        name: 'Quentin',
        city: 'Rennes'
      },
      {
        name: 'Marc',
        city: 'Bethune'
      }
    ]

  },

   rules: {
     '@getFilteredClients': ['filter', 'clients']
   },
  
  methods: {

    onDelete: function(evt) {
      console.log('onDelete', evt.info())
      var idx = this.clients.indexOf(evt.info().data)
      this.clients.splice(idx, 1)
      this.update('clients')
    },
    
    getFilteredClients: function() {
      var filter = this.filter
      return this.clients.filter(function(client) {
        return client.name.startsWith(filter)
      })
    }
  }
}

brain.registerControl('MyTable', function(elt) {

	return brain.createCustomControl(elt, model, html)
})




})()