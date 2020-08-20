
$$.control.registerControl('brainjs.inputphone', {
	init: function(elt) {

        elt.attr('type', 'tel')

        const cleave = new Cleave(elt.get(0), {
            phone: true,
            phoneRegionCode: 'fr'
        })

        this.getValue = function() {
            return cleave.getRawValue()
        }

        this.setValue = function(value) {
            cleave.setRawValue(value)
        }
	}
});
