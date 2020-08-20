
$$.control.registerControl('brainjs.inputtime', {

    props: {
        timePattern: ['h', 'm', 's']
    },
    init: function (elt) {


        const { timePattern } = this.props

        elt.attr('type', 'text')

        const cleave = new Cleave(elt.get(0), {
            time: true,
            timePattern
        })

        this.getValue = function () {
            return cleave.getRawValue()
        }

        this.setValue = function (value) {
            cleave.setRawValue(value)
        }
    }
});
