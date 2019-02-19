$$.control.registerControl('brainjs.contextmenu', {
	props: {
		items: {},
		trigger: 'right'
	},
	init: function(elt) {

		var id = elt.attr('id')
		$.contextMenu({
			trigger: this.props.trigger,
			selector: '#' + id,
			callback: function(cmd) {
				elt.trigger('contextmenuchange', {cmd})
			},
			items: this.props.items
		})	
	},
	$events: 'contextmenuchange'
});

