
$$.control.registerControl('brainjs.selectmenu', {
	init: function(elt) {

		elt.selectmenu()

		this.setValue = function(val) {
			elt.val(val)
			elt.selectmenu('refresh')
		}

		this.refresh = function() {
			elt.selectmenu('refresh')
		}
	},

	$events: 'selectmenuchange'
});
