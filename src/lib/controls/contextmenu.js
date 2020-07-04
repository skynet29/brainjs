$$.control.registerControl('brainjs.contextmenu', {
	props: {
		items: {},
		trigger: 'right',
		title: '',
		fontSize: '20px'
	},
	init: function(elt) {

		let {items, trigger, title, fontSize} = this.props

		const id = elt.attr('id')


		$.contextMenu({
			//appendTo: elt.get(0),
			trigger,
			selector: '#' + id,
			build: function($trigger, ev) {
				let itemData = items

				if (typeof itemData == 'function') {
					itemData = itemData()					
				}
				if (Object.keys(itemData).length == 0) {
					return false
				}
				let className = id
				if (title !== '') {
					className += ' data-title'
				}				
				return {
					events: {
						show: function(options) {
							//console.log('show', options)
							if (title != '') {
								$('.' + id).attr('data-menutitle', title)
							}	
							$('.' + id).css('width', 'auto')
						},
						activated: function(options) {
							if ($$.util.isMobileDevice()) {
								options.$menu.find('.context-menu-item')
									.css('font-size', fontSize)
							}
							options.$menu.css('width', 'auto')
							options.$menu.css('min-width', 'auto')
						}
					},
					zIndex: 1000,
					className,
					callback: function(cmd) {
						elt.trigger('contextmenuchange', {cmd})
					},
					items: itemData					
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

