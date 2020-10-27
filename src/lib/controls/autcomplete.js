$$.control.registerControl('brainjs.autocomplete', {
    props: {
        source: []
    },

    init: function (elt) {

        const { source } = this.props

        elt.autocomplete({ source })

        this.setData = function(data) {
            //console.log('autocomplete', data)
            if (Array.isArray(data.source)) {
                elt.autocomplete('option', 'source', data.source)
            }
        }
    
    }


});