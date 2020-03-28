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
				if (Object.keys(items).length == 0) {
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
						},
						activated: function(options) {
							if ($$.util.isMobileDevice()) {
								options.$menu.find('.context-menu-item')
									.css('font-size', fontSize)
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

