(function(){

class ViewController {
    constructor(elt, options) {
    	//console.log('ViewController', options)
    	if (typeof elt == 'string') {
    		elt = $(elt)
    	}

        if (elt.hasClass('CustomControl')) {
            elt = elt.children()
        }

    	options = $.extend({}, options)
        this.elt = elt

        this.model = $.extend({}, options.data)

        this.ctx = $$.binding.process(elt, this.model,
            (name, value, excludeElt) => {
                //console.log('[ViewController] updateCbk', name, value, excludeElt)
                this.setData(name, value, excludeElt)                
            })


        if (typeof options.events == 'object') {
            $$.binding.processEvents(elt, options.events)
        }


        this.scope = $$.binding.processBindings(elt)

        //console.log('scope', this.scope)
       

    } 

    setData(arg1, arg2, excludeElt) {
        //console.log('[ViewController] setData', arg1, arg2, excludeElt)
        var data = arg1
        if (typeof arg1 == 'string') {
        	data = {}
        	data[arg1] = arg2
        }
        //console.log('[ViewController] setData', data)
        $.extend(this.model, data)
        //console.log('model', this.model)
        this.update(excludeElt)
    }

    update(excludeElt) {
    	//console.log('[ViewController] update', fieldsName, excludeElt)
        $$.binding.update(this.ctx, this.model, excludeElt)

    }

    forceUpdate(bindingName) {
        const forceElt = this.scope[bindingName]
        $$.binding.update(this.ctx, this.model, null, forceElt.get(0))
    }
}

$$.viewController = function(elt, options) {
    return new ViewController(elt, options)
}


})();
