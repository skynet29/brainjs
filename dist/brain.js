(function(){

	window.$$ = {}
	
})();
(function(){


function getVarValue(data, varName) {
    var ret = data
    for(let f of varName.split('.')) {
      
      if (typeof ret == 'object' && f in ret) {
        ret = ret[f]
      }
      else {
        return undefined
      }
      
    }
    return ret
}

function getValue(data, varName) {

    //console.log('[Core] getValue', varName, ctx)

    var not = false
    if (varName.startsWith('!')) {
      varName = varName.substr(1)
      not = true
    }     

    var func = data[varName]
    var value

    if (typeof func == 'function') {
      value = func.call(data)
    }
    else {
      value = getVarValue(data, varName)
    }


    if (typeof value == 'boolean' && not) {
      value = !value
    }

    return value
  }



function splitAttr(attrValue, cbk) {
  attrValue.split(',').forEach(function(i) {
    let [name, value] = i.split(':')
    cbk(name.trim(), value.trim())
  })
}


const map = {
  'bn-each': {type: 3},
  'bn-text': {f: 'text', type: 1},
  'bn-html': {f: 'html', type: 1},
  'bn-val': {f: 'setValue', type: 1},
  'bn-show': {f: 'setVisible', type: 1},
  'bn-style': {f: 'css', type: 2},
  'bn-attr': {f: 'attr', type: 2},
  'bn-prop': {f: 'prop', type: 2},
  'bn-data': {f: 'setData', type: 2},
  'bn-class': {f: 'setClass', type: 2},
  'bn-control': {type: 4}
}


function update(ctx, data, vars, excludeElt) {

  //console.log('update', vars)

  if (typeof vars == 'string') {
    vars = vars.split(',')
  }

  vars.forEach(function(variable) {
    let value = getValue(data, variable)
    
    if (typeof value == 'object' && !Array.isArray(value)) {
      update(ctx, data, Object.keys(value).map(i => variable + '.' + i), excludeElt)
      return
    }
    
    if (ctx[variable]) {
      ctx[variable].forEach(function(action) {
        let {type, f, elt, name, template, iter} = action
        if (elt == excludeElt) {
          return
        }
        if (type == 1) {
           elt[f].call(elt, value)
        }
        if (type == 2) {
           elt[f].call(elt, name, value)
        }   
        if (type == 3 && Array.isArray(value)) {
            elt.empty()
            value.forEach(function(item) {
              var itemData = $.extend({}, data)
              itemData[iter] = item
              var $item = template.clone()
              process($item, itemData)
              elt.append($item)           
            })
         }
      })
    }
  })
}

function processEvents(root, events) {
  root.find(`[bn-event]`).each(function() {
      let elt = $(this)
      let attrValue = elt.attr('bn-event')
      elt.removeAttr('bn-event')
      
      splitAttr(attrValue, function(evtName, value) {
        let fn  = events[value]
        if (typeof fn == 'function') {        
          const [name, selector] = evtName.split('.')

          if (selector != undefined) {
            elt.on(name, '.' + selector, fn)
          }
          else {
            elt.on(name, fn)
          }
          
          
        }
      })
     
    })
     
}

function process(root, data, createControl) {


  let ctx = {}
  
  for(let dir in map) {
    

    root.bnFind(`[${dir}]`).each(function() {
      let elt = $(this)
      let attrValue = elt.attr(dir)
      elt.removeAttr(dir)

      let {type, f} = map[dir]
      
      if (type == 1) {
        if (data) {
          let value = getValue(data, attrValue)
          //elt.text(data[attrValue])
          elt[f].call(elt, value)
        } 
        if (dir == 'bn-val') {
          let updateEvt = elt.attr('bn-update')
          if (updateEvt) {
            elt.removeAttr('bn-update')
            elt.on(updateEvt, function() {
              root.trigger('data:update', [attrValue, elt.getValue(), elt])
            })
          }
        }
        ctx[attrValue] = ctx[attrValue] || []
        ctx[attrValue].push({f, elt, type})        
      }

      if (type == 4 && typeof createControl == 'function') {
        createControl(attrValue, elt)
      }

      if (type == 2) {

          splitAttr(attrValue, function(name, varName) {
            if (data) {
              let value = getValue(data, varName)
              elt[f].call(elt, name, value)
            }
            ctx[varName] = ctx[varName] || []
            ctx[varName].push({f, elt, type, name})  
          })
       }
       
       
      if (type == 3) {
        let template = elt.children().remove().clone()
        let [iter, , varName] = attrValue.split(' ')
        let value = getValue(data, varName)
        
        ctx[varName] = ctx[varName] || []
        ctx[varName].push({elt, type, template, iter})        
        
        if (data && Array.isArray(value)) {
          value.forEach(function(item) {
          var itemData = $.extend({}, data)
           itemData[iter] = item
           var $item = template.clone()
           process($item, itemData, createControl)
           elt.append($item)          
          })
        }
      }
    })
     
  
  }
  

  return ctx
}

function processBindings(root) {

    var data = {}

    root.bnFind('bn-bind', true, function(elt, varName) {
      //console.log('bn-text', varName)
      data[varName] = elt
    })
    root.bnFind('bn-iface', true, function(elt, varName) {
      //console.log('bn-text', varName)
      data[varName] = elt.iface()
    })
    return data
  
}

$$.binding = {
  process,
  update,
  processEvents,
  processBindings
}

})();

(function(){

let controls = {}

function isDepsOk(deps) {
	return deps.reduce(function(prev, cur) {

		return prev && (cur != undefined)
	}, true)		
}


function registerControl(name, options) {
	if (!$$.util.checkType(options, {
		$deps: ['string'],
		init: 'function'
	})) {
		console.error(`[Core] registerControl: bad options`, options)
		return
	}


	var deps = options.deps || []

	console.log(`[Core] register control '${name}' with deps`, deps)

	controls[name] = {deps, options, status: 'notloaded'}
}

function getControl(name) {
	var ret = controls[name]
	if (ret && ret.status == 'notloaded') {
		ret.deps = $$.service.getServices(ret.deps)
		ret.status = isDepsOk(ret.deps) ? 'ok' : 'ko'
	}
	return ret
}

function createControl(controlName, elt) {
	elt.addClass(controlName)
	elt.addClass('CustomControl').uniqueId()	
	var ctrl = getControl(controlName)
		
	if (ctrl == undefined) {
		throw(`[Core] control '${controlName}' is not registered`)
	}
		//console.log('createControl', controlName, ctrl)
	if (ctrl.status ===  'ok') {
		
		var iface = {
			props: {},
			name: controlName
		}

		let {init, props, template} = ctrl.options
		props = props || {}

		Object.keys(props).forEach(function(propName) {
			iface.props[propName] = elt.data(propName) || props[propName]
		})

		if (typeof template == 'string') {
			elt = $(template).appendTo(elt)
		}

		if (typeof init == 'function') {

			var args = [elt].concat(ctrl.deps)
			console.log(`[Core] instance control '${controlName}'`)
			init.apply(iface, args)

		}
		else {
			console.warn(`[Core] control '${controlName}' missing init function`)
		}


		elt.get(0).ctrl = iface
		
		return iface				
	}



}

$$.control = {
	registerControl,
	createControl
}

})();

$$.dialogController = function(options) {
	var div = $('<div>', {title: options.title || 'Dialog'})

	if (typeof options.template == 'string') {
		$(options.template).appendTo(div)
	}	

	var ctrl = $$.viewController(div, options)

	var dlgOptions = $.extend({
		autoOpen: false,
		modal: true,
		width: 'auto',		
	}, options)

	var private = {}

	//console.log('dlgOptions', dlgOptions)

	div.dialog(dlgOptions)

	ctrl.show = function(onApply) {
		private.onApply = onApply
		div.dialog('open')
	}

	ctrl.hide = function() {
		div.dialog('close')
	}

	ctrl.apply = function(retValue) {
		ctrl.hide()
		if (typeof private.onApply == 'function') {
			private.onApply(retValue)
		}
	}

	ctrl.setOption = function(optionName, value) {
		div.dialog('option', optionName, value)
	}

	return ctrl
};

$$.formDialogController = function(title, options) {
	var div = $('<div>', {title: options.title || 'Dialog'})

	var private = {}

	var form = $('<form>')
		.appendTo(div)
		.on('submit', function(ev) {
			ev.preventDefault()
			div.dialog('close')
			if (typeof private.onApply == 'function') {
				private.onApply($(this).getFormData())
			}				
		})

	if (typeof options.template == 'string') {
		$(options.template).appendTo(form)
	}	

	var submitBtn = $('<input>', {type: 'submit', hidden: true}).appendTo(form)

	var ctrl = $$.viewController(form, options)

	var dlgOptions = $.extend({
		autoOpen: false,
		modal: true,
		width: 'auto',	
		buttons: {
			'Cancel': function() {
				$(this).dialog('close')
			},
			'Apply': function() {					
				submitBtn.click()
			}
		}
	}, options)


	div.dialog(dlgOptions)

	ctrl.show = function(data, onApply) {
		private.onApply = onApply
		form.setFormData(data)
		div.dialog('open')
	}

	return ctrl
};

(function(){


$.fn.bnFind= function(selector) {
    return this.find(selector).add(this.filter(selector))
}

$.fn.setClass = function(className, isActive) {
    if (isActive) {
      this.addClass(className)
    }
    else {
      this.removeClass(className)
    }
}

$.fn.setVisible = function(isVisible) {
    if (isVisible) {
      this.show()
    }
    else {
      this.hide()
    }
}

$.fn.iface = function() {
  return this.get(0).ctrl
}

$.fn.setData = function(name, value) {
  const iface = this.iface()

  if (iface && typeof iface.setProp == 'function') {
    iface.setProp(name, value)
  }
  else {
    this.data(name, value)
  }
}

$.fn.setValue = function(value) {
  if (this.get(0).tagName == 'INPUT' && this.attr('type') == 'checkbox') {
    this.prop('checked', value)
    return
  }  
  const iface = this.iface()

  if (iface && typeof iface.setValue == 'function') {
    iface.setValue(value)
  }
  else {
    this.val(value)
  }
}

$.fn.getValue = function() {
  const type = this.attr('type')
  if (this.get(0).tagName == 'INPUT' && type == 'checkbox') {
    return this.prop('checked')
  }    
  const iface = this.iface()
  if (iface && typeof iface.getValue == 'function') {
    return iface.getValue()
  }
  var ret = this.val()

  if (type == 'number' || type == 'range') {
    ret = parseFloat(ret)
  }
  return ret
}

$.fn.getFormData = function() {
  var ret = {}
  this.find('[name]').each(function() {
    var elt = $(this)
    var name = elt.attr('name')
    ret[name] = elt.getValue()

  })

  return ret
}

$.fn.resetForm = function() {
  if (this.get(0).tagName == "FORM") {
    this.get(0).reset()
  }   
}

$.fn.setFormData = function(data) {

  //console.log('setFormData', data)
  this.resetForm()

  for(var name in data) {
    var value = data[name]
    var elt = this.find(`[name=${name}]`)
    if (elt.length) {
      elt.setValue(value)       
    }

  
  }

  return this
}

})();


(function(){

let services = {}




function getServices(deps) {
	//console.log('[Core] getServices', deps)
	return deps.map(function(depName) {
		var srv = services[depName]
		if (srv) {
			if (srv.status == 'notloaded') {
				var deps2 = getServices(srv.deps)
				var config = srv.config || {}
				console.log(`[Core] instance service '${depName}' with config`, config)
				var args = [config].concat(deps2)
				srv.obj = srv.fn.apply(null, args)
				srv.status = 'ready'
			}
			return srv.obj				
		}
		else {
			//srv.status = 'notregistered'
			throw(`[Core] service '${depName}' is not registered`)
		}

	})
}



function configureService(name, config) {
	console.log('[Core] configureService', name, config)
	if (typeof name != 'string' || typeof config != 'object') {
		console.warn('[Core] configureService called with bad arguments')
		return
	} 	

	var srv = services[name]
	if (srv) {
		srv.config = config
	}
	else {
		throw(`[configureService] service '${name}' is not registered`)
	}

}

function registerService(name, arg1, arg2) {
	var deps = []
	var fn = arg1
	if (Array.isArray(arg1)) {
		deps = arg1
		fn = arg2
	}
	if (typeof name != 'string' || typeof fn == 'undefined' || !Array.isArray(deps)) {
		throw('[Core] registerService called with bad arguments')
	} 
	console.log(`[Core] register service '${name}' with deps`, deps)

	services[name] = {deps, fn, status: 'notloaded'}
}

$$.service = {
	registerService,
	configureService,
	getServices
}

})();

(function() {


function readTextFile(fileName, onRead) {
	var fileReader = new FileReader()

	fileReader.onload = function() {
		if (typeof onRead == 'function') {
			onRead(fileReader.result)
		}
	}
	fileReader.readAsText(fileName)
}


function readFileAsDataURL(fileName, onRead) {
	var fileReader = new FileReader()

	fileReader.onload = function() {
		if (typeof onRead == 'function') {
			onRead(fileReader.result)
		}
	}
	fileReader.readAsDataURL(fileName)
}


var inputFile = $('<input>', {type: 'file'}).on('change', function() {
	var onApply = $(this).data('onApply')
	var fileName = this.files[0]
	if (typeof onApply == 'function') {
		onApply(fileName)
	}
})

function openFileDialog(onApply) {
	inputFile.data('onApply', onApply)
	inputFile.click()
}

function isImage(fileName) {
	return (/\.(gif|jpg|jpeg|png)$/i).test(fileName)
}

function dataURLtoBlob(dataURL) {
  // Decode the dataURL
  const [ , mimeType, encodage, data] = dataURL.split(/[:,;]/)
  if (encodage != 'base64') {
  	return
  }

  //console.log('mimeType', mimeType)
  //console.log('encodage', encodage)
  //console.log('data', data)

  var binary = atob(data)
 // Create 8-bit unsigned array
  var array = []
  for(var i = 0; i < binary.length; i++) {
  	array.push(binary.charCodeAt(i))
  }

  // Return our Blob object
	return new Blob([ new Uint8Array(array) ], {mimeType})
}

function loadStyle(styleFilePath, callback) {	
	//console.log('[Core] loadStyle', styleFilePath)

	$(function() {
		var cssOk = $('head').find(`link[href="${styleFilePath}"]`).length
		if (cssOk != 1) {
			console.log(`loading '${styleFilePath}' style`)
			$('<link>', {href: styleFilePath, rel: 'stylesheet'})
			.on('load', function() {
				console.log(`'${styleFilePath}' loaded`)
				if (typeof callback == 'function') {
					callback()
				}
			})
			.appendTo($('head'))
		}
	})
}



	
function isObject(a) {
	return (typeof a == 'object') && !Array.isArray(a)
}

function checkType(value, type, isOptional) {
	//console.log('checkType',value, type, isOptional)
	if (typeof value == 'undefined' && isOptional === true) {
		return true
	}

	if (typeof type == 'string') {
		return typeof value == type
	}

	if (Array.isArray(value)) {
		if (!Array.isArray(type)) {
			return false
		}

		if (type.length == 0) {
			return true // no item type checking
		}
		for(let i of value) {
			var ret = false
			for(let t of type) {
				ret |= checkType(i, t)
			}
			if (!ret) {
				return false
			}
		}

		return true
	}

	if (isObject(type)) {
		if (!isObject(value)) {
			return false
		}
		for(let f in type) {

			//console.log('f', f, 'value', value)
			var newType = type[f]

			var isOptional = false
			if (f.startsWith('$')) {
				f = f.substr(1)
				isOptional = true
			}
			if (!checkType(value[f], newType, isOptional)) {
				return false
			}

		}

		return true
	}
	return false
}	



$$.util = {
	readTextFile,
	readFileAsDataURL,
	openFileDialog,
	isImage,
	dataURLtoBlob,
	loadStyle,
	checkType
}


})();

(function(){

class ViewController {
    constructor(elt, options) {
    	//console.log('ViewController', options)
    	if (typeof elt == 'string') {
    		elt = $(elt)
    	}

    	options = $.extend({}, options)
        this.elt = elt

        elt.on('data:update', (ev, name, value, excludeElt) => {
        	//console.log('[ViewController] data:change', name, value)
        	this.setData(name, value, excludeElt)
        })

        this.model = $.extend({}, options.data)
        this.rules = $.extend({}, options.rules)
        this.watches = $.extend({}, options.watches)

        // generate automatic rules for computed data (aka function)
        for(var k in this.model) {
        	var data = this.model[k]
        	if (typeof data == 'function') {
        		var funcText = data.toString()
        		//console.log('funcText', funcText)
        		var rules = []
        		funcText.replace(/this.([a-zA-Z0-9_-]{1,})/g, function(match, captureOne) {
        			//console.log('captureOne', captureOne)
        			rules.push(captureOne)
        		})
        		this.rules[k] = rules.toString()
        	}
        }

        //console.log('rules', this.rules)
        this.ctx = $$.binding.process(elt, this.model, $$.control.createControl)


        if (typeof options.events == 'object') {
            $$.binding.processEvents(elt, options.events)
        }

        this.scope = $$.binding.processBindings(elt)
        //console.log('scope', this.scope)
       

    } 

    setData(arg1, arg2, excludeElt) {
        //console.log('[ViewController] setData', arg1, arg2)
        var data = arg1
        if (typeof arg1 == 'string') {
        	data = {}
        	data[arg1] = arg2
        }
        //console.log('[ViewController] setData', data)
        $.extend(this.model, data)
        //console.log('model', this.model)
        this.update(Object.keys(data), excludeElt)
    }

    update(fieldsName, excludeElt) {
    	//console.log('[ViewController] update', fieldsName)
    	if (typeof fieldsName == 'string') {
    		fieldsName = fieldsName.split(',')
    	}


    	if (Array.isArray(fieldsName)) {
    		var fieldsSet = {}
    		fieldsName.forEach((field) => {

    			var watch = this.watches[field]
    			if (typeof watch == 'function') {
    				watch.call(null, this.model[field])
    			}
    			fieldsSet[field] = 1

    			for(var rule in this.rules) {
    				if (this.rules[rule].split(',').indexOf(field) != -1) {
    					fieldsSet[rule] = 1
    				}
    			}
    		})


    		$$.binding.update(this.ctx, this.model, Object.keys(fieldsSet), excludeElt)
    	}

    }
}

$$.viewController = function(elt, options) {
    return new ViewController(elt, options)
}


})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwibGliL2JpbmRpbmcuanMiLCJsaWIvY29udHJvbC5qcyIsImxpYi9kaWFsb2dDb250cm9sbGVyIC5qcyIsImxpYi9mb3JtRGlhbG9nQ29udHJvbGxlci5qcyIsImxpYi9qcXVlcnktZXh0LmpzIiwibGliL3NlcnZpY2UuanMiLCJsaWIvdXRpbC5qcyIsImxpYi92aWV3Q29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJicmFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG5cclxuXHR3aW5kb3cuJCQgPSB7fVxyXG5cdFxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFZhclZhbHVlKGRhdGEsIHZhck5hbWUpIHtcclxuICAgIHZhciByZXQgPSBkYXRhXHJcbiAgICBmb3IobGV0IGYgb2YgdmFyTmFtZS5zcGxpdCgnLicpKSB7XHJcbiAgICAgIFxyXG4gICAgICBpZiAodHlwZW9mIHJldCA9PSAnb2JqZWN0JyAmJiBmIGluIHJldCkge1xyXG4gICAgICAgIHJldCA9IHJldFtmXVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH1cclxuICAgIHJldHVybiByZXRcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VmFsdWUoZGF0YSwgdmFyTmFtZSkge1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ1tDb3JlXSBnZXRWYWx1ZScsIHZhck5hbWUsIGN0eClcclxuXHJcbiAgICB2YXIgbm90ID0gZmFsc2VcclxuICAgIGlmICh2YXJOYW1lLnN0YXJ0c1dpdGgoJyEnKSkge1xyXG4gICAgICB2YXJOYW1lID0gdmFyTmFtZS5zdWJzdHIoMSlcclxuICAgICAgbm90ID0gdHJ1ZVxyXG4gICAgfSAgICAgXHJcblxyXG4gICAgdmFyIGZ1bmMgPSBkYXRhW3Zhck5hbWVdXHJcbiAgICB2YXIgdmFsdWVcclxuXHJcbiAgICBpZiAodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICB2YWx1ZSA9IGZ1bmMuY2FsbChkYXRhKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZhbHVlID0gZ2V0VmFyVmFsdWUoZGF0YSwgdmFyTmFtZSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnYm9vbGVhbicgJiYgbm90KSB7XHJcbiAgICAgIHZhbHVlID0gIXZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlXHJcbiAgfVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzcGxpdEF0dHIoYXR0clZhbHVlLCBjYmspIHtcclxuICBhdHRyVmFsdWUuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcclxuICAgIGxldCBbbmFtZSwgdmFsdWVdID0gaS5zcGxpdCgnOicpXHJcbiAgICBjYmsobmFtZS50cmltKCksIHZhbHVlLnRyaW0oKSlcclxuICB9KVxyXG59XHJcblxyXG5cclxuY29uc3QgbWFwID0ge1xyXG4gICdibi1lYWNoJzoge3R5cGU6IDN9LFxyXG4gICdibi10ZXh0Jzoge2Y6ICd0ZXh0JywgdHlwZTogMX0sXHJcbiAgJ2JuLWh0bWwnOiB7ZjogJ2h0bWwnLCB0eXBlOiAxfSxcclxuICAnYm4tdmFsJzoge2Y6ICdzZXRWYWx1ZScsIHR5cGU6IDF9LFxyXG4gICdibi1zaG93Jzoge2Y6ICdzZXRWaXNpYmxlJywgdHlwZTogMX0sXHJcbiAgJ2JuLXN0eWxlJzoge2Y6ICdjc3MnLCB0eXBlOiAyfSxcclxuICAnYm4tYXR0cic6IHtmOiAnYXR0cicsIHR5cGU6IDJ9LFxyXG4gICdibi1wcm9wJzoge2Y6ICdwcm9wJywgdHlwZTogMn0sXHJcbiAgJ2JuLWRhdGEnOiB7ZjogJ3NldERhdGEnLCB0eXBlOiAyfSxcclxuICAnYm4tY2xhc3MnOiB7ZjogJ3NldENsYXNzJywgdHlwZTogMn0sXHJcbiAgJ2JuLWNvbnRyb2wnOiB7dHlwZTogNH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZShjdHgsIGRhdGEsIHZhcnMsIGV4Y2x1ZGVFbHQpIHtcclxuXHJcbiAgLy9jb25zb2xlLmxvZygndXBkYXRlJywgdmFycylcclxuXHJcbiAgaWYgKHR5cGVvZiB2YXJzID09ICdzdHJpbmcnKSB7XHJcbiAgICB2YXJzID0gdmFycy5zcGxpdCgnLCcpXHJcbiAgfVxyXG5cclxuICB2YXJzLmZvckVhY2goZnVuY3Rpb24odmFyaWFibGUpIHtcclxuICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIHZhcmlhYmxlKVxyXG4gICAgXHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICB1cGRhdGUoY3R4LCBkYXRhLCBPYmplY3Qua2V5cyh2YWx1ZSkubWFwKGkgPT4gdmFyaWFibGUgKyAnLicgKyBpKSwgZXhjbHVkZUVsdClcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChjdHhbdmFyaWFibGVdKSB7XHJcbiAgICAgIGN0eFt2YXJpYWJsZV0uZm9yRWFjaChmdW5jdGlvbihhY3Rpb24pIHtcclxuICAgICAgICBsZXQge3R5cGUsIGYsIGVsdCwgbmFtZSwgdGVtcGxhdGUsIGl0ZXJ9ID0gYWN0aW9uXHJcbiAgICAgICAgaWYgKGVsdCA9PSBleGNsdWRlRWx0KSB7XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMSkge1xyXG4gICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgdmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlID09IDIpIHtcclxuICAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIG5hbWUsIHZhbHVlKVxyXG4gICAgICAgIH0gICBcclxuICAgICAgICBpZiAodHlwZSA9PSAzICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGVsdC5lbXB0eSgpXHJcbiAgICAgICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgIHZhciBpdGVtRGF0YSA9ICQuZXh0ZW5kKHt9LCBkYXRhKVxyXG4gICAgICAgICAgICAgIGl0ZW1EYXRhW2l0ZXJdID0gaXRlbVxyXG4gICAgICAgICAgICAgIHZhciAkaXRlbSA9IHRlbXBsYXRlLmNsb25lKClcclxuICAgICAgICAgICAgICBwcm9jZXNzKCRpdGVtLCBpdGVtRGF0YSlcclxuICAgICAgICAgICAgICBlbHQuYXBwZW5kKCRpdGVtKSAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzRXZlbnRzKHJvb3QsIGV2ZW50cykge1xyXG4gIHJvb3QuZmluZChgW2JuLWV2ZW50XWApLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBlbHQgPSAkKHRoaXMpXHJcbiAgICAgIGxldCBhdHRyVmFsdWUgPSBlbHQuYXR0cignYm4tZXZlbnQnKVxyXG4gICAgICBlbHQucmVtb3ZlQXR0cignYm4tZXZlbnQnKVxyXG4gICAgICBcclxuICAgICAgc3BsaXRBdHRyKGF0dHJWYWx1ZSwgZnVuY3Rpb24oZXZ0TmFtZSwgdmFsdWUpIHtcclxuICAgICAgICBsZXQgZm4gID0gZXZlbnRzW3ZhbHVlXVxyXG4gICAgICAgIGlmICh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJykgeyAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBbbmFtZSwgc2VsZWN0b3JdID0gZXZ0TmFtZS5zcGxpdCgnLicpXHJcblxyXG4gICAgICAgICAgaWYgKHNlbGVjdG9yICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbHQub24obmFtZSwgJy4nICsgc2VsZWN0b3IsIGZuKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVsdC5vbihuYW1lLCBmbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgIFxyXG4gICAgfSlcclxuICAgICBcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzcyhyb290LCBkYXRhLCBjcmVhdGVDb250cm9sKSB7XHJcblxyXG5cclxuICBsZXQgY3R4ID0ge31cclxuICBcclxuICBmb3IobGV0IGRpciBpbiBtYXApIHtcclxuICAgIFxyXG5cclxuICAgIHJvb3QuYm5GaW5kKGBbJHtkaXJ9XWApLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBlbHQgPSAkKHRoaXMpXHJcbiAgICAgIGxldCBhdHRyVmFsdWUgPSBlbHQuYXR0cihkaXIpXHJcbiAgICAgIGVsdC5yZW1vdmVBdHRyKGRpcilcclxuXHJcbiAgICAgIGxldCB7dHlwZSwgZn0gPSBtYXBbZGlyXVxyXG4gICAgICBcclxuICAgICAgaWYgKHR5cGUgPT0gMSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCBhdHRyVmFsdWUpXHJcbiAgICAgICAgICAvL2VsdC50ZXh0KGRhdGFbYXR0clZhbHVlXSlcclxuICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgdmFsdWUpXHJcbiAgICAgICAgfSBcclxuICAgICAgICBpZiAoZGlyID09ICdibi12YWwnKSB7XHJcbiAgICAgICAgICBsZXQgdXBkYXRlRXZ0ID0gZWx0LmF0dHIoJ2JuLXVwZGF0ZScpXHJcbiAgICAgICAgICBpZiAodXBkYXRlRXZ0KSB7XHJcbiAgICAgICAgICAgIGVsdC5yZW1vdmVBdHRyKCdibi11cGRhdGUnKVxyXG4gICAgICAgICAgICBlbHQub24odXBkYXRlRXZ0LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICByb290LnRyaWdnZXIoJ2RhdGE6dXBkYXRlJywgW2F0dHJWYWx1ZSwgZWx0LmdldFZhbHVlKCksIGVsdF0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eFthdHRyVmFsdWVdID0gY3R4W2F0dHJWYWx1ZV0gfHwgW11cclxuICAgICAgICBjdHhbYXR0clZhbHVlXS5wdXNoKHtmLCBlbHQsIHR5cGV9KSAgICAgICAgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlID09IDQgJiYgdHlwZW9mIGNyZWF0ZUNvbnRyb2wgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGNyZWF0ZUNvbnRyb2woYXR0clZhbHVlLCBlbHQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlID09IDIpIHtcclxuXHJcbiAgICAgICAgICBzcGxpdEF0dHIoYXR0clZhbHVlLCBmdW5jdGlvbihuYW1lLCB2YXJOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyTmFtZSlcclxuICAgICAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIG5hbWUsIHZhbHVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eFt2YXJOYW1lXSA9IGN0eFt2YXJOYW1lXSB8fCBbXVxyXG4gICAgICAgICAgICBjdHhbdmFyTmFtZV0ucHVzaCh7ZiwgZWx0LCB0eXBlLCBuYW1lfSkgIFxyXG4gICAgICAgICAgfSlcclxuICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgIGlmICh0eXBlID09IDMpIHtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSBlbHQuY2hpbGRyZW4oKS5yZW1vdmUoKS5jbG9uZSgpXHJcbiAgICAgICAgbGV0IFtpdGVyLCAsIHZhck5hbWVdID0gYXR0clZhbHVlLnNwbGl0KCcgJylcclxuICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eFt2YXJOYW1lXSA9IGN0eFt2YXJOYW1lXSB8fCBbXVxyXG4gICAgICAgIGN0eFt2YXJOYW1lXS5wdXNoKHtlbHQsIHR5cGUsIHRlbXBsYXRlLCBpdGVyfSkgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChkYXRhICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgIHZhciBpdGVtRGF0YSA9ICQuZXh0ZW5kKHt9LCBkYXRhKVxyXG4gICAgICAgICAgIGl0ZW1EYXRhW2l0ZXJdID0gaXRlbVxyXG4gICAgICAgICAgIHZhciAkaXRlbSA9IHRlbXBsYXRlLmNsb25lKClcclxuICAgICAgICAgICBwcm9jZXNzKCRpdGVtLCBpdGVtRGF0YSwgY3JlYXRlQ29udHJvbClcclxuICAgICAgICAgICBlbHQuYXBwZW5kKCRpdGVtKSAgICAgICAgICBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgIFxyXG4gIFxyXG4gIH1cclxuICBcclxuXHJcbiAgcmV0dXJuIGN0eFxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzQmluZGluZ3Mocm9vdCkge1xyXG5cclxuICAgIHZhciBkYXRhID0ge31cclxuXHJcbiAgICByb290LmJuRmluZCgnYm4tYmluZCcsIHRydWUsIGZ1bmN0aW9uKGVsdCwgdmFyTmFtZSkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdibi10ZXh0JywgdmFyTmFtZSlcclxuICAgICAgZGF0YVt2YXJOYW1lXSA9IGVsdFxyXG4gICAgfSlcclxuICAgIHJvb3QuYm5GaW5kKCdibi1pZmFjZScsIHRydWUsIGZ1bmN0aW9uKGVsdCwgdmFyTmFtZSkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdibi10ZXh0JywgdmFyTmFtZSlcclxuICAgICAgZGF0YVt2YXJOYW1lXSA9IGVsdC5pZmFjZSgpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGRhdGFcclxuICBcclxufVxyXG5cclxuJCQuYmluZGluZyA9IHtcclxuICBwcm9jZXNzLFxyXG4gIHVwZGF0ZSxcclxuICBwcm9jZXNzRXZlbnRzLFxyXG4gIHByb2Nlc3NCaW5kaW5nc1xyXG59XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcbmxldCBjb250cm9scyA9IHt9XHJcblxyXG5mdW5jdGlvbiBpc0RlcHNPayhkZXBzKSB7XHJcblx0cmV0dXJuIGRlcHMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xyXG5cclxuXHRcdHJldHVybiBwcmV2ICYmIChjdXIgIT0gdW5kZWZpbmVkKVxyXG5cdH0sIHRydWUpXHRcdFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb250cm9sKG5hbWUsIG9wdGlvbnMpIHtcclxuXHRpZiAoISQkLnV0aWwuY2hlY2tUeXBlKG9wdGlvbnMsIHtcclxuXHRcdCRkZXBzOiBbJ3N0cmluZyddLFxyXG5cdFx0aW5pdDogJ2Z1bmN0aW9uJ1xyXG5cdH0pKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKGBbQ29yZV0gcmVnaXN0ZXJDb250cm9sOiBiYWQgb3B0aW9uc2AsIG9wdGlvbnMpXHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cclxuXHR2YXIgZGVwcyA9IG9wdGlvbnMuZGVwcyB8fCBbXVxyXG5cclxuXHRjb25zb2xlLmxvZyhgW0NvcmVdIHJlZ2lzdGVyIGNvbnRyb2wgJyR7bmFtZX0nIHdpdGggZGVwc2AsIGRlcHMpXHJcblxyXG5cdGNvbnRyb2xzW25hbWVdID0ge2RlcHMsIG9wdGlvbnMsIHN0YXR1czogJ25vdGxvYWRlZCd9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvbnRyb2wobmFtZSkge1xyXG5cdHZhciByZXQgPSBjb250cm9sc1tuYW1lXVxyXG5cdGlmIChyZXQgJiYgcmV0LnN0YXR1cyA9PSAnbm90bG9hZGVkJykge1xyXG5cdFx0cmV0LmRlcHMgPSAkJC5zZXJ2aWNlLmdldFNlcnZpY2VzKHJldC5kZXBzKVxyXG5cdFx0cmV0LnN0YXR1cyA9IGlzRGVwc09rKHJldC5kZXBzKSA/ICdvaycgOiAna28nXHJcblx0fVxyXG5cdHJldHVybiByZXRcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ29udHJvbChjb250cm9sTmFtZSwgZWx0KSB7XHJcblx0ZWx0LmFkZENsYXNzKGNvbnRyb2xOYW1lKVxyXG5cdGVsdC5hZGRDbGFzcygnQ3VzdG9tQ29udHJvbCcpLnVuaXF1ZUlkKClcdFxyXG5cdHZhciBjdHJsID0gZ2V0Q29udHJvbChjb250cm9sTmFtZSlcclxuXHRcdFxyXG5cdGlmIChjdHJsID09IHVuZGVmaW5lZCkge1xyXG5cdFx0dGhyb3coYFtDb3JlXSBjb250cm9sICcke2NvbnRyb2xOYW1lfScgaXMgbm90IHJlZ2lzdGVyZWRgKVxyXG5cdH1cclxuXHRcdC8vY29uc29sZS5sb2coJ2NyZWF0ZUNvbnRyb2wnLCBjb250cm9sTmFtZSwgY3RybClcclxuXHRpZiAoY3RybC5zdGF0dXMgPT09ICAnb2snKSB7XHJcblx0XHRcclxuXHRcdHZhciBpZmFjZSA9IHtcclxuXHRcdFx0cHJvcHM6IHt9LFxyXG5cdFx0XHRuYW1lOiBjb250cm9sTmFtZVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB7aW5pdCwgcHJvcHMsIHRlbXBsYXRlfSA9IGN0cmwub3B0aW9uc1xyXG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fVxyXG5cclxuXHRcdE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BOYW1lKSB7XHJcblx0XHRcdGlmYWNlLnByb3BzW3Byb3BOYW1lXSA9IGVsdC5kYXRhKHByb3BOYW1lKSB8fCBwcm9wc1twcm9wTmFtZV1cclxuXHRcdH0pXHJcblxyXG5cdFx0aWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRlbHQgPSAkKHRlbXBsYXRlKS5hcHBlbmRUbyhlbHQpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBpbml0ID09ICdmdW5jdGlvbicpIHtcclxuXHJcblx0XHRcdHZhciBhcmdzID0gW2VsdF0uY29uY2F0KGN0cmwuZGVwcylcclxuXHRcdFx0Y29uc29sZS5sb2coYFtDb3JlXSBpbnN0YW5jZSBjb250cm9sICcke2NvbnRyb2xOYW1lfSdgKVxyXG5cdFx0XHRpbml0LmFwcGx5KGlmYWNlLCBhcmdzKVxyXG5cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oYFtDb3JlXSBjb250cm9sICcke2NvbnRyb2xOYW1lfScgbWlzc2luZyBpbml0IGZ1bmN0aW9uYClcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZWx0LmdldCgwKS5jdHJsID0gaWZhY2VcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGlmYWNlXHRcdFx0XHRcclxuXHR9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiQkLmNvbnRyb2wgPSB7XHJcblx0cmVnaXN0ZXJDb250cm9sLFxyXG5cdGNyZWF0ZUNvbnRyb2xcclxufVxyXG5cclxufSkoKTtcclxuIiwiJCQuZGlhbG9nQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgZGl2ID0gJCgnPGRpdj4nLCB7dGl0bGU6IG9wdGlvbnMudGl0bGUgfHwgJ0RpYWxvZyd9KVxyXG5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMudGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdCQob3B0aW9ucy50ZW1wbGF0ZSkuYXBwZW5kVG8oZGl2KVxyXG5cdH1cdFxyXG5cclxuXHR2YXIgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGRpdiwgb3B0aW9ucylcclxuXHJcblx0dmFyIGRsZ09wdGlvbnMgPSAkLmV4dGVuZCh7XHJcblx0XHRhdXRvT3BlbjogZmFsc2UsXHJcblx0XHRtb2RhbDogdHJ1ZSxcclxuXHRcdHdpZHRoOiAnYXV0bycsXHRcdFxyXG5cdH0sIG9wdGlvbnMpXHJcblxyXG5cdHZhciBwcml2YXRlID0ge31cclxuXHJcblx0Ly9jb25zb2xlLmxvZygnZGxnT3B0aW9ucycsIGRsZ09wdGlvbnMpXHJcblxyXG5cdGRpdi5kaWFsb2coZGxnT3B0aW9ucylcclxuXHJcblx0Y3RybC5zaG93ID0gZnVuY3Rpb24ob25BcHBseSkge1xyXG5cdFx0cHJpdmF0ZS5vbkFwcGx5ID0gb25BcHBseVxyXG5cdFx0ZGl2LmRpYWxvZygnb3BlbicpXHJcblx0fVxyXG5cclxuXHRjdHJsLmhpZGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdGRpdi5kaWFsb2coJ2Nsb3NlJylcclxuXHR9XHJcblxyXG5cdGN0cmwuYXBwbHkgPSBmdW5jdGlvbihyZXRWYWx1ZSkge1xyXG5cdFx0Y3RybC5oaWRlKClcclxuXHRcdGlmICh0eXBlb2YgcHJpdmF0ZS5vbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0cHJpdmF0ZS5vbkFwcGx5KHJldFZhbHVlKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y3RybC5zZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb25OYW1lLCB2YWx1ZSkge1xyXG5cdFx0ZGl2LmRpYWxvZygnb3B0aW9uJywgb3B0aW9uTmFtZSwgdmFsdWUpXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gY3RybFxyXG59O1xyXG4iLCIkJC5mb3JtRGlhbG9nQ29udHJvbGxlciA9IGZ1bmN0aW9uKHRpdGxlLCBvcHRpb25zKSB7XHJcblx0dmFyIGRpdiA9ICQoJzxkaXY+Jywge3RpdGxlOiBvcHRpb25zLnRpdGxlIHx8ICdEaWFsb2cnfSlcclxuXHJcblx0dmFyIHByaXZhdGUgPSB7fVxyXG5cclxuXHR2YXIgZm9ybSA9ICQoJzxmb3JtPicpXHJcblx0XHQuYXBwZW5kVG8oZGl2KVxyXG5cdFx0Lm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldikge1xyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdGRpdi5kaWFsb2coJ2Nsb3NlJylcclxuXHRcdFx0aWYgKHR5cGVvZiBwcml2YXRlLm9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdHByaXZhdGUub25BcHBseSgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXHJcblx0XHRcdH1cdFx0XHRcdFxyXG5cdFx0fSlcclxuXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnRlbXBsYXRlID09ICdzdHJpbmcnKSB7XHJcblx0XHQkKG9wdGlvbnMudGVtcGxhdGUpLmFwcGVuZFRvKGZvcm0pXHJcblx0fVx0XHJcblxyXG5cdHZhciBzdWJtaXRCdG4gPSAkKCc8aW5wdXQ+Jywge3R5cGU6ICdzdWJtaXQnLCBoaWRkZW46IHRydWV9KS5hcHBlbmRUbyhmb3JtKVxyXG5cclxuXHR2YXIgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGZvcm0sIG9wdGlvbnMpXHJcblxyXG5cdHZhciBkbGdPcHRpb25zID0gJC5leHRlbmQoe1xyXG5cdFx0YXV0b09wZW46IGZhbHNlLFxyXG5cdFx0bW9kYWw6IHRydWUsXHJcblx0XHR3aWR0aDogJ2F1dG8nLFx0XHJcblx0XHRidXR0b25zOiB7XHJcblx0XHRcdCdDYW5jZWwnOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKHRoaXMpLmRpYWxvZygnY2xvc2UnKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnQXBwbHknOiBmdW5jdGlvbigpIHtcdFx0XHRcdFx0XHJcblx0XHRcdFx0c3VibWl0QnRuLmNsaWNrKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sIG9wdGlvbnMpXHJcblxyXG5cclxuXHRkaXYuZGlhbG9nKGRsZ09wdGlvbnMpXHJcblxyXG5cdGN0cmwuc2hvdyA9IGZ1bmN0aW9uKGRhdGEsIG9uQXBwbHkpIHtcclxuXHRcdHByaXZhdGUub25BcHBseSA9IG9uQXBwbHlcclxuXHRcdGZvcm0uc2V0Rm9ybURhdGEoZGF0YSlcclxuXHRcdGRpdi5kaWFsb2coJ29wZW4nKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGN0cmxcclxufTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuJC5mbi5ibkZpbmQ9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICByZXR1cm4gdGhpcy5maW5kKHNlbGVjdG9yKS5hZGQodGhpcy5maWx0ZXIoc2VsZWN0b3IpKVxyXG59XHJcblxyXG4kLmZuLnNldENsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpc0FjdGl2ZSkge1xyXG4gICAgaWYgKGlzQWN0aXZlKSB7XHJcbiAgICAgIHRoaXMuYWRkQ2xhc3MoY2xhc3NOYW1lKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKVxyXG4gICAgfVxyXG59XHJcblxyXG4kLmZuLnNldFZpc2libGUgPSBmdW5jdGlvbihpc1Zpc2libGUpIHtcclxuICAgIGlmIChpc1Zpc2libGUpIHtcclxuICAgICAgdGhpcy5zaG93KClcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmhpZGUoKVxyXG4gICAgfVxyXG59XHJcblxyXG4kLmZuLmlmYWNlID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuZ2V0KDApLmN0cmxcclxufVxyXG5cclxuJC5mbi5zZXREYXRhID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG5cclxuICBpZiAoaWZhY2UgJiYgdHlwZW9mIGlmYWNlLnNldFByb3AgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgaWZhY2Uuc2V0UHJvcChuYW1lLCB2YWx1ZSlcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmRhdGEobmFtZSwgdmFsdWUpXHJcbiAgfVxyXG59XHJcblxyXG4kLmZuLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICBpZiAodGhpcy5nZXQoMCkudGFnTmFtZSA9PSAnSU5QVVQnICYmIHRoaXMuYXR0cigndHlwZScpID09ICdjaGVja2JveCcpIHtcclxuICAgIHRoaXMucHJvcCgnY2hlY2tlZCcsIHZhbHVlKVxyXG4gICAgcmV0dXJuXHJcbiAgfSAgXHJcbiAgY29uc3QgaWZhY2UgPSB0aGlzLmlmYWNlKClcclxuXHJcbiAgaWYgKGlmYWNlICYmIHR5cGVvZiBpZmFjZS5zZXRWYWx1ZSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBpZmFjZS5zZXRWYWx1ZSh2YWx1ZSlcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLnZhbCh2YWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbiQuZm4uZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICBjb25zdCB0eXBlID0gdGhpcy5hdHRyKCd0eXBlJylcclxuICBpZiAodGhpcy5nZXQoMCkudGFnTmFtZSA9PSAnSU5QVVQnICYmIHR5cGUgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvcCgnY2hlY2tlZCcpXHJcbiAgfSAgICBcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG4gIGlmIChpZmFjZSAmJiB0eXBlb2YgaWZhY2UuZ2V0VmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgcmV0dXJuIGlmYWNlLmdldFZhbHVlKClcclxuICB9XHJcbiAgdmFyIHJldCA9IHRoaXMudmFsKClcclxuXHJcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAncmFuZ2UnKSB7XHJcbiAgICByZXQgPSBwYXJzZUZsb2F0KHJldClcclxuICB9XHJcbiAgcmV0dXJuIHJldFxyXG59XHJcblxyXG4kLmZuLmdldEZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHJldCA9IHt9XHJcbiAgdGhpcy5maW5kKCdbbmFtZV0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGVsdCA9ICQodGhpcylcclxuICAgIHZhciBuYW1lID0gZWx0LmF0dHIoJ25hbWUnKVxyXG4gICAgcmV0W25hbWVdID0gZWx0LmdldFZhbHVlKClcclxuXHJcbiAgfSlcclxuXHJcbiAgcmV0dXJuIHJldFxyXG59XHJcblxyXG4kLmZuLnJlc2V0Rm9ybSA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09IFwiRk9STVwiKSB7XHJcbiAgICB0aGlzLmdldCgwKS5yZXNldCgpXHJcbiAgfSAgIFxyXG59XHJcblxyXG4kLmZuLnNldEZvcm1EYXRhID0gZnVuY3Rpb24oZGF0YSkge1xyXG5cclxuICAvL2NvbnNvbGUubG9nKCdzZXRGb3JtRGF0YScsIGRhdGEpXHJcbiAgdGhpcy5yZXNldEZvcm0oKVxyXG5cclxuICBmb3IodmFyIG5hbWUgaW4gZGF0YSkge1xyXG4gICAgdmFyIHZhbHVlID0gZGF0YVtuYW1lXVxyXG4gICAgdmFyIGVsdCA9IHRoaXMuZmluZChgW25hbWU9JHtuYW1lfV1gKVxyXG4gICAgaWYgKGVsdC5sZW5ndGgpIHtcclxuICAgICAgZWx0LnNldFZhbHVlKHZhbHVlKSAgICAgICBcclxuICAgIH1cclxuXHJcbiAgXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG59KSgpO1xyXG4iLCJcclxuKGZ1bmN0aW9uKCl7XHJcblxyXG5sZXQgc2VydmljZXMgPSB7fVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0U2VydmljZXMoZGVwcykge1xyXG5cdC8vY29uc29sZS5sb2coJ1tDb3JlXSBnZXRTZXJ2aWNlcycsIGRlcHMpXHJcblx0cmV0dXJuIGRlcHMubWFwKGZ1bmN0aW9uKGRlcE5hbWUpIHtcclxuXHRcdHZhciBzcnYgPSBzZXJ2aWNlc1tkZXBOYW1lXVxyXG5cdFx0aWYgKHNydikge1xyXG5cdFx0XHRpZiAoc3J2LnN0YXR1cyA9PSAnbm90bG9hZGVkJykge1xyXG5cdFx0XHRcdHZhciBkZXBzMiA9IGdldFNlcnZpY2VzKHNydi5kZXBzKVxyXG5cdFx0XHRcdHZhciBjb25maWcgPSBzcnYuY29uZmlnIHx8IHt9XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYFtDb3JlXSBpbnN0YW5jZSBzZXJ2aWNlICcke2RlcE5hbWV9JyB3aXRoIGNvbmZpZ2AsIGNvbmZpZylcclxuXHRcdFx0XHR2YXIgYXJncyA9IFtjb25maWddLmNvbmNhdChkZXBzMilcclxuXHRcdFx0XHRzcnYub2JqID0gc3J2LmZuLmFwcGx5KG51bGwsIGFyZ3MpXHJcblx0XHRcdFx0c3J2LnN0YXR1cyA9ICdyZWFkeSdcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gc3J2Lm9ialx0XHRcdFx0XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly9zcnYuc3RhdHVzID0gJ25vdHJlZ2lzdGVyZWQnXHJcblx0XHRcdHRocm93KGBbQ29yZV0gc2VydmljZSAnJHtkZXBOYW1lfScgaXMgbm90IHJlZ2lzdGVyZWRgKVxyXG5cdFx0fVxyXG5cclxuXHR9KVxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGNvbmZpZ3VyZVNlcnZpY2UobmFtZSwgY29uZmlnKSB7XHJcblx0Y29uc29sZS5sb2coJ1tDb3JlXSBjb25maWd1cmVTZXJ2aWNlJywgbmFtZSwgY29uZmlnKVxyXG5cdGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJyB8fCB0eXBlb2YgY29uZmlnICE9ICdvYmplY3QnKSB7XHJcblx0XHRjb25zb2xlLndhcm4oJ1tDb3JlXSBjb25maWd1cmVTZXJ2aWNlIGNhbGxlZCB3aXRoIGJhZCBhcmd1bWVudHMnKVxyXG5cdFx0cmV0dXJuXHJcblx0fSBcdFxyXG5cclxuXHR2YXIgc3J2ID0gc2VydmljZXNbbmFtZV1cclxuXHRpZiAoc3J2KSB7XHJcblx0XHRzcnYuY29uZmlnID0gY29uZmlnXHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0dGhyb3coYFtjb25maWd1cmVTZXJ2aWNlXSBzZXJ2aWNlICcke25hbWV9JyBpcyBub3QgcmVnaXN0ZXJlZGApXHJcblx0fVxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJTZXJ2aWNlKG5hbWUsIGFyZzEsIGFyZzIpIHtcclxuXHR2YXIgZGVwcyA9IFtdXHJcblx0dmFyIGZuID0gYXJnMVxyXG5cdGlmIChBcnJheS5pc0FycmF5KGFyZzEpKSB7XHJcblx0XHRkZXBzID0gYXJnMVxyXG5cdFx0Zm4gPSBhcmcyXHJcblx0fVxyXG5cdGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJyB8fCB0eXBlb2YgZm4gPT0gJ3VuZGVmaW5lZCcgfHwgIUFycmF5LmlzQXJyYXkoZGVwcykpIHtcclxuXHRcdHRocm93KCdbQ29yZV0gcmVnaXN0ZXJTZXJ2aWNlIGNhbGxlZCB3aXRoIGJhZCBhcmd1bWVudHMnKVxyXG5cdH0gXHJcblx0Y29uc29sZS5sb2coYFtDb3JlXSByZWdpc3RlciBzZXJ2aWNlICcke25hbWV9JyB3aXRoIGRlcHNgLCBkZXBzKVxyXG5cclxuXHRzZXJ2aWNlc1tuYW1lXSA9IHtkZXBzLCBmbiwgc3RhdHVzOiAnbm90bG9hZGVkJ31cclxufVxyXG5cclxuJCQuc2VydmljZSA9IHtcclxuXHRyZWdpc3RlclNlcnZpY2UsXHJcblx0Y29uZmlndXJlU2VydmljZSxcclxuXHRnZXRTZXJ2aWNlc1xyXG59XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG5cclxuZnVuY3Rpb24gcmVhZFRleHRGaWxlKGZpbGVOYW1lLCBvblJlYWQpIHtcclxuXHR2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuXHJcblx0ZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0eXBlb2Ygb25SZWFkID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0b25SZWFkKGZpbGVSZWFkZXIucmVzdWx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmaWxlUmVhZGVyLnJlYWRBc1RleHQoZmlsZU5hbWUpXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZWFkRmlsZUFzRGF0YVVSTChmaWxlTmFtZSwgb25SZWFkKSB7XHJcblx0dmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXHJcblxyXG5cdGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodHlwZW9mIG9uUmVhZCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdG9uUmVhZChmaWxlUmVhZGVyLnJlc3VsdClcclxuXHRcdH1cclxuXHR9XHJcblx0ZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGVOYW1lKVxyXG59XHJcblxyXG5cclxudmFyIGlucHV0RmlsZSA9ICQoJzxpbnB1dD4nLCB7dHlwZTogJ2ZpbGUnfSkub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG5cdHZhciBvbkFwcGx5ID0gJCh0aGlzKS5kYXRhKCdvbkFwcGx5JylcclxuXHR2YXIgZmlsZU5hbWUgPSB0aGlzLmZpbGVzWzBdXHJcblx0aWYgKHR5cGVvZiBvbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdG9uQXBwbHkoZmlsZU5hbWUpXHJcblx0fVxyXG59KVxyXG5cclxuZnVuY3Rpb24gb3BlbkZpbGVEaWFsb2cob25BcHBseSkge1xyXG5cdGlucHV0RmlsZS5kYXRhKCdvbkFwcGx5Jywgb25BcHBseSlcclxuXHRpbnB1dEZpbGUuY2xpY2soKVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc0ltYWdlKGZpbGVOYW1lKSB7XHJcblx0cmV0dXJuICgvXFwuKGdpZnxqcGd8anBlZ3xwbmcpJC9pKS50ZXN0KGZpbGVOYW1lKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkYXRhVVJMdG9CbG9iKGRhdGFVUkwpIHtcclxuICAvLyBEZWNvZGUgdGhlIGRhdGFVUkxcclxuICBjb25zdCBbICwgbWltZVR5cGUsIGVuY29kYWdlLCBkYXRhXSA9IGRhdGFVUkwuc3BsaXQoL1s6LDtdLylcclxuICBpZiAoZW5jb2RhZ2UgIT0gJ2Jhc2U2NCcpIHtcclxuICBcdHJldHVyblxyXG4gIH1cclxuXHJcbiAgLy9jb25zb2xlLmxvZygnbWltZVR5cGUnLCBtaW1lVHlwZSlcclxuICAvL2NvbnNvbGUubG9nKCdlbmNvZGFnZScsIGVuY29kYWdlKVxyXG4gIC8vY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKVxyXG5cclxuICB2YXIgYmluYXJ5ID0gYXRvYihkYXRhKVxyXG4gLy8gQ3JlYXRlIDgtYml0IHVuc2lnbmVkIGFycmF5XHJcbiAgdmFyIGFycmF5ID0gW11cclxuICBmb3IodmFyIGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgXHRhcnJheS5wdXNoKGJpbmFyeS5jaGFyQ29kZUF0KGkpKVxyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJuIG91ciBCbG9iIG9iamVjdFxyXG5cdHJldHVybiBuZXcgQmxvYihbIG5ldyBVaW50OEFycmF5KGFycmF5KSBdLCB7bWltZVR5cGV9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU3R5bGUoc3R5bGVGaWxlUGF0aCwgY2FsbGJhY2spIHtcdFxyXG5cdC8vY29uc29sZS5sb2coJ1tDb3JlXSBsb2FkU3R5bGUnLCBzdHlsZUZpbGVQYXRoKVxyXG5cclxuXHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNzc09rID0gJCgnaGVhZCcpLmZpbmQoYGxpbmtbaHJlZj1cIiR7c3R5bGVGaWxlUGF0aH1cIl1gKS5sZW5ndGhcclxuXHRcdGlmIChjc3NPayAhPSAxKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBsb2FkaW5nICcke3N0eWxlRmlsZVBhdGh9JyBzdHlsZWApXHJcblx0XHRcdCQoJzxsaW5rPicsIHtocmVmOiBzdHlsZUZpbGVQYXRoLCByZWw6ICdzdHlsZXNoZWV0J30pXHJcblx0XHRcdC5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGAnJHtzdHlsZUZpbGVQYXRofScgbG9hZGVkYClcclxuXHRcdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbygkKCdoZWFkJykpXHJcblx0XHR9XHJcblx0fSlcclxufVxyXG5cclxuXHJcblxyXG5cdFxyXG5mdW5jdGlvbiBpc09iamVjdChhKSB7XHJcblx0cmV0dXJuICh0eXBlb2YgYSA9PSAnb2JqZWN0JykgJiYgIUFycmF5LmlzQXJyYXkoYSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tUeXBlKHZhbHVlLCB0eXBlLCBpc09wdGlvbmFsKSB7XHJcblx0Ly9jb25zb2xlLmxvZygnY2hlY2tUeXBlJyx2YWx1ZSwgdHlwZSwgaXNPcHRpb25hbClcclxuXHRpZiAodHlwZW9mIHZhbHVlID09ICd1bmRlZmluZWQnICYmIGlzT3B0aW9uYWwgPT09IHRydWUpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIHR5cGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT0gdHlwZVxyXG5cdH1cclxuXHJcblx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodHlwZSkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHR5cGUubGVuZ3RoID09IDApIHtcclxuXHRcdFx0cmV0dXJuIHRydWUgLy8gbm8gaXRlbSB0eXBlIGNoZWNraW5nXHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgdmFsdWUpIHtcclxuXHRcdFx0dmFyIHJldCA9IGZhbHNlXHJcblx0XHRcdGZvcihsZXQgdCBvZiB0eXBlKSB7XHJcblx0XHRcdFx0cmV0IHw9IGNoZWNrVHlwZShpLCB0KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghcmV0KSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKGlzT2JqZWN0KHR5cGUpKSB7XHJcblx0XHRpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgZiBpbiB0eXBlKSB7XHJcblxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdmJywgZiwgJ3ZhbHVlJywgdmFsdWUpXHJcblx0XHRcdHZhciBuZXdUeXBlID0gdHlwZVtmXVxyXG5cclxuXHRcdFx0dmFyIGlzT3B0aW9uYWwgPSBmYWxzZVxyXG5cdFx0XHRpZiAoZi5zdGFydHNXaXRoKCckJykpIHtcclxuXHRcdFx0XHRmID0gZi5zdWJzdHIoMSlcclxuXHRcdFx0XHRpc09wdGlvbmFsID0gdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghY2hlY2tUeXBlKHZhbHVlW2ZdLCBuZXdUeXBlLCBpc09wdGlvbmFsKSkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cdHJldHVybiBmYWxzZVxyXG59XHRcclxuXHJcblxyXG5cclxuJCQudXRpbCA9IHtcclxuXHRyZWFkVGV4dEZpbGUsXHJcblx0cmVhZEZpbGVBc0RhdGFVUkwsXHJcblx0b3BlbkZpbGVEaWFsb2csXHJcblx0aXNJbWFnZSxcclxuXHRkYXRhVVJMdG9CbG9iLFxyXG5cdGxvYWRTdHlsZSxcclxuXHRjaGVja1R5cGVcclxufVxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxuY2xhc3MgVmlld0NvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoZWx0LCBvcHRpb25zKSB7XHJcbiAgICBcdC8vY29uc29sZS5sb2coJ1ZpZXdDb250cm9sbGVyJywgb3B0aW9ucylcclxuICAgIFx0aWYgKHR5cGVvZiBlbHQgPT0gJ3N0cmluZycpIHtcclxuICAgIFx0XHRlbHQgPSAkKGVsdClcclxuICAgIFx0fVxyXG5cclxuICAgIFx0b3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zKVxyXG4gICAgICAgIHRoaXMuZWx0ID0gZWx0XHJcblxyXG4gICAgICAgIGVsdC5vbignZGF0YTp1cGRhdGUnLCAoZXYsIG5hbWUsIHZhbHVlLCBleGNsdWRlRWx0KSA9PiB7XHJcbiAgICAgICAgXHQvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIGRhdGE6Y2hhbmdlJywgbmFtZSwgdmFsdWUpXHJcbiAgICAgICAgXHR0aGlzLnNldERhdGEobmFtZSwgdmFsdWUsIGV4Y2x1ZGVFbHQpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGhpcy5tb2RlbCA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zLmRhdGEpXHJcbiAgICAgICAgdGhpcy5ydWxlcyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zLnJ1bGVzKVxyXG4gICAgICAgIHRoaXMud2F0Y2hlcyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zLndhdGNoZXMpXHJcblxyXG4gICAgICAgIC8vIGdlbmVyYXRlIGF1dG9tYXRpYyBydWxlcyBmb3IgY29tcHV0ZWQgZGF0YSAoYWthIGZ1bmN0aW9uKVxyXG4gICAgICAgIGZvcih2YXIgayBpbiB0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgXHR2YXIgZGF0YSA9IHRoaXMubW9kZWxba11cclxuICAgICAgICBcdGlmICh0eXBlb2YgZGF0YSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgXHRcdHZhciBmdW5jVGV4dCA9IGRhdGEudG9TdHJpbmcoKVxyXG4gICAgICAgIFx0XHQvL2NvbnNvbGUubG9nKCdmdW5jVGV4dCcsIGZ1bmNUZXh0KVxyXG4gICAgICAgIFx0XHR2YXIgcnVsZXMgPSBbXVxyXG4gICAgICAgIFx0XHRmdW5jVGV4dC5yZXBsYWNlKC90aGlzLihbYS16QS1aMC05Xy1dezEsfSkvZywgZnVuY3Rpb24obWF0Y2gsIGNhcHR1cmVPbmUpIHtcclxuICAgICAgICBcdFx0XHQvL2NvbnNvbGUubG9nKCdjYXB0dXJlT25lJywgY2FwdHVyZU9uZSlcclxuICAgICAgICBcdFx0XHRydWxlcy5wdXNoKGNhcHR1cmVPbmUpXHJcbiAgICAgICAgXHRcdH0pXHJcbiAgICAgICAgXHRcdHRoaXMucnVsZXNba10gPSBydWxlcy50b1N0cmluZygpXHJcbiAgICAgICAgXHR9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdydWxlcycsIHRoaXMucnVsZXMpXHJcbiAgICAgICAgdGhpcy5jdHggPSAkJC5iaW5kaW5nLnByb2Nlc3MoZWx0LCB0aGlzLm1vZGVsLCAkJC5jb250cm9sLmNyZWF0ZUNvbnRyb2wpXHJcblxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuZXZlbnRzID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICQkLmJpbmRpbmcucHJvY2Vzc0V2ZW50cyhlbHQsIG9wdGlvbnMuZXZlbnRzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zY29wZSA9ICQkLmJpbmRpbmcucHJvY2Vzc0JpbmRpbmdzKGVsdClcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdzY29wZScsIHRoaXMuc2NvcGUpXHJcbiAgICAgICBcclxuXHJcbiAgICB9IFxyXG5cclxuICAgIHNldERhdGEoYXJnMSwgYXJnMiwgZXhjbHVkZUVsdCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gc2V0RGF0YScsIGFyZzEsIGFyZzIpXHJcbiAgICAgICAgdmFyIGRhdGEgPSBhcmcxXHJcbiAgICAgICAgaWYgKHR5cGVvZiBhcmcxID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgXHRkYXRhID0ge31cclxuICAgICAgICBcdGRhdGFbYXJnMV0gPSBhcmcyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gc2V0RGF0YScsIGRhdGEpXHJcbiAgICAgICAgJC5leHRlbmQodGhpcy5tb2RlbCwgZGF0YSlcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdtb2RlbCcsIHRoaXMubW9kZWwpXHJcbiAgICAgICAgdGhpcy51cGRhdGUoT2JqZWN0LmtleXMoZGF0YSksIGV4Y2x1ZGVFbHQpXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGZpZWxkc05hbWUsIGV4Y2x1ZGVFbHQpIHtcclxuICAgIFx0Ly9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSB1cGRhdGUnLCBmaWVsZHNOYW1lKVxyXG4gICAgXHRpZiAodHlwZW9mIGZpZWxkc05hbWUgPT0gJ3N0cmluZycpIHtcclxuICAgIFx0XHRmaWVsZHNOYW1lID0gZmllbGRzTmFtZS5zcGxpdCgnLCcpXHJcbiAgICBcdH1cclxuXHJcblxyXG4gICAgXHRpZiAoQXJyYXkuaXNBcnJheShmaWVsZHNOYW1lKSkge1xyXG4gICAgXHRcdHZhciBmaWVsZHNTZXQgPSB7fVxyXG4gICAgXHRcdGZpZWxkc05hbWUuZm9yRWFjaCgoZmllbGQpID0+IHtcclxuXHJcbiAgICBcdFx0XHR2YXIgd2F0Y2ggPSB0aGlzLndhdGNoZXNbZmllbGRdXHJcbiAgICBcdFx0XHRpZiAodHlwZW9mIHdhdGNoID09ICdmdW5jdGlvbicpIHtcclxuICAgIFx0XHRcdFx0d2F0Y2guY2FsbChudWxsLCB0aGlzLm1vZGVsW2ZpZWxkXSlcclxuICAgIFx0XHRcdH1cclxuICAgIFx0XHRcdGZpZWxkc1NldFtmaWVsZF0gPSAxXHJcblxyXG4gICAgXHRcdFx0Zm9yKHZhciBydWxlIGluIHRoaXMucnVsZXMpIHtcclxuICAgIFx0XHRcdFx0aWYgKHRoaXMucnVsZXNbcnVsZV0uc3BsaXQoJywnKS5pbmRleE9mKGZpZWxkKSAhPSAtMSkge1xyXG4gICAgXHRcdFx0XHRcdGZpZWxkc1NldFtydWxlXSA9IDFcclxuICAgIFx0XHRcdFx0fVxyXG4gICAgXHRcdFx0fVxyXG4gICAgXHRcdH0pXHJcblxyXG5cclxuICAgIFx0XHQkJC5iaW5kaW5nLnVwZGF0ZSh0aGlzLmN0eCwgdGhpcy5tb2RlbCwgT2JqZWN0LmtleXMoZmllbGRzU2V0KSwgZXhjbHVkZUVsdClcclxuICAgIFx0fVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuJCQudmlld0NvbnRyb2xsZXIgPSBmdW5jdGlvbihlbHQsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBuZXcgVmlld0NvbnRyb2xsZXIoZWx0LCBvcHRpb25zKVxyXG59XHJcblxyXG5cclxufSkoKTtcclxuIl19
