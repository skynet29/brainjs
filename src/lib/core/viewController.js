(function(){

class ViewController {
    constructor(elt, options) {
    	//console.log('ViewController', options)
    	if (typeof elt == 'string') {
    		elt = $(elt)
    	}

        // if (elt.hasClass('CustomControl')) {
        //     elt = elt.children()
        // }

        this.elt = elt
    	options = $.extend({}, options)

        this.model = $.extend({}, options.data)

        const {ctx, scope, events, ctrls} = $$.binding.parse(elt.get(0),
            (name, value, excludeElt) => {
                //console.log('[ViewController] updateCbk', name, value, excludeElt)
                this.setData(name, value, excludeElt)                
            })

        this.ctx = ctx

        this.update()
        $$.binding.processCtrls(ctrls)


        if (typeof options.events == 'object') {
            $$.binding.processEvents(events, options.events)
        }


        //this.scope = $$.binding.processBindings(elt)
        this.scope = $$.binding.processBindings(scope)

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
        $$.binding.render(this.ctx, this.model, excludeElt)        

    }

    removeArrayItem(arrayBindingName, idx, varName) {
        const arrayNode = this.scope[arrayBindingName]
        if (arrayNode != undefined) {
            $$.binding.removeArrayItem(this.ctx, arrayNode.get(0), idx)
            if (typeof varName == 'string') {
                this.model[varName].splice(idx, 1)
            }
        }
    }

    updateArrayItem(arrayBindingName, idx, value, varName) {
        const arrayNode = this.scope[arrayBindingName]
        if (arrayNode != undefined) {
            $$.binding.updateArrayItem(this.ctx, arrayNode.get(0), idx, value)
            if (typeof varName == 'string') {
                this.model[varName] = value
            }
        }
    }

    insertArrayItemAfter(arrayBindingName, idx, value, varName) {
        const arrayNode = this.scope[arrayBindingName]
        if (arrayNode != undefined) {
            $$.binding.insertArrayItemAfter(this.ctx, arrayNode.get(0), idx, value)
            if (typeof varName == 'string') {
                this.model[varName].splice(idx, 0, value)
            }
        }
    }
 
    updateNode(bindingName) {
        let node = this.scope[bindingName]
        if (node != undefined) {
            node = node.get(0)
            const info = this.ctx.find((i) => i.node == node)
            $$.binding.render([info], this.model)        

        }
    }

    // forceUpdate(bindingName) {
    //     const forceElt = this.scope[bindingName]
    //     $$.binding.update(this.ctx, this.model, null, forceElt.get(0))
    // }
}

$$.viewController = function(elt, options) {
    return new ViewController(elt, options)
}


})();
