$$.control.registerControl('brainjs.table', {

	template: {gulp_inject: './table.html'},

	props: {
		data: [],
		columns: []
	},

	init: function(elt) {

		var ctrl = $$.viewController(elt, {
			data: {
				gridData: this.props.data,
				gridColumns: this.props.columns,
				getRowData: function() {
					return this.data[this.c]
				}
				
			}
		})

	}

});
