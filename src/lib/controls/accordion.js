$$.control.registerControl('brainjs.accordion', {
	props: {
        collapsible: false,
        heightStyle: 'auto'
	},

	init: function(elt) {

        elt.children('div').each(function() {
            const node = $(this)
            const title = node.attr('title')
            node.removeAttr('title')
            node.before($('<h3>').text(title))

        })
		elt.accordion(this.props)

	}


});

