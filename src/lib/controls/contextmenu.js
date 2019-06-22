$$.control.registerControl('brainjs.contextmenu', {
	props: {
		items: {},
		trigger: 'right',
		title: false,
		iconColorCls: 'w3-text-blue'
	},
	init: function(elt) {

		let {items, trigger, title, iconColorCls} = this.props

		const id = elt.attr('id')
		let className = id
		if (title !== false) {
			className += ' data-title'
		}

		const kItems = $.extend(true, {}, items)
		for(let k in items) {

			kItems[k].disabled = function() {	
				//console.log('disabled', k, items[k])	
				if (items[k].disabled == undefined)	{
					return false
				}	
				return items[k].disabled
			}
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
			items: kItems
		})
		$(`.${id} .context-menu-item`).removeClass('context-menu-icon')	

		const $i = $(`.${id} .context-menu-item > i`)
		$i.addClass('fa-fw')

		if (iconColorCls !== false) {
			$i.addClass(iconColorCls)	
		}

		if (title != '') {
			$('.' + id).attr('data-menutitle', title)
		}

		this.setData = function(data) {
			//console.log('[contextmenu] setData', data)
			if ('title' in data) {
				$('.' + id).attr('data-menutitle', data.title)
			}
			if ('items' in data) {
				items = data.items
			}
		}
	},
	$events: 'contextmenuchange'
});

