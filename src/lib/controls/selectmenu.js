
$$.control.registerControl('brainjs.selectmenu', {

	props: {
		items: []
	},

	init: function(elt) {

		const {items} = this.props

		console.log('value', elt.val())

		const select = $('<select>').appendTo(elt)

		select.setItems(items)
		select.val(elt.val())
		select.selectmenu().selectmenu('menuWidget').css('max-height', '200px')
		// select.on('selectmenuchange', () => {
		// 	elt.trigger('selectmenuchange')
		// })

		this.setValue = function(val) {
			//console.log('selectmenu setValue', val)
			select.val(val)
			select.selectmenu('refresh')
		}

		this.getValue = function() {
			return select.val()
		}

		this.setData = function(data) {
			//console.log('selectmenu setData', data)
			if (Array.isArray(data.items)) {
				select.setItems(data.items)
				select.selectmenu('refresh')
			}
		}
	},

	$events: 'selectmenuchange'
});
