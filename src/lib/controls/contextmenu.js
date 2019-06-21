$$.control.registerControl('brainjs.contextmenu', {
	props: {
		items: {},
		trigger: 'right',
		title: false,
		iconColorCls: 'w3-text-blue'
	},
	init: function(elt) {

		const {items, trigger, title, iconColorCls} = this.props

		const id = elt.attr('id')
		let className = id
		if (title !== false) {
			className += ' data-title'
		}

		$.contextMenu({
			//appendTo: elt.get(0),
			trigger,
			className,
			selector: '#' + id,
			zIndex: 1000,
			callback: function(cmd) {
				elt.trigger('contextmenuchange', {cmd})
			},
			items
		})
		$(`.${id} .context-menu-item`).removeClass('context-menu-icon')	
		if (iconColorCls !== false) {
			$(`.${id} .context-menu-item > i`).addClass(iconColorCls)	
		}

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

