(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
	    clients: [
	      {name: 'Marc', age: 20},
	      {name: 'Brigitte', age: 18}
	    ]
	}	
}
`

const htmlCode = `
<div id="main">
	<table>
		<thead>
		  <tr>
		    <th>Name</th>
		    <th>Age</th>
		  </tr>
		</thead>
		<tbody bn-each="c of clients">
			<tr>
				<td bn-text="c.name"></td>
				<td bn-text="c.age"></td>
			</tr>
		</tbody>
	 
	</table>
</div>
`

$$.control.registerControl('test5', {
	template: {gulp_inject: './test5.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
			    clients: [
			      {name: 'Marc', age: 20},
			      {name: 'Brigitte', age: 18}
			    ],
				htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()			
			}		
		})
	}
})

})();

