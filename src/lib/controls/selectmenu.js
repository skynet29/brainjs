
$$.control.registerControl('brainjs.combobox', {

	props: {
		items: [],
		maxHeight: 200,
		width: false
	},

	init: function(elt) {

		const {items, maxHeight, width} = this.props

		//console.log('value', elt.val())
		//console.log('disabled', elt.prop('disabled'))*
		//elt.addClass('ui-front')

		const select = $('<select>').appendTo(elt)

		select.setItems(items)
		select.val(elt.val())
		select.css('width', '200px')
		select.css('padding', '5px')
		select.on('change', function(ev) {
			ev.stopPropagation()
			elt.trigger('comboboxchange')
		})

		select.prop('disabled', elt.prop('disabled'))

		this.setValue = function(val) {
			//console.log('selectmenu setValue', val)
			select.val(val)
		}

		this.getValue = function() {
			return select.val()
		}

		this.getSelItem = function() {
			const elt = select.get(0)
			const value = select.val()
			//console.log('value', value)
			const label = elt.options[elt.selectedIndex].text
			return {label, value}
			
		}

		this.setData = function(data) {
			//console.log('selectmenu setData', data)
			if (Array.isArray(data.items)) {
				select.setItems(data.items)
				if (data.items.length > 0) {
					if (typeof data.items[0] == 'string') {
						select.val(data.items[0])
					}
					else {
						select.val(data.items[0].value)
					}
				}
			}
		}

		this.setProp = function(data) {
			select.prop(data)
		}
	},

	$events: 'comboboxchange'
});
