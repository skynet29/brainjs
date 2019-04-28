
$$.control.registerControl('brainjs.selectmenu', {
	init: function(elt) {

		elt.selectmenu()

		this.setValue = function(val) {
			elt.val(val)
			elt.selectmenu('refresh')
		}
	},

	$events: 'selectmenuchange'
});
