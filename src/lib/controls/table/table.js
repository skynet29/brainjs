(function() {





$$.control.registerControl('brainjs.table', {
	template: {gulp_inject: './table.html'},

	props: {
		data: [],
		columns: [],
		filters: {}
	},

	init: function(elt) {
		const ctrl = $$.viewController(elt, {
			data: {
				filters: this.props.filters,

				columns: this.props.columns.map((col) => {
					if (typeof col == 'string') {
						return {name: col, label: col}
					}
					return col
				}),

				data: this.props.data,

				getRowData: function(data, col) {
					//console.log('getRowData', data, col)
					if (col.buttons != undefined) {
						return getButtonsTemplate(col.buttons)
					}
					return data[col.name]
				},

				getButtonsTemplate: function(buttons) {
					return buttons.map((button) => {
						if (button.icon != undefined && button.title != undefined) {
							return `<button 
								data-cmd="${button.cmd}" 
								class="cmd" 
								title="${button.title}"><i class="${button.icon}"></i></button>`
						}
						if (button.icon != undefined) {
							return `<button 
								data-cmd="${button.cmd}" 
								class="cmd" 
								"><i class="${button.icon}"></i></button>`
						}
						return `<button data-cmd="${button.cmd}" class="cmd">${button.title}</button>`
					}).join('')
				},


				isInFilter: function(data) {
					var ret = true
					for(var f in filters) {
						var value = data[f]
						var filterValue = filters[f]
						ret &= (filterValue == '' || value.startsWith(filterValue))
					}
					return ret
				},				
				
				getFilteredData: function() {
					return data.filter(function(item) {
						return isInFilter(item)
					})
				}					
			},
			events: {
				onCmdClick: function(ev) {
					const cmd = $(this).data('cmd')
					const data = $(this).closest('tr').data('item')
					//console.log('onCmdClick', cmd, data)
					elt.trigger('tablecmd', {cmd, data})
				}
			}

		})

		this.setData = function(data) {
			console.log('[Table] setData', data)
			const updatedData = {}
			if ('data' in data) {
				updatedData.data = data.data
			}
			if ('filters' in data) {
				updatedData.filters = data.filters
			}
			ctrl.setData(updatedData)
		}


	},

	$iface: `setData(data)`,
	$events: `tablecmd`
})


})();
