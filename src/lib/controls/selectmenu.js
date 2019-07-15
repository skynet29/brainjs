
$$.control.registerControl('brainjs.selectmenu', {

	props: {
		items: [],
		value: ''
	},

	init: function(elt) {

		const {items, value} = this.props

		const isVisible = elt.is(':visible')

		elt.setItems(items)
		elt.val(value)
		elt.selectmenu().selectmenu('menuWidget').css('max-height', '200px')
		elt.setVisible(isVisible)

		this.setValue = function(val) {
			//console.log('selectmenu setValue', val)
			elt.val(val)
			elt.selectmenu('refresh')
		}

		this.setData = function(data) {
			//console.log('selectmenu setData', data)
			if (Array.isArray(data.items)) {
				elt.setItems(data.items)
				elt.selectmenu('refresh')
			}
		}
	},

	$events: 'selectmenuchange'
});
