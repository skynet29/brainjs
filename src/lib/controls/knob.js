$$.control.registerControl('brainjs.knob', {
    props: {
        // background color
        bgColor: "#000",

        // foreground color
        fgColor: "#fff",

        // "vol" or "pan"
        type: "vol",

        // shows tooltip indicating the current value
        tooltip: true,

        // the element to apply the rotate transform to as well
        turnWith: null,

        // the maximum amount of degrees
        arc: 360,

        // the amount of values the button can hold
        steps: 100,

        // angle offset in degrees
        offset: 0,

        // min value
        min: null,

        // max value
        max: null,

        // how many pixels the mouse has to move for one rotation
        range: "auto",

        // invert the direction of rotation when moving the mouse
        invertRange: false,

        // whether or not to round the knob's value to whole integers
        round: false,

        // scales the range value when holding down shift
        fineTuneFactor: 10,

        // initial value
        value: 0,

        // the value to reset to when double-clicking the knob
        resetValue: 0,

        // CSS class prefix
        classPrefix: "knob"
    },

	init: function (elt) {
        let props = this.props

        props.value = parseFloat(elt.val()) || 0

        //console.log('[knob]props', props)

        elt.knob(props)

        this.dispose = function() {
            elt.knob('destroy')
        }

        this.setValue = function(value) {
            //console.log('setValue', value)
            elt.knob('value', value)
        }
    }

});