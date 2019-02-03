$$.control.registerControl('brainjs.contextmenu', {
	props: {
		items: {}
	},
	init: function(elt) {

		var id = elt.attr('id')
		$.contextMenu({
			selector: '#' + id,
			callback: function(cmd) {
				elt.trigger('contextmenuchange', {cmd})
			},
			items: this.props.items
		})	
	},
	$events: 'contextmenuchange'
});

