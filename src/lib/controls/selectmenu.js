
$$.control.registerControl('brainjs.selectmenu', {

	props: {
		items: []
	},

	init: function(elt) {

		const {items} = this.props

		elt.setItems(items)
		elt.selectmenu()

		this.setValue = function(val) {
			elt.val(val)
			elt.selectmenu('refresh')
		}

		this.setData = function(data) {
			if (Array.isArray(data.items)) {
				elt.setItems(data.items)
				elt.selectmenu('refresh')
			}
		}
	},

	$events: 'selectmenuchange'
});
