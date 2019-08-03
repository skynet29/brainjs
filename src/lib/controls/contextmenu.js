$$.control.registerControl('brainjs.contextmenu', {
	props: {
		items: {},
		trigger: 'right',
		title: false
	},
	init: function(elt) {

		let {items, trigger, title} = this.props

		const id = elt.attr('id')
		let className = id
		if (title !== false) {
			className += ' data-title'
		}

		$.contextMenu({
			//appendTo: elt.get(0),
			trigger,
			selector: '#' + id,
			build: function($trigger, ev) {
				return {
					events: {
						show: function(options) {
							//console.log('show', options)
							if (title != '') {
								$('.' + id).attr('data-menutitle', title)
							}							
						}
					},
					zIndex: 1000,
					className,
					callback: function(cmd) {
						elt.trigger('contextmenuchange', {cmd})
					},
					items					
				}
			}

		})

		this.setData = function(data) {
			//console.log('[contextmenu] setData', data)
			if ('title' in data) {
				title = data.title
			}
			if ('items' in data) {
				items = data.items
			}
		}
	},
	$events: 'contextmenuchange'
});

