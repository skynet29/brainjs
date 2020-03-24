(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
	    clients: [
	      {name: 'Marc', age: 20},
	      {name: 'Brigitte', age: 18}
	    ]
	},
	events: {
		onAddClient: function(ev) {
			console.log('onAddClient')
			ev.preventDefault();
			ctrl.model.clients.push($(this).getFormData())
			ctrl.update()
			$(this).resetForm()
		},
		onRemoveClient: function(ev) {
			var idx = $(this).closest('tr').index()
			console.log('onRemoveClient', idx)
			ctrl.model.clients.splice(idx, 1)
			ctrl.update()
		}
	}
}
`

const htmlCode = `
<div id="main">
	<h2>Clients</h2>
	<table>
		<thead>
		  <tr>
		    <th>Name</th>
		    <th>Age</th>
		    <th>Action</th>
		  </tr>
		</thead>
		<tbody bn-each="clients" bn-event="click.delBtn: onRemoveClient">
			<tr>
				<td bn-text="$scope.$i.name"></td>
				<td bn-text="$scope.$i.age"></td>
				<td><button class="delBtn" title="Delete">Delete</button>
			</tr>

		</tbody>
	 
	</table>	

	<h2>Add client</h2>
	<form bn-event="submit: onAddClient">
		<input type="text" placeholder="name" name="name" required><br>
		<input type="number" placeholder="age" name="age" required><br>
		<input type="submit" value="Add">
	</form>	
</div>
`

$$.control.registerControl('test6', {
	template: {gulp_inject: './test6.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
			    clients: [
			      {name: 'Marc', age: 20},
			      {name: 'Brigitte', age: 18}
			    ],
			    htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()
			},
			events: {
				onAddClient: function(ev) {
					console.log('onAddClient')
					ev.preventDefault();
					ctrl.model.clients.push($(this).getFormData())
					ctrl.update()
					$(this).resetForm()
				},
				onRemoveClient: function(ev) {
      				var idx = $(this).closest('tr').index()
					console.log('onRemoveClient', idx)
					ctrl.model.clients.splice(idx, 1)
					ctrl.update()
				}
			}			
		
		})
	}
})

})();

