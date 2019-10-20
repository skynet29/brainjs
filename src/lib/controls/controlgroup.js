
$$.control.registerControl('brainjs.controlgroup', {
	init: function(elt) {


		elt.find('button').attr('type', 'button')

		elt.controlgroup()
	}
});
