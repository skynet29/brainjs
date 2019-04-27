$$.control.registerControl('brainjs.contextmenu', {
	props: {
		items: {},
		trigger: 'right',
		title: ''
	},
	init: function(elt) {

		const {items, trigger, title} = this.props

		const id = elt.attr('id')
		$.contextMenu({
			//appendTo: elt.get(0),
			trigger,
			className: 'data-title ' + id,
			selector: '#' + id,
			zIndex: 1000,
			callback: function(cmd) {
				elt.trigger('contextmenuchange', {cmd})
			},
			items
		})	

		if (title != '') {
			$('.' + id).attr('data-menutitle', title)
		}

		this.setData = function(data) {
			if ('title' in data) {
				$('.' + id).attr('data-menutitle', data.title)
			}
		}
	},
	$events: 'contextmenuchange'
});

