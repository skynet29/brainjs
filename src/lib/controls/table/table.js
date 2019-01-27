(function() {

function isInFilter(filters, data) {
	var ret = true
	for(var f in filters) {
		var value = data[f]
		var filterValue = filters[f]
		ret &= (filterValue == '' || value.startsWith(filterValue))
	}
	return ret
}

$$.control.registerControl('brainjs.table', {
	template: {gulp_inject: './table.html'},

	props: {
		data: [],
		columns: [],
		filters: {}
	},

	init: function(elt) {
		this.ctrl = $$.viewController(elt, {
			data: {
				filters: this.props.filters,
				gridColumns: this.props.columns,
				gridData: this.props.data,			
				getRowData: function() {
					return this.data[this.c]
				},
				getFilteredData: function() {
					const filters = this.filters
					return this.gridData.filter(function(item) {
						return isInFilter(filters, item)
					})
				}					
			}

		})

	}
})


})();
