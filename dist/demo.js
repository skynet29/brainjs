
$(function() {

	$$.viewController('#main', {
		data: {
			routes: [
				{href: '/', redirect: '/test1'},
				{href: '/test1', control: 'test1'},
				{href: '/test2', control: 'test2'},
				{href: '/test3', control: 'test3'},
				{href: '/test4', control: 'test4'},
				{href: '/test5', control: 'test5'},
				{href: '/test6', control: 'test6'},
				{href: '/test7', control: 'test7'}
			]
		}
	})
});

$$.control.registerControl('test1', {
	template: "<p bn-text=\"message\"></p>",
	init: function(elt) {
		const ctrl = $$.viewController(elt.children(), {
			data: {
				message: 'Hello World'
			}
		})
	}
});

$$.control.registerControl('test2', {
	template: "<input type=\"text\" bn-val=\"message\" bn-update=\"input\">\n<p>Message: <span bn-text=\"message\"></span></p>	",
	init: function(elt) {
		const ctrl = $$.viewController(elt.children(), {
			data: {
				message: 'Hello World'
			}
		})
	}
});

$$.control.registerControl('test3', {
	template: "<h2>Clients</h2>\n<ul bn-each=\"c of clients\">\n	<li bn-text=\"c\"></li>\n</ul>",
	init: function(elt) {
		const ctrl = $$.viewController(elt.children(), {
			data: {
				clients: ['Marc', 'Brigitte']
			}
		})
	}
});

$$.control.registerControl('test4', {
	template: "<h2>Clients</h2>\n<ul bn-each=\"c of clients\">\n	<li bn-text=\"c\"></li>\n</ul>\n\n<h2>Add client</h2>\n<form bn-event=\"submit: onAddClient\">\n	<input type=\"text\" placeholder=\"name\" name=\"name\" autofocus=\"\" required=\"\">\n	<button type=\"submit\">Add</button>\n</form>	",
	init: function(elt) {
		const ctrl = $$.viewController(elt.children(), {
			data: {
				clients: ['Marc', 'Brigitte']
			},
			events: {
				onAddClient: function(ev) {
					console.log('onAddClient')
					ev.preventDefault()
					ctrl.model.clients.push($(this).getFormData().name)
					ctrl.update('clients')
					$(this).resetForm()

				}
			}
		})
	}
});

$$.control.registerControl('test5', {
	template: "<style type=\"text/css\">\n	table {\n		border-collapse: collapse;		\n	}\n\n	th, td {\n		border: 1px solid green;\n		padding: 5px;\n	}\n</style>\n\n<h2>Clients</h2>\n<table>\n	<thead>\n	  <tr>\n	    <th>Name</th>\n	    <th>Age</th>\n	  </tr>\n	</thead>\n	<tbody bn-each=\"c of clients\">\n		<tr>\n			<td bn-text=\"c.name\"></td>\n			<td bn-text=\"c.age\"></td>\n		</tr>\n\n	</tbody>\n \n</table>",
	init: function(elt) {
		const ctrl = $$.viewController(elt.children(), {
			data: {
			    clients: [
			      {name: 'Marc', age: 20},
			      {name: 'Brigitte', age: 18}
			    ]
			}
		})
	}
});

$$.control.registerControl('test6', {
	template: "<style type=\"text/css\">\n	table {\n		border-collapse: collapse;		\n	}\n\n	th, td {\n		border: 1px solid green;\n		padding: 5px;\n	}\n\n	form input {\n		margin-bottom: 5px;\n	}\n</style>\n\n<h2>Clients</h2>\n<table>\n	<thead>\n	  <tr>\n	    <th>Name</th>\n	    <th>Age</th>\n	    <th>Action</th>\n	  </tr>\n	</thead>\n	<tbody bn-each=\"c of clients\" bn-event=\"click.delBtn: onRemoveClient\">\n		<tr bn-data=\"item: c\">\n			<td bn-text=\"c.name\"></td>\n			<td bn-text=\"c.age\"></td>\n			<td><button class=\"delBtn\" title=\"Delete\">Delete</button>\n		</tr>\n\n	</tbody>\n \n</table>	\n\n<h2>Add client</h2>\n<form bn-event=\"submit: onAddClient\">\n	<input type=\"text\" placeholder=\"name\" name=\"name\" required><br>\n	<input type=\"number\" placeholder=\"age\" name=\"age\" required><br>\n	<input type=\"submit\" value=\"Add\">\n</form>		",
	init: function(elt) {
		const ctrl = $$.viewController(elt.children(), {
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
					ctrl.update('clients')
					$(this).resetForm()
				},
				onRemoveClient: function(ev) {
					var data = $(this).closest('tr').data('item')
      				var idx = ctrl.model.clients.indexOf(data)
      				console.log('onRemoveClient', idx, data)
					ctrl.model.clients.splice(idx, 1)
					ctrl.update('clients')
				}
			}
		})
	}
});

$$.control.registerControl('test7', {
	template: "<style type=\"text/css\">\n	table {\n		border-collapse: collapse;		\n	}\n\n	th, td {\n		border: 1px solid green;\n		padding: 5px;\n	}\n\n	form input {\n		margin-bottom: 5px;\n	}\n</style>\n\n<h2>Clients</h2>\n<table>\n	<thead>\n	  <tr>\n	    <th>Name</th>\n	    <th>Age</th>\n	    <th>Action</th>\n	  </tr>\n	</thead>\n	<tbody bn-each=\"c of clients\" bn-event=\"click.delBtn: onRemoveClient\">\n		<tr bn-data=\"item: c\">\n			<td bn-text=\"c.name\"></td>\n			<td bn-text=\"c.age\"></td>\n			<td><button class=\"delBtn\" title=\"Delete\">Delete</button>\n		</tr>\n\n	</tbody>\n \n</table>	\n\n<button bn-event=\"click: onAddClient\">Add Client</button>",
	init: function(elt) {
		const dlgAddClient = $$.formDialogController({
			title: 'Add Client',
			template: "<input type=\"text\" placeholder=\"name\" name=\"name\" required><br>\n<input type=\"number\" placeholder=\"age\" name=\"age\" required><br> 		"
		})

		const ctrl = $$.viewController(elt.children(), {
			data: {
			    clients: [
			      {name: 'Marc', age: 20},
			      {name: 'Brigitte', age: 18}
			    ]
			},
			events: {
				onAddClient: function(ev) {
					console.log('onAddClient')
					dlgAddClient.show(function(data) {
						ctrl.model.clients.push(data)
						ctrl.update('clients')	
					})
				},
				onRemoveClient: function(ev) {
					var data = $(this).closest('tr').data('item')
      				var idx = ctrl.model.clients.indexOf(data)
      				console.log('onRemoveClient', idx, data)
					ctrl.model.clients.splice(idx, 1)
					ctrl.update('clients')
				}
			}

		})
	}
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ0ZXN0MS5qcyIsInRlc3QyLmpzIiwidGVzdDMuanMiLCJ0ZXN0NC5qcyIsInRlc3Q1LmpzIiwidGVzdDYuanMiLCJ0ZXN0Ny5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZGVtby5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuJChmdW5jdGlvbigpIHtcblxuXHQkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdFx0ZGF0YToge1xuXHRcdFx0cm91dGVzOiBbXG5cdFx0XHRcdHtocmVmOiAnLycsIHJlZGlyZWN0OiAnL3Rlc3QxJ30sXG5cdFx0XHRcdHtocmVmOiAnL3Rlc3QxJywgY29udHJvbDogJ3Rlc3QxJ30sXG5cdFx0XHRcdHtocmVmOiAnL3Rlc3QyJywgY29udHJvbDogJ3Rlc3QyJ30sXG5cdFx0XHRcdHtocmVmOiAnL3Rlc3QzJywgY29udHJvbDogJ3Rlc3QzJ30sXG5cdFx0XHRcdHtocmVmOiAnL3Rlc3Q0JywgY29udHJvbDogJ3Rlc3Q0J30sXG5cdFx0XHRcdHtocmVmOiAnL3Rlc3Q1JywgY29udHJvbDogJ3Rlc3Q1J30sXG5cdFx0XHRcdHtocmVmOiAnL3Rlc3Q2JywgY29udHJvbDogJ3Rlc3Q2J30sXG5cdFx0XHRcdHtocmVmOiAnL3Rlc3Q3JywgY29udHJvbDogJ3Rlc3Q3J31cblx0XHRcdF1cblx0XHR9XG5cdH0pXG59KTtcbiIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MScsIHtcblx0dGVtcGxhdGU6IFwiPHAgYm4tdGV4dD1cXFwibWVzc2FnZVxcXCI+PC9wPlwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LmNoaWxkcmVuKCksIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJ1xuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pO1xuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyJywge1xuXHR0ZW1wbGF0ZTogXCI8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgYm4tdmFsPVxcXCJtZXNzYWdlXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG48cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVxcXCJtZXNzYWdlXFxcIj48L3NwYW4+PC9wPlx0XCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQuY2hpbGRyZW4oKSwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtZXNzYWdlOiAnSGVsbG8gV29ybGQnXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSk7XG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDMnLCB7XG5cdHRlbXBsYXRlOiBcIjxoMj5DbGllbnRzPC9oMj5cXG48dWwgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIj5cXG5cdDxsaSBibi10ZXh0PVxcXCJjXFxcIj48L2xpPlxcbjwvdWw+XCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQuY2hpbGRyZW4oKSwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pO1xuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q0Jywge1xuXHR0ZW1wbGF0ZTogXCI8aDI+Q2xpZW50czwvaDI+XFxuPHVsIGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCI+XFxuXHQ8bGkgYm4tdGV4dD1cXFwiY1xcXCI+PC9saT5cXG48L3VsPlxcblxcbjxoMj5BZGQgY2xpZW50PC9oMj5cXG48Zm9ybSBibi1ldmVudD1cXFwic3VibWl0OiBvbkFkZENsaWVudFxcXCI+XFxuXHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIm5hbWVcXFwiIG5hbWU9XFxcIm5hbWVcXFwiIGF1dG9mb2N1cz1cXFwiXFxcIiByZXF1aXJlZD1cXFwiXFxcIj5cXG5cdDxidXR0b24gdHlwZT1cXFwic3VibWl0XFxcIj5BZGQ8L2J1dHRvbj5cXG48L2Zvcm0+XHRcIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdC5jaGlsZHJlbigpLCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKS5uYW1lKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pO1xuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q1Jywge1xuXHR0ZW1wbGF0ZTogXCI8c3R5bGUgdHlwZT1cXFwidGV4dC9jc3NcXFwiPlxcblx0dGFibGUge1xcblx0XHRib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1x0XHRcXG5cdH1cXG5cXG5cdHRoLCB0ZCB7XFxuXHRcdGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xcblx0XHRwYWRkaW5nOiA1cHg7XFxuXHR9XFxuPC9zdHlsZT5cXG5cXG48aDI+Q2xpZW50czwvaDI+XFxuPHRhYmxlPlxcblx0PHRoZWFkPlxcblx0ICA8dHI+XFxuXHQgICAgPHRoPk5hbWU8L3RoPlxcblx0ICAgIDx0aD5BZ2U8L3RoPlxcblx0ICA8L3RyPlxcblx0PC90aGVhZD5cXG5cdDx0Ym9keSBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiPlxcblx0XHQ8dHI+XFxuXHRcdFx0PHRkIGJuLXRleHQ9XFxcImMubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5hZ2VcXFwiPjwvdGQ+XFxuXHRcdDwvdHI+XFxuXFxuXHQ8L3Rib2R5PlxcbiBcXG48L3RhYmxlPlwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LmNoaWxkcmVuKCksIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgICBjbGllbnRzOiBbXG5cdFx0XHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHRcdFx0ICAgIF1cblx0XHRcdH1cblx0XHR9KVxuXHR9XG59KTtcbiIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NicsIHtcblx0dGVtcGxhdGU6IFwiPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdHRhYmxlIHtcXG5cdFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcdFx0XFxuXHR9XFxuXFxuXHR0aCwgdGQge1xcblx0XHRib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcXG5cdFx0cGFkZGluZzogNXB4O1xcblx0fVxcblxcblx0Zm9ybSBpbnB1dCB7XFxuXHRcdG1hcmdpbi1ib3R0b206IDVweDtcXG5cdH1cXG48L3N0eWxlPlxcblxcbjxoMj5DbGllbnRzPC9oMj5cXG48dGFibGU+XFxuXHQ8dGhlYWQ+XFxuXHQgIDx0cj5cXG5cdCAgICA8dGg+TmFtZTwvdGg+XFxuXHQgICAgPHRoPkFnZTwvdGg+XFxuXHQgICAgPHRoPkFjdGlvbjwvdGg+XFxuXHQgIDwvdHI+XFxuXHQ8L3RoZWFkPlxcblx0PHRib2R5IGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCIgYm4tZXZlbnQ9XFxcImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcXFwiPlxcblx0XHQ8dHIgYm4tZGF0YT1cXFwiaXRlbTogY1xcXCI+XFxuXHRcdFx0PHRkIGJuLXRleHQ9XFxcImMubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5hZ2VcXFwiPjwvdGQ+XFxuXHRcdFx0PHRkPjxidXR0b24gY2xhc3M9XFxcImRlbEJ0blxcXCIgdGl0bGU9XFxcIkRlbGV0ZVxcXCI+RGVsZXRlPC9idXR0b24+XFxuXHRcdDwvdHI+XFxuXFxuXHQ8L3Rib2R5PlxcbiBcXG48L3RhYmxlPlx0XFxuXFxuPGgyPkFkZCBjbGllbnQ8L2gyPlxcbjxmb3JtIGJuLWV2ZW50PVxcXCJzdWJtaXQ6IG9uQWRkQ2xpZW50XFxcIj5cXG5cdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgcmVxdWlyZWQ+PGJyPlxcblx0PGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgcGxhY2Vob2xkZXI9XFxcImFnZVxcXCIgbmFtZT1cXFwiYWdlXFxcIiByZXF1aXJlZD48YnI+XFxuXHQ8aW5wdXQgdHlwZT1cXFwic3VibWl0XFxcIiB2YWx1ZT1cXFwiQWRkXFxcIj5cXG48L2Zvcm0+XHRcdFwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LmNoaWxkcmVuKCksIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgICBjbGllbnRzOiBbXG5cdFx0XHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHRcdFx0ICAgIF1cblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHR2YXIgZGF0YSA9ICQodGhpcykuY2xvc2VzdCgndHInKS5kYXRhKCdpdGVtJylcbiAgICAgIFx0XHRcdFx0dmFyIGlkeCA9IGN0cmwubW9kZWwuY2xpZW50cy5pbmRleE9mKGRhdGEpXG4gICAgICBcdFx0XHRcdGNvbnNvbGUubG9nKCdvblJlbW92ZUNsaWVudCcsIGlkeCwgZGF0YSlcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMuc3BsaWNlKGlkeCwgMSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHR9XG59KTtcbiIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NycsIHtcblx0dGVtcGxhdGU6IFwiPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdHRhYmxlIHtcXG5cdFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcdFx0XFxuXHR9XFxuXFxuXHR0aCwgdGQge1xcblx0XHRib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcXG5cdFx0cGFkZGluZzogNXB4O1xcblx0fVxcblxcblx0Zm9ybSBpbnB1dCB7XFxuXHRcdG1hcmdpbi1ib3R0b206IDVweDtcXG5cdH1cXG48L3N0eWxlPlxcblxcbjxoMj5DbGllbnRzPC9oMj5cXG48dGFibGU+XFxuXHQ8dGhlYWQ+XFxuXHQgIDx0cj5cXG5cdCAgICA8dGg+TmFtZTwvdGg+XFxuXHQgICAgPHRoPkFnZTwvdGg+XFxuXHQgICAgPHRoPkFjdGlvbjwvdGg+XFxuXHQgIDwvdHI+XFxuXHQ8L3RoZWFkPlxcblx0PHRib2R5IGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCIgYm4tZXZlbnQ9XFxcImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcXFwiPlxcblx0XHQ8dHIgYm4tZGF0YT1cXFwiaXRlbTogY1xcXCI+XFxuXHRcdFx0PHRkIGJuLXRleHQ9XFxcImMubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5hZ2VcXFwiPjwvdGQ+XFxuXHRcdFx0PHRkPjxidXR0b24gY2xhc3M9XFxcImRlbEJ0blxcXCIgdGl0bGU9XFxcIkRlbGV0ZVxcXCI+RGVsZXRlPC9idXR0b24+XFxuXHRcdDwvdHI+XFxuXFxuXHQ8L3Rib2R5PlxcbiBcXG48L3RhYmxlPlx0XFxuXFxuPGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkQ2xpZW50XFxcIj5BZGQgQ2xpZW50PC9idXR0b24+XCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGRsZ0FkZENsaWVudCA9ICQkLmZvcm1EaWFsb2dDb250cm9sbGVyKHtcblx0XHRcdHRpdGxlOiAnQWRkIENsaWVudCcsXG5cdFx0XHR0ZW1wbGF0ZTogXCI8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIm5hbWVcXFwiIG5hbWU9XFxcIm5hbWVcXFwiIHJlcXVpcmVkPjxicj5cXG48aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBwbGFjZWhvbGRlcj1cXFwiYWdlXFxcIiBuYW1lPVxcXCJhZ2VcXFwiIHJlcXVpcmVkPjxicj4gXHRcdFwiXG5cdFx0fSlcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQuY2hpbGRyZW4oKSwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXVxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0XHRcdGRsZ0FkZENsaWVudC5zaG93KGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKGRhdGEpXG5cdFx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXHRcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHR2YXIgZGF0YSA9ICQodGhpcykuY2xvc2VzdCgndHInKS5kYXRhKCdpdGVtJylcbiAgICAgIFx0XHRcdFx0dmFyIGlkeCA9IGN0cmwubW9kZWwuY2xpZW50cy5pbmRleE9mKGRhdGEpXG4gICAgICBcdFx0XHRcdGNvbnNvbGUubG9nKCdvblJlbW92ZUNsaWVudCcsIGlkeCwgZGF0YSlcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMuc3BsaWNlKGlkeCwgMSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH0pXG5cdH1cbn0pO1xuIl19
