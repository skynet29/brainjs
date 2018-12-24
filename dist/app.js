
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ0ZXN0MS5qcyIsInRlc3QyLmpzIiwidGVzdDMuanMiLCJ0ZXN0NC5qcyIsInRlc3Q1LmpzIiwidGVzdDYuanMiLCJ0ZXN0Ny5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4kKGZ1bmN0aW9uKCkge1xuXG5cdCQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0XHRkYXRhOiB7XG5cdFx0XHRyb3V0ZXM6IFtcblx0XHRcdFx0e2hyZWY6ICcvJywgcmVkaXJlY3Q6ICcvdGVzdDEnfSxcblx0XHRcdFx0e2hyZWY6ICcvdGVzdDEnLCBjb250cm9sOiAndGVzdDEnfSxcblx0XHRcdFx0e2hyZWY6ICcvdGVzdDInLCBjb250cm9sOiAndGVzdDInfSxcblx0XHRcdFx0e2hyZWY6ICcvdGVzdDMnLCBjb250cm9sOiAndGVzdDMnfSxcblx0XHRcdFx0e2hyZWY6ICcvdGVzdDQnLCBjb250cm9sOiAndGVzdDQnfSxcblx0XHRcdFx0e2hyZWY6ICcvdGVzdDUnLCBjb250cm9sOiAndGVzdDUnfSxcblx0XHRcdFx0e2hyZWY6ICcvdGVzdDYnLCBjb250cm9sOiAndGVzdDYnfSxcblx0XHRcdFx0e2hyZWY6ICcvdGVzdDcnLCBjb250cm9sOiAndGVzdDcnfVxuXHRcdFx0XVxuXHRcdH1cblx0fSlcbn0pO1xuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxJywge1xuXHR0ZW1wbGF0ZTogXCI8cCBibi10ZXh0PVxcXCJtZXNzYWdlXFxcIj48L3A+XCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQuY2hpbGRyZW4oKSwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtZXNzYWdlOiAnSGVsbG8gV29ybGQnXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSk7XG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDInLCB7XG5cdHRlbXBsYXRlOiBcIjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBibi12YWw9XFxcIm1lc3NhZ2VcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcbjxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XFxcIm1lc3NhZ2VcXFwiPjwvc3Bhbj48L3A+XHRcIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdC5jaGlsZHJlbigpLCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCdcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59KTtcbiIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MycsIHtcblx0dGVtcGxhdGU6IFwiPGgyPkNsaWVudHM8L2gyPlxcbjx1bCBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiPlxcblx0PGxpIGJuLXRleHQ9XFxcImNcXFwiPjwvbGk+XFxuPC91bD5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdC5jaGlsZHJlbigpLCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSk7XG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDQnLCB7XG5cdHRlbXBsYXRlOiBcIjxoMj5DbGllbnRzPC9oMj5cXG48dWwgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIj5cXG5cdDxsaSBibi10ZXh0PVxcXCJjXFxcIj48L2xpPlxcbjwvdWw+XFxuXFxuPGgyPkFkZCBjbGllbnQ8L2gyPlxcbjxmb3JtIGJuLWV2ZW50PVxcXCJzdWJtaXQ6IG9uQWRkQ2xpZW50XFxcIj5cXG5cdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgYXV0b2ZvY3VzPVxcXCJcXFwiIHJlcXVpcmVkPVxcXCJcXFwiPlxcblx0PGJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiPkFkZDwvYnV0dG9uPlxcbjwvZm9ybT5cdFwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LmNoaWxkcmVuKCksIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ11cblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpLm5hbWUpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0XHRcdCQodGhpcykucmVzZXRGb3JtKClcblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSk7XG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDUnLCB7XG5cdHRlbXBsYXRlOiBcIjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHR0YWJsZSB7XFxuXHRcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XHRcdFxcblx0fVxcblxcblx0dGgsIHRkIHtcXG5cdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JlZW47XFxuXHRcdHBhZGRpbmc6IDVweDtcXG5cdH1cXG48L3N0eWxlPlxcblxcbjxoMj5DbGllbnRzPC9oMj5cXG48dGFibGU+XFxuXHQ8dGhlYWQ+XFxuXHQgIDx0cj5cXG5cdCAgICA8dGg+TmFtZTwvdGg+XFxuXHQgICAgPHRoPkFnZTwvdGg+XFxuXHQgIDwvdHI+XFxuXHQ8L3RoZWFkPlxcblx0PHRib2R5IGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCI+XFxuXHRcdDx0cj5cXG5cdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5uYW1lXFxcIj48L3RkPlxcblx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLmFnZVxcXCI+PC90ZD5cXG5cdFx0PC90cj5cXG5cXG5cdDwvdGJvZHk+XFxuIFxcbjwvdGFibGU+XCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQuY2hpbGRyZW4oKSwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pO1xuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q2Jywge1xuXHR0ZW1wbGF0ZTogXCI8c3R5bGUgdHlwZT1cXFwidGV4dC9jc3NcXFwiPlxcblx0dGFibGUge1xcblx0XHRib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1x0XHRcXG5cdH1cXG5cXG5cdHRoLCB0ZCB7XFxuXHRcdGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xcblx0XHRwYWRkaW5nOiA1cHg7XFxuXHR9XFxuXFxuXHRmb3JtIGlucHV0IHtcXG5cdFx0bWFyZ2luLWJvdHRvbTogNXB4O1xcblx0fVxcbjwvc3R5bGU+XFxuXFxuPGgyPkNsaWVudHM8L2gyPlxcbjx0YWJsZT5cXG5cdDx0aGVhZD5cXG5cdCAgPHRyPlxcblx0ICAgIDx0aD5OYW1lPC90aD5cXG5cdCAgICA8dGg+QWdlPC90aD5cXG5cdCAgICA8dGg+QWN0aW9uPC90aD5cXG5cdCAgPC90cj5cXG5cdDwvdGhlYWQ+XFxuXHQ8dGJvZHkgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIiBibi1ldmVudD1cXFwiY2xpY2suZGVsQnRuOiBvblJlbW92ZUNsaWVudFxcXCI+XFxuXHRcdDx0ciBibi1kYXRhPVxcXCJpdGVtOiBjXFxcIj5cXG5cdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5uYW1lXFxcIj48L3RkPlxcblx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLmFnZVxcXCI+PC90ZD5cXG5cdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cXFwiZGVsQnRuXFxcIiB0aXRsZT1cXFwiRGVsZXRlXFxcIj5EZWxldGU8L2J1dHRvbj5cXG5cdFx0PC90cj5cXG5cXG5cdDwvdGJvZHk+XFxuIFxcbjwvdGFibGU+XHRcXG5cXG48aDI+QWRkIGNsaWVudDwvaDI+XFxuPGZvcm0gYm4tZXZlbnQ9XFxcInN1Ym1pdDogb25BZGRDbGllbnRcXFwiPlxcblx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJuYW1lXFxcIiBuYW1lPVxcXCJuYW1lXFxcIiByZXF1aXJlZD48YnI+XFxuXHQ8aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBwbGFjZWhvbGRlcj1cXFwiYWdlXFxcIiBuYW1lPVxcXCJhZ2VcXFwiIHJlcXVpcmVkPjxicj5cXG5cdDxpbnB1dCB0eXBlPVxcXCJzdWJtaXRcXFwiIHZhbHVlPVxcXCJBZGRcXFwiPlxcbjwvZm9ybT5cdFx0XCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQuY2hpbGRyZW4oKSwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXVxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdHZhciBkYXRhID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmRhdGEoJ2l0ZW0nKVxuICAgICAgXHRcdFx0XHR2YXIgaWR4ID0gY3RybC5tb2RlbC5jbGllbnRzLmluZGV4T2YoZGF0YSlcbiAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4LCBkYXRhKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pO1xuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q3Jywge1xuXHR0ZW1wbGF0ZTogXCI8c3R5bGUgdHlwZT1cXFwidGV4dC9jc3NcXFwiPlxcblx0dGFibGUge1xcblx0XHRib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1x0XHRcXG5cdH1cXG5cXG5cdHRoLCB0ZCB7XFxuXHRcdGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xcblx0XHRwYWRkaW5nOiA1cHg7XFxuXHR9XFxuXFxuXHRmb3JtIGlucHV0IHtcXG5cdFx0bWFyZ2luLWJvdHRvbTogNXB4O1xcblx0fVxcbjwvc3R5bGU+XFxuXFxuPGgyPkNsaWVudHM8L2gyPlxcbjx0YWJsZT5cXG5cdDx0aGVhZD5cXG5cdCAgPHRyPlxcblx0ICAgIDx0aD5OYW1lPC90aD5cXG5cdCAgICA8dGg+QWdlPC90aD5cXG5cdCAgICA8dGg+QWN0aW9uPC90aD5cXG5cdCAgPC90cj5cXG5cdDwvdGhlYWQ+XFxuXHQ8dGJvZHkgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIiBibi1ldmVudD1cXFwiY2xpY2suZGVsQnRuOiBvblJlbW92ZUNsaWVudFxcXCI+XFxuXHRcdDx0ciBibi1kYXRhPVxcXCJpdGVtOiBjXFxcIj5cXG5cdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5uYW1lXFxcIj48L3RkPlxcblx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLmFnZVxcXCI+PC90ZD5cXG5cdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cXFwiZGVsQnRuXFxcIiB0aXRsZT1cXFwiRGVsZXRlXFxcIj5EZWxldGU8L2J1dHRvbj5cXG5cdFx0PC90cj5cXG5cXG5cdDwvdGJvZHk+XFxuIFxcbjwvdGFibGU+XHRcXG5cXG48YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25BZGRDbGllbnRcXFwiPkFkZCBDbGllbnQ8L2J1dHRvbj5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cdFx0Y29uc3QgZGxnQWRkQ2xpZW50ID0gJCQuZm9ybURpYWxvZ0NvbnRyb2xsZXIoe1xuXHRcdFx0dGl0bGU6ICdBZGQgQ2xpZW50Jyxcblx0XHRcdHRlbXBsYXRlOiBcIjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgcmVxdWlyZWQ+PGJyPlxcbjxpbnB1dCB0eXBlPVxcXCJudW1iZXJcXFwiIHBsYWNlaG9sZGVyPVxcXCJhZ2VcXFwiIG5hbWU9XFxcImFnZVxcXCIgcmVxdWlyZWQ+PGJyPiBcdFx0XCJcblx0XHR9KVxuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdC5jaGlsZHJlbigpLCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHQgICAgY2xpZW50czogW1xuXHRcdFx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdFx0XHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0XHRcdCAgICBdXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZGxnQWRkQ2xpZW50LnNob3coZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goZGF0YSlcblx0XHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcdFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdHZhciBkYXRhID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmRhdGEoJ2l0ZW0nKVxuICAgICAgXHRcdFx0XHR2YXIgaWR4ID0gY3RybC5tb2RlbC5jbGllbnRzLmluZGV4T2YoZGF0YSlcbiAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4LCBkYXRhKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fSlcblx0fVxufSk7XG4iXX0=
