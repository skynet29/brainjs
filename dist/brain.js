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

$$.formDialogController = function(options) {
	var div = $('<div>', {title: options.title || 'Dialog'})

	var private = {}

	var form = $('<form>')
		.appendTo(div)
		.on('submit', function(ev) {
			ev.preventDefault()
			div.dialog('close')
			if (typeof private.onApply == 'function') {
				private.onApply($(this).getFormData())
				$(this).resetForm()
			}				
		})

	if (typeof options.template == 'string') {
		$(options.template).appendTo(form)
	}	

	if (options.template instanceof jQuery) {
		console.log(options.template.children().length)
		options.template.children().clone().appendTo(form)
	}

	var submitBtn = $('<input>', {type: 'submit', hidden: true}).appendTo(form)

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


	return {
		show: function(onApply) {
			private.onApply = onApply			
			div.dialog('open')			
		},
		setData: function(data) {
			form.setFormData(data)
			return this
		}
	}
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwibGliL2JpbmRpbmcuanMiLCJsaWIvY29udHJvbC5qcyIsImxpYi9kaWFsb2dDb250cm9sbGVyIC5qcyIsImxpYi9mb3JtRGlhbG9nQ29udHJvbGxlci5qcyIsImxpYi9qcXVlcnktZXh0LmpzIiwibGliL3NlcnZpY2UuanMiLCJsaWIvdXRpbC5qcyIsImxpYi92aWV3Q29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnJhaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuXHJcblx0d2luZG93LiQkID0ge31cclxuXHRcclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRWYXJWYWx1ZShkYXRhLCB2YXJOYW1lKSB7XHJcbiAgICB2YXIgcmV0ID0gZGF0YVxyXG4gICAgZm9yKGxldCBmIG9mIHZhck5hbWUuc3BsaXQoJy4nKSkge1xyXG4gICAgICBcclxuICAgICAgaWYgKHR5cGVvZiByZXQgPT0gJ29iamVjdCcgJiYgZiBpbiByZXQpIHtcclxuICAgICAgICByZXQgPSByZXRbZl1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFZhbHVlKGRhdGEsIHZhck5hbWUpIHtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCdbQ29yZV0gZ2V0VmFsdWUnLCB2YXJOYW1lLCBjdHgpXHJcblxyXG4gICAgdmFyIG5vdCA9IGZhbHNlXHJcbiAgICBpZiAodmFyTmFtZS5zdGFydHNXaXRoKCchJykpIHtcclxuICAgICAgdmFyTmFtZSA9IHZhck5hbWUuc3Vic3RyKDEpXHJcbiAgICAgIG5vdCA9IHRydWVcclxuICAgIH0gICAgIFxyXG5cclxuICAgIHZhciBmdW5jID0gZGF0YVt2YXJOYW1lXVxyXG4gICAgdmFyIHZhbHVlXHJcblxyXG4gICAgaWYgKHR5cGVvZiBmdW5jID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdmFsdWUgPSBmdW5jLmNhbGwoZGF0YSlcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YWx1ZSA9IGdldFZhclZhbHVlKGRhdGEsIHZhck5hbWUpXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Jvb2xlYW4nICYmIG5vdCkge1xyXG4gICAgICB2YWx1ZSA9ICF2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWx1ZVxyXG4gIH1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc3BsaXRBdHRyKGF0dHJWYWx1ZSwgY2JrKSB7XHJcbiAgYXR0clZhbHVlLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihpKSB7XHJcbiAgICBsZXQgW25hbWUsIHZhbHVlXSA9IGkuc3BsaXQoJzonKVxyXG4gICAgY2JrKG5hbWUudHJpbSgpLCB2YWx1ZS50cmltKCkpXHJcbiAgfSlcclxufVxyXG5cclxuXHJcbmNvbnN0IG1hcCA9IHtcclxuICAnYm4tZWFjaCc6IHt0eXBlOiAzfSxcclxuICAnYm4tdGV4dCc6IHtmOiAndGV4dCcsIHR5cGU6IDF9LFxyXG4gICdibi1odG1sJzoge2Y6ICdodG1sJywgdHlwZTogMX0sXHJcbiAgJ2JuLXZhbCc6IHtmOiAnc2V0VmFsdWUnLCB0eXBlOiAxfSxcclxuICAnYm4tc2hvdyc6IHtmOiAnc2V0VmlzaWJsZScsIHR5cGU6IDF9LFxyXG4gICdibi1zdHlsZSc6IHtmOiAnY3NzJywgdHlwZTogMn0sXHJcbiAgJ2JuLWF0dHInOiB7ZjogJ2F0dHInLCB0eXBlOiAyfSxcclxuICAnYm4tcHJvcCc6IHtmOiAncHJvcCcsIHR5cGU6IDJ9LFxyXG4gICdibi1kYXRhJzoge2Y6ICdzZXREYXRhJywgdHlwZTogMn0sXHJcbiAgJ2JuLWNsYXNzJzoge2Y6ICdzZXRDbGFzcycsIHR5cGU6IDJ9LFxyXG4gICdibi1jb250cm9sJzoge3R5cGU6IDR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGUoY3R4LCBkYXRhLCB2YXJzLCBleGNsdWRlRWx0KSB7XHJcblxyXG4gIC8vY29uc29sZS5sb2coJ3VwZGF0ZScsIHZhcnMpXHJcblxyXG4gIGlmICh0eXBlb2YgdmFycyA9PSAnc3RyaW5nJykge1xyXG4gICAgdmFycyA9IHZhcnMuc3BsaXQoJywnKVxyXG4gIH1cclxuXHJcbiAgdmFycy5mb3JFYWNoKGZ1bmN0aW9uKHZhcmlhYmxlKSB7XHJcbiAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJpYWJsZSlcclxuICAgIFxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgdXBkYXRlKGN0eCwgZGF0YSwgT2JqZWN0LmtleXModmFsdWUpLm1hcChpID0+IHZhcmlhYmxlICsgJy4nICsgaSksIGV4Y2x1ZGVFbHQpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoY3R4W3ZhcmlhYmxlXSkge1xyXG4gICAgICBjdHhbdmFyaWFibGVdLmZvckVhY2goZnVuY3Rpb24oYWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IHt0eXBlLCBmLCBlbHQsIG5hbWUsIHRlbXBsYXRlLCBpdGVyfSA9IGFjdGlvblxyXG4gICAgICAgIGlmIChlbHQgPT0gZXhjbHVkZUVsdCkge1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlID09IDEpIHtcclxuICAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIHZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSA9PSAyKSB7XHJcbiAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICB9ICAgXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMyAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICBlbHQuZW1wdHkoKVxyXG4gICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICB2YXIgaXRlbURhdGEgPSAkLmV4dGVuZCh7fSwgZGF0YSlcclxuICAgICAgICAgICAgICBpdGVtRGF0YVtpdGVyXSA9IGl0ZW1cclxuICAgICAgICAgICAgICB2YXIgJGl0ZW0gPSB0ZW1wbGF0ZS5jbG9uZSgpXHJcbiAgICAgICAgICAgICAgcHJvY2VzcygkaXRlbSwgaXRlbURhdGEpXHJcbiAgICAgICAgICAgICAgZWx0LmFwcGVuZCgkaXRlbSkgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc0V2ZW50cyhyb290LCBldmVudHMpIHtcclxuICByb290LmZpbmQoYFtibi1ldmVudF1gKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgZWx0ID0gJCh0aGlzKVxyXG4gICAgICBsZXQgYXR0clZhbHVlID0gZWx0LmF0dHIoJ2JuLWV2ZW50JylcclxuICAgICAgZWx0LnJlbW92ZUF0dHIoJ2JuLWV2ZW50JylcclxuICAgICAgXHJcbiAgICAgIHNwbGl0QXR0cihhdHRyVmFsdWUsIGZ1bmN0aW9uKGV2dE5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgbGV0IGZuICA9IGV2ZW50c1t2YWx1ZV1cclxuICAgICAgICBpZiAodHlwZW9mIGZuID09ICdmdW5jdGlvbicpIHsgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgW25hbWUsIHNlbGVjdG9yXSA9IGV2dE5hbWUuc3BsaXQoJy4nKVxyXG5cclxuICAgICAgICAgIGlmIChzZWxlY3RvciAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZWx0Lm9uKG5hbWUsICcuJyArIHNlbGVjdG9yLCBmbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlbHQub24obmFtZSwgZm4pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICBcclxuICAgIH0pXHJcbiAgICAgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3Mocm9vdCwgZGF0YSwgY3JlYXRlQ29udHJvbCkge1xyXG5cclxuXHJcbiAgbGV0IGN0eCA9IHt9XHJcbiAgXHJcbiAgZm9yKGxldCBkaXIgaW4gbWFwKSB7XHJcbiAgICBcclxuXHJcbiAgICByb290LmJuRmluZChgWyR7ZGlyfV1gKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgZWx0ID0gJCh0aGlzKVxyXG4gICAgICBsZXQgYXR0clZhbHVlID0gZWx0LmF0dHIoZGlyKVxyXG4gICAgICBlbHQucmVtb3ZlQXR0cihkaXIpXHJcblxyXG4gICAgICBsZXQge3R5cGUsIGZ9ID0gbWFwW2Rpcl1cclxuICAgICAgXHJcbiAgICAgIGlmICh0eXBlID09IDEpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgYXR0clZhbHVlKVxyXG4gICAgICAgICAgLy9lbHQudGV4dChkYXRhW2F0dHJWYWx1ZV0pXHJcbiAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIHZhbHVlKVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgaWYgKGRpciA9PSAnYm4tdmFsJykge1xyXG4gICAgICAgICAgbGV0IHVwZGF0ZUV2dCA9IGVsdC5hdHRyKCdibi11cGRhdGUnKVxyXG4gICAgICAgICAgaWYgKHVwZGF0ZUV2dCkge1xyXG4gICAgICAgICAgICBlbHQucmVtb3ZlQXR0cignYm4tdXBkYXRlJylcclxuICAgICAgICAgICAgZWx0Lm9uKHVwZGF0ZUV2dCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgcm9vdC50cmlnZ2VyKCdkYXRhOnVwZGF0ZScsIFthdHRyVmFsdWUsIGVsdC5nZXRWYWx1ZSgpLCBlbHRdKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdHhbYXR0clZhbHVlXSA9IGN0eFthdHRyVmFsdWVdIHx8IFtdXHJcbiAgICAgICAgY3R4W2F0dHJWYWx1ZV0ucHVzaCh7ZiwgZWx0LCB0eXBlfSkgICAgICAgIFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZSA9PSA0ICYmIHR5cGVvZiBjcmVhdGVDb250cm9sID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBjcmVhdGVDb250cm9sKGF0dHJWYWx1ZSwgZWx0KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZSA9PSAyKSB7XHJcblxyXG4gICAgICAgICAgc3BsaXRBdHRyKGF0dHJWYWx1ZSwgZnVuY3Rpb24obmFtZSwgdmFyTmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIHZhck5hbWUpXHJcbiAgICAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHhbdmFyTmFtZV0gPSBjdHhbdmFyTmFtZV0gfHwgW11cclxuICAgICAgICAgICAgY3R4W3Zhck5hbWVdLnB1c2goe2YsIGVsdCwgdHlwZSwgbmFtZX0pICBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICB9XHJcbiAgICAgICBcclxuICAgICAgIFxyXG4gICAgICBpZiAodHlwZSA9PSAzKSB7XHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZWx0LmNoaWxkcmVuKCkucmVtb3ZlKCkuY2xvbmUoKVxyXG4gICAgICAgIGxldCBbaXRlciwgLCB2YXJOYW1lXSA9IGF0dHJWYWx1ZS5zcGxpdCgnICcpXHJcbiAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyTmFtZSlcclxuICAgICAgICBcclxuICAgICAgICBjdHhbdmFyTmFtZV0gPSBjdHhbdmFyTmFtZV0gfHwgW11cclxuICAgICAgICBjdHhbdmFyTmFtZV0ucHVzaCh7ZWx0LCB0eXBlLCB0ZW1wbGF0ZSwgaXRlcn0pICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZGF0YSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICB2YXIgaXRlbURhdGEgPSAkLmV4dGVuZCh7fSwgZGF0YSlcclxuICAgICAgICAgICBpdGVtRGF0YVtpdGVyXSA9IGl0ZW1cclxuICAgICAgICAgICB2YXIgJGl0ZW0gPSB0ZW1wbGF0ZS5jbG9uZSgpXHJcbiAgICAgICAgICAgcHJvY2VzcygkaXRlbSwgaXRlbURhdGEsIGNyZWF0ZUNvbnRyb2wpXHJcbiAgICAgICAgICAgZWx0LmFwcGVuZCgkaXRlbSkgICAgICAgICAgXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgICBcclxuICBcclxuICB9XHJcbiAgXHJcblxyXG4gIHJldHVybiBjdHhcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc0JpbmRpbmdzKHJvb3QpIHtcclxuXHJcbiAgICB2YXIgZGF0YSA9IHt9XHJcblxyXG4gICAgcm9vdC5ibkZpbmQoJ2JuLWJpbmQnLCB0cnVlLCBmdW5jdGlvbihlbHQsIHZhck5hbWUpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnYm4tdGV4dCcsIHZhck5hbWUpXHJcbiAgICAgIGRhdGFbdmFyTmFtZV0gPSBlbHRcclxuICAgIH0pXHJcbiAgICByb290LmJuRmluZCgnYm4taWZhY2UnLCB0cnVlLCBmdW5jdGlvbihlbHQsIHZhck5hbWUpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnYm4tdGV4dCcsIHZhck5hbWUpXHJcbiAgICAgIGRhdGFbdmFyTmFtZV0gPSBlbHQuaWZhY2UoKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBkYXRhXHJcbiAgXHJcbn1cclxuXHJcbiQkLmJpbmRpbmcgPSB7XHJcbiAgcHJvY2VzcyxcclxuICB1cGRhdGUsXHJcbiAgcHJvY2Vzc0V2ZW50cyxcclxuICBwcm9jZXNzQmluZGluZ3NcclxufVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5sZXQgY29udHJvbHMgPSB7fVxyXG5cclxuZnVuY3Rpb24gaXNEZXBzT2soZGVwcykge1xyXG5cdHJldHVybiBkZXBzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcclxuXHJcblx0XHRyZXR1cm4gcHJldiAmJiAoY3VyICE9IHVuZGVmaW5lZClcclxuXHR9LCB0cnVlKVx0XHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQ29udHJvbChuYW1lLCBvcHRpb25zKSB7XHJcblx0aWYgKCEkJC51dGlsLmNoZWNrVHlwZShvcHRpb25zLCB7XHJcblx0XHQkZGVwczogWydzdHJpbmcnXSxcclxuXHRcdGluaXQ6ICdmdW5jdGlvbidcclxuXHR9KSkge1xyXG5cdFx0Y29uc29sZS5lcnJvcihgW0NvcmVdIHJlZ2lzdGVyQ29udHJvbDogYmFkIG9wdGlvbnNgLCBvcHRpb25zKVxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHJcblx0dmFyIGRlcHMgPSBvcHRpb25zLmRlcHMgfHwgW11cclxuXHJcblx0Y29uc29sZS5sb2coYFtDb3JlXSByZWdpc3RlciBjb250cm9sICcke25hbWV9JyB3aXRoIGRlcHNgLCBkZXBzKVxyXG5cclxuXHRjb250cm9sc1tuYW1lXSA9IHtkZXBzLCBvcHRpb25zLCBzdGF0dXM6ICdub3Rsb2FkZWQnfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDb250cm9sKG5hbWUpIHtcclxuXHR2YXIgcmV0ID0gY29udHJvbHNbbmFtZV1cclxuXHRpZiAocmV0ICYmIHJldC5zdGF0dXMgPT0gJ25vdGxvYWRlZCcpIHtcclxuXHRcdHJldC5kZXBzID0gJCQuc2VydmljZS5nZXRTZXJ2aWNlcyhyZXQuZGVwcylcclxuXHRcdHJldC5zdGF0dXMgPSBpc0RlcHNPayhyZXQuZGVwcykgPyAnb2snIDogJ2tvJ1xyXG5cdH1cclxuXHRyZXR1cm4gcmV0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2woY29udHJvbE5hbWUsIGVsdCkge1xyXG5cdGVsdC5hZGRDbGFzcyhjb250cm9sTmFtZSlcclxuXHRlbHQuYWRkQ2xhc3MoJ0N1c3RvbUNvbnRyb2wnKS51bmlxdWVJZCgpXHRcclxuXHR2YXIgY3RybCA9IGdldENvbnRyb2woY29udHJvbE5hbWUpXHJcblx0XHRcclxuXHRpZiAoY3RybCA9PSB1bmRlZmluZWQpIHtcclxuXHRcdHRocm93KGBbQ29yZV0gY29udHJvbCAnJHtjb250cm9sTmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHR9XHJcblx0XHQvL2NvbnNvbGUubG9nKCdjcmVhdGVDb250cm9sJywgY29udHJvbE5hbWUsIGN0cmwpXHJcblx0aWYgKGN0cmwuc3RhdHVzID09PSAgJ29rJykge1xyXG5cdFx0XHJcblx0XHR2YXIgaWZhY2UgPSB7XHJcblx0XHRcdHByb3BzOiB7fSxcclxuXHRcdFx0bmFtZTogY29udHJvbE5hbWVcclxuXHRcdH1cclxuXHJcblx0XHRsZXQge2luaXQsIHByb3BzLCB0ZW1wbGF0ZX0gPSBjdHJsLm9wdGlvbnNcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge31cclxuXHJcblx0XHRPYmplY3Qua2V5cyhwcm9wcykuZm9yRWFjaChmdW5jdGlvbihwcm9wTmFtZSkge1xyXG5cdFx0XHRpZmFjZS5wcm9wc1twcm9wTmFtZV0gPSBlbHQuZGF0YShwcm9wTmFtZSkgfHwgcHJvcHNbcHJvcE5hbWVdXHJcblx0XHR9KVxyXG5cclxuXHRcdGlmICh0eXBlb2YgdGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0ZWx0ID0gJCh0ZW1wbGF0ZSkuYXBwZW5kVG8oZWx0KVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0eXBlb2YgaW5pdCA9PSAnZnVuY3Rpb24nKSB7XHJcblxyXG5cdFx0XHR2YXIgYXJncyA9IFtlbHRdLmNvbmNhdChjdHJsLmRlcHMpXHJcblx0XHRcdGNvbnNvbGUubG9nKGBbQ29yZV0gaW5zdGFuY2UgY29udHJvbCAnJHtjb250cm9sTmFtZX0nYClcclxuXHRcdFx0aW5pdC5hcHBseShpZmFjZSwgYXJncylcclxuXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKGBbQ29yZV0gY29udHJvbCAnJHtjb250cm9sTmFtZX0nIG1pc3NpbmcgaW5pdCBmdW5jdGlvbmApXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGVsdC5nZXQoMCkuY3RybCA9IGlmYWNlXHJcblx0XHRcclxuXHRcdHJldHVybiBpZmFjZVx0XHRcdFx0XHJcblx0fVxyXG5cclxuXHJcblxyXG59XHJcblxyXG4kJC5jb250cm9sID0ge1xyXG5cdHJlZ2lzdGVyQ29udHJvbCxcclxuXHRjcmVhdGVDb250cm9sXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIiQkLmRpYWxvZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGRpdiA9ICQoJzxkaXY+Jywge3RpdGxlOiBvcHRpb25zLnRpdGxlIHx8ICdEaWFsb2cnfSlcclxuXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnRlbXBsYXRlID09ICdzdHJpbmcnKSB7XHJcblx0XHQkKG9wdGlvbnMudGVtcGxhdGUpLmFwcGVuZFRvKGRpdilcclxuXHR9XHRcclxuXHJcblx0dmFyIGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihkaXYsIG9wdGlvbnMpXHJcblxyXG5cdHZhciBkbGdPcHRpb25zID0gJC5leHRlbmQoe1xyXG5cdFx0YXV0b09wZW46IGZhbHNlLFxyXG5cdFx0bW9kYWw6IHRydWUsXHJcblx0XHR3aWR0aDogJ2F1dG8nLFx0XHRcclxuXHR9LCBvcHRpb25zKVxyXG5cclxuXHR2YXIgcHJpdmF0ZSA9IHt9XHJcblxyXG5cdC8vY29uc29sZS5sb2coJ2RsZ09wdGlvbnMnLCBkbGdPcHRpb25zKVxyXG5cclxuXHRkaXYuZGlhbG9nKGRsZ09wdGlvbnMpXHJcblxyXG5cdGN0cmwuc2hvdyA9IGZ1bmN0aW9uKG9uQXBwbHkpIHtcclxuXHRcdHByaXZhdGUub25BcHBseSA9IG9uQXBwbHlcclxuXHRcdGRpdi5kaWFsb2coJ29wZW4nKVxyXG5cdH1cclxuXHJcblx0Y3RybC5oaWRlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRkaXYuZGlhbG9nKCdjbG9zZScpXHJcblx0fVxyXG5cclxuXHRjdHJsLmFwcGx5ID0gZnVuY3Rpb24ocmV0VmFsdWUpIHtcclxuXHRcdGN0cmwuaGlkZSgpXHJcblx0XHRpZiAodHlwZW9mIHByaXZhdGUub25BcHBseSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHByaXZhdGUub25BcHBseShyZXRWYWx1ZSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGN0cmwuc2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uTmFtZSwgdmFsdWUpIHtcclxuXHRcdGRpdi5kaWFsb2coJ29wdGlvbicsIG9wdGlvbk5hbWUsIHZhbHVlKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGN0cmxcclxufTtcclxuIiwiJCQuZm9ybURpYWxvZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGRpdiA9ICQoJzxkaXY+Jywge3RpdGxlOiBvcHRpb25zLnRpdGxlIHx8ICdEaWFsb2cnfSlcclxuXHJcblx0dmFyIHByaXZhdGUgPSB7fVxyXG5cclxuXHR2YXIgZm9ybSA9ICQoJzxmb3JtPicpXHJcblx0XHQuYXBwZW5kVG8oZGl2KVxyXG5cdFx0Lm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldikge1xyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdGRpdi5kaWFsb2coJ2Nsb3NlJylcclxuXHRcdFx0aWYgKHR5cGVvZiBwcml2YXRlLm9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdHByaXZhdGUub25BcHBseSgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXHJcblx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxyXG5cdFx0XHR9XHRcdFx0XHRcclxuXHRcdH0pXHJcblxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy50ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0JChvcHRpb25zLnRlbXBsYXRlKS5hcHBlbmRUbyhmb3JtKVxyXG5cdH1cdFxyXG5cclxuXHRpZiAob3B0aW9ucy50ZW1wbGF0ZSBpbnN0YW5jZW9mIGpRdWVyeSkge1xyXG5cdFx0Y29uc29sZS5sb2cob3B0aW9ucy50ZW1wbGF0ZS5jaGlsZHJlbigpLmxlbmd0aClcclxuXHRcdG9wdGlvbnMudGVtcGxhdGUuY2hpbGRyZW4oKS5jbG9uZSgpLmFwcGVuZFRvKGZvcm0pXHJcblx0fVxyXG5cclxuXHR2YXIgc3VibWl0QnRuID0gJCgnPGlucHV0PicsIHt0eXBlOiAnc3VibWl0JywgaGlkZGVuOiB0cnVlfSkuYXBwZW5kVG8oZm9ybSlcclxuXHJcblx0dmFyIGRsZ09wdGlvbnMgPSAkLmV4dGVuZCh7XHJcblx0XHRhdXRvT3BlbjogZmFsc2UsXHJcblx0XHRtb2RhbDogdHJ1ZSxcclxuXHRcdHdpZHRoOiAnYXV0bycsXHRcclxuXHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0J0NhbmNlbCc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQodGhpcykuZGlhbG9nKCdjbG9zZScpXHJcblx0XHRcdH0sXHJcblx0XHRcdCdBcHBseSc6IGZ1bmN0aW9uKCkge1x0XHRcdFx0XHRcclxuXHRcdFx0XHRzdWJtaXRCdG4uY2xpY2soKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSwgb3B0aW9ucylcclxuXHJcblxyXG5cdGRpdi5kaWFsb2coZGxnT3B0aW9ucylcclxuXHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRzaG93OiBmdW5jdGlvbihvbkFwcGx5KSB7XHJcblx0XHRcdHByaXZhdGUub25BcHBseSA9IG9uQXBwbHlcdFx0XHRcclxuXHRcdFx0ZGl2LmRpYWxvZygnb3BlbicpXHRcdFx0XHJcblx0XHR9LFxyXG5cdFx0c2V0RGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRmb3JtLnNldEZvcm1EYXRhKGRhdGEpXHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcblxyXG4kLmZuLmJuRmluZD0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgIHJldHVybiB0aGlzLmZpbmQoc2VsZWN0b3IpLmFkZCh0aGlzLmZpbHRlcihzZWxlY3RvcikpXHJcbn1cclxuXHJcbiQuZm4uc2V0Q2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlzQWN0aXZlKSB7XHJcbiAgICBpZiAoaXNBY3RpdmUpIHtcclxuICAgICAgdGhpcy5hZGRDbGFzcyhjbGFzc05hbWUpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5yZW1vdmVDbGFzcyhjbGFzc05hbWUpXHJcbiAgICB9XHJcbn1cclxuXHJcbiQuZm4uc2V0VmlzaWJsZSA9IGZ1bmN0aW9uKGlzVmlzaWJsZSkge1xyXG4gICAgaWYgKGlzVmlzaWJsZSkge1xyXG4gICAgICB0aGlzLnNob3coKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMuaGlkZSgpXHJcbiAgICB9XHJcbn1cclxuXHJcbiQuZm4uaWZhY2UgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5nZXQoMCkuY3RybFxyXG59XHJcblxyXG4kLmZuLnNldERhdGEgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xyXG4gIGNvbnN0IGlmYWNlID0gdGhpcy5pZmFjZSgpXHJcblxyXG4gIGlmIChpZmFjZSAmJiB0eXBlb2YgaWZhY2Uuc2V0UHJvcCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBpZmFjZS5zZXRQcm9wKG5hbWUsIHZhbHVlKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZGF0YShuYW1lLCB2YWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbiQuZm4uc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09ICdJTlBVVCcgJiYgdGhpcy5hdHRyKCd0eXBlJykgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgdGhpcy5wcm9wKCdjaGVja2VkJywgdmFsdWUpXHJcbiAgICByZXR1cm5cclxuICB9ICBcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG5cclxuICBpZiAoaWZhY2UgJiYgdHlwZW9mIGlmYWNlLnNldFZhbHVlID09ICdmdW5jdGlvbicpIHtcclxuICAgIGlmYWNlLnNldFZhbHVlKHZhbHVlKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMudmFsKHZhbHVlKVxyXG4gIH1cclxufVxyXG5cclxuJC5mbi5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGNvbnN0IHR5cGUgPSB0aGlzLmF0dHIoJ3R5cGUnKVxyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09ICdJTlBVVCcgJiYgdHlwZSA9PSAnY2hlY2tib3gnKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wKCdjaGVja2VkJylcclxuICB9ICAgIFxyXG4gIGNvbnN0IGlmYWNlID0gdGhpcy5pZmFjZSgpXHJcbiAgaWYgKGlmYWNlICYmIHR5cGVvZiBpZmFjZS5nZXRWYWx1ZSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICByZXR1cm4gaWZhY2UuZ2V0VmFsdWUoKVxyXG4gIH1cclxuICB2YXIgcmV0ID0gdGhpcy52YWwoKVxyXG5cclxuICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdyYW5nZScpIHtcclxuICAgIHJldCA9IHBhcnNlRmxvYXQocmV0KVxyXG4gIH1cclxuICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbiQuZm4uZ2V0Rm9ybURhdGEgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgcmV0ID0ge31cclxuICB0aGlzLmZpbmQoJ1tuYW1lXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZWx0ID0gJCh0aGlzKVxyXG4gICAgdmFyIG5hbWUgPSBlbHQuYXR0cignbmFtZScpXHJcbiAgICByZXRbbmFtZV0gPSBlbHQuZ2V0VmFsdWUoKVxyXG5cclxuICB9KVxyXG5cclxuICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbiQuZm4ucmVzZXRGb3JtID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHRoaXMuZ2V0KDApLnRhZ05hbWUgPT0gXCJGT1JNXCIpIHtcclxuICAgIHRoaXMuZ2V0KDApLnJlc2V0KClcclxuICB9ICAgXHJcbn1cclxuXHJcbiQuZm4uc2V0Rm9ybURhdGEgPSBmdW5jdGlvbihkYXRhKSB7XHJcblxyXG4gIC8vY29uc29sZS5sb2coJ3NldEZvcm1EYXRhJywgZGF0YSlcclxuICB0aGlzLnJlc2V0Rm9ybSgpXHJcblxyXG4gIGZvcih2YXIgbmFtZSBpbiBkYXRhKSB7XHJcbiAgICB2YXIgdmFsdWUgPSBkYXRhW25hbWVdXHJcbiAgICB2YXIgZWx0ID0gdGhpcy5maW5kKGBbbmFtZT0ke25hbWV9XWApXHJcbiAgICBpZiAoZWx0Lmxlbmd0aCkge1xyXG4gICAgICBlbHQuc2V0VmFsdWUodmFsdWUpICAgICAgIFxyXG4gICAgfVxyXG5cclxuICBcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIlxyXG4oZnVuY3Rpb24oKXtcclxuXHJcbmxldCBzZXJ2aWNlcyA9IHt9XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTZXJ2aWNlcyhkZXBzKSB7XHJcblx0Ly9jb25zb2xlLmxvZygnW0NvcmVdIGdldFNlcnZpY2VzJywgZGVwcylcclxuXHRyZXR1cm4gZGVwcy5tYXAoZnVuY3Rpb24oZGVwTmFtZSkge1xyXG5cdFx0dmFyIHNydiA9IHNlcnZpY2VzW2RlcE5hbWVdXHJcblx0XHRpZiAoc3J2KSB7XHJcblx0XHRcdGlmIChzcnYuc3RhdHVzID09ICdub3Rsb2FkZWQnKSB7XHJcblx0XHRcdFx0dmFyIGRlcHMyID0gZ2V0U2VydmljZXMoc3J2LmRlcHMpXHJcblx0XHRcdFx0dmFyIGNvbmZpZyA9IHNydi5jb25maWcgfHwge31cclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgW0NvcmVdIGluc3RhbmNlIHNlcnZpY2UgJyR7ZGVwTmFtZX0nIHdpdGggY29uZmlnYCwgY29uZmlnKVxyXG5cdFx0XHRcdHZhciBhcmdzID0gW2NvbmZpZ10uY29uY2F0KGRlcHMyKVxyXG5cdFx0XHRcdHNydi5vYmogPSBzcnYuZm4uYXBwbHkobnVsbCwgYXJncylcclxuXHRcdFx0XHRzcnYuc3RhdHVzID0gJ3JlYWR5J1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBzcnYub2JqXHRcdFx0XHRcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvL3Nydi5zdGF0dXMgPSAnbm90cmVnaXN0ZXJlZCdcclxuXHRcdFx0dGhyb3coYFtDb3JlXSBzZXJ2aWNlICcke2RlcE5hbWV9JyBpcyBub3QgcmVnaXN0ZXJlZGApXHJcblx0XHR9XHJcblxyXG5cdH0pXHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY29uZmlndXJlU2VydmljZShuYW1lLCBjb25maWcpIHtcclxuXHRjb25zb2xlLmxvZygnW0NvcmVdIGNvbmZpZ3VyZVNlcnZpY2UnLCBuYW1lLCBjb25maWcpXHJcblx0aWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnIHx8IHR5cGVvZiBjb25maWcgIT0gJ29iamVjdCcpIHtcclxuXHRcdGNvbnNvbGUud2FybignW0NvcmVdIGNvbmZpZ3VyZVNlcnZpY2UgY2FsbGVkIHdpdGggYmFkIGFyZ3VtZW50cycpXHJcblx0XHRyZXR1cm5cclxuXHR9IFx0XHJcblxyXG5cdHZhciBzcnYgPSBzZXJ2aWNlc1tuYW1lXVxyXG5cdGlmIChzcnYpIHtcclxuXHRcdHNydi5jb25maWcgPSBjb25maWdcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR0aHJvdyhgW2NvbmZpZ3VyZVNlcnZpY2VdIHNlcnZpY2UgJyR7bmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHR9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlclNlcnZpY2UobmFtZSwgYXJnMSwgYXJnMikge1xyXG5cdHZhciBkZXBzID0gW11cclxuXHR2YXIgZm4gPSBhcmcxXHJcblx0aWYgKEFycmF5LmlzQXJyYXkoYXJnMSkpIHtcclxuXHRcdGRlcHMgPSBhcmcxXHJcblx0XHRmbiA9IGFyZzJcclxuXHR9XHJcblx0aWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnIHx8IHR5cGVvZiBmbiA9PSAndW5kZWZpbmVkJyB8fCAhQXJyYXkuaXNBcnJheShkZXBzKSkge1xyXG5cdFx0dGhyb3coJ1tDb3JlXSByZWdpc3RlclNlcnZpY2UgY2FsbGVkIHdpdGggYmFkIGFyZ3VtZW50cycpXHJcblx0fSBcclxuXHRjb25zb2xlLmxvZyhgW0NvcmVdIHJlZ2lzdGVyIHNlcnZpY2UgJyR7bmFtZX0nIHdpdGggZGVwc2AsIGRlcHMpXHJcblxyXG5cdHNlcnZpY2VzW25hbWVdID0ge2RlcHMsIGZuLCBzdGF0dXM6ICdub3Rsb2FkZWQnfVxyXG59XHJcblxyXG4kJC5zZXJ2aWNlID0ge1xyXG5cdHJlZ2lzdGVyU2VydmljZSxcclxuXHRjb25maWd1cmVTZXJ2aWNlLFxyXG5cdGdldFNlcnZpY2VzXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcblxyXG5mdW5jdGlvbiByZWFkVGV4dEZpbGUoZmlsZU5hbWUsIG9uUmVhZCkge1xyXG5cdHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG5cclxuXHRmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHR5cGVvZiBvblJlYWQgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRvblJlYWQoZmlsZVJlYWRlci5yZXN1bHQpXHJcblx0XHR9XHJcblx0fVxyXG5cdGZpbGVSZWFkZXIucmVhZEFzVGV4dChmaWxlTmFtZSlcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlYWRGaWxlQXNEYXRhVVJMKGZpbGVOYW1lLCBvblJlYWQpIHtcclxuXHR2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuXHJcblx0ZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0eXBlb2Ygb25SZWFkID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0b25SZWFkKGZpbGVSZWFkZXIucmVzdWx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZU5hbWUpXHJcbn1cclxuXHJcblxyXG52YXIgaW5wdXRGaWxlID0gJCgnPGlucHV0PicsIHt0eXBlOiAnZmlsZSd9KS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcblx0dmFyIG9uQXBwbHkgPSAkKHRoaXMpLmRhdGEoJ29uQXBwbHknKVxyXG5cdHZhciBmaWxlTmFtZSA9IHRoaXMuZmlsZXNbMF1cclxuXHRpZiAodHlwZW9mIG9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0b25BcHBseShmaWxlTmFtZSlcclxuXHR9XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBvcGVuRmlsZURpYWxvZyhvbkFwcGx5KSB7XHJcblx0aW5wdXRGaWxlLmRhdGEoJ29uQXBwbHknLCBvbkFwcGx5KVxyXG5cdGlucHV0RmlsZS5jbGljaygpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzSW1hZ2UoZmlsZU5hbWUpIHtcclxuXHRyZXR1cm4gKC9cXC4oZ2lmfGpwZ3xqcGVnfHBuZykkL2kpLnRlc3QoZmlsZU5hbWUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRhdGFVUkx0b0Jsb2IoZGF0YVVSTCkge1xyXG4gIC8vIERlY29kZSB0aGUgZGF0YVVSTFxyXG4gIGNvbnN0IFsgLCBtaW1lVHlwZSwgZW5jb2RhZ2UsIGRhdGFdID0gZGF0YVVSTC5zcGxpdCgvWzosO10vKVxyXG4gIGlmIChlbmNvZGFnZSAhPSAnYmFzZTY0Jykge1xyXG4gIFx0cmV0dXJuXHJcbiAgfVxyXG5cclxuICAvL2NvbnNvbGUubG9nKCdtaW1lVHlwZScsIG1pbWVUeXBlKVxyXG4gIC8vY29uc29sZS5sb2coJ2VuY29kYWdlJywgZW5jb2RhZ2UpXHJcbiAgLy9jb25zb2xlLmxvZygnZGF0YScsIGRhdGEpXHJcblxyXG4gIHZhciBiaW5hcnkgPSBhdG9iKGRhdGEpXHJcbiAvLyBDcmVhdGUgOC1iaXQgdW5zaWduZWQgYXJyYXlcclxuICB2YXIgYXJyYXkgPSBbXVxyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIHtcclxuICBcdGFycmF5LnB1c2goYmluYXJ5LmNoYXJDb2RlQXQoaSkpXHJcbiAgfVxyXG5cclxuICAvLyBSZXR1cm4gb3VyIEJsb2Igb2JqZWN0XHJcblx0cmV0dXJuIG5ldyBCbG9iKFsgbmV3IFVpbnQ4QXJyYXkoYXJyYXkpIF0sIHttaW1lVHlwZX0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTdHlsZShzdHlsZUZpbGVQYXRoLCBjYWxsYmFjaykge1x0XHJcblx0Ly9jb25zb2xlLmxvZygnW0NvcmVdIGxvYWRTdHlsZScsIHN0eWxlRmlsZVBhdGgpXHJcblxyXG5cdCQoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY3NzT2sgPSAkKCdoZWFkJykuZmluZChgbGlua1tocmVmPVwiJHtzdHlsZUZpbGVQYXRofVwiXWApLmxlbmd0aFxyXG5cdFx0aWYgKGNzc09rICE9IDEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYGxvYWRpbmcgJyR7c3R5bGVGaWxlUGF0aH0nIHN0eWxlYClcclxuXHRcdFx0JCgnPGxpbms+Jywge2hyZWY6IHN0eWxlRmlsZVBhdGgsIHJlbDogJ3N0eWxlc2hlZXQnfSlcclxuXHRcdFx0Lm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCcke3N0eWxlRmlsZVBhdGh9JyBsb2FkZWRgKVxyXG5cdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmFwcGVuZFRvKCQoJ2hlYWQnKSlcclxuXHRcdH1cclxuXHR9KVxyXG59XHJcblxyXG5cclxuXHJcblx0XHJcbmZ1bmN0aW9uIGlzT2JqZWN0KGEpIHtcclxuXHRyZXR1cm4gKHR5cGVvZiBhID09ICdvYmplY3QnKSAmJiAhQXJyYXkuaXNBcnJheShhKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1R5cGUodmFsdWUsIHR5cGUsIGlzT3B0aW9uYWwpIHtcclxuXHQvL2NvbnNvbGUubG9nKCdjaGVja1R5cGUnLHZhbHVlLCB0eXBlLCBpc09wdGlvbmFsKVxyXG5cdGlmICh0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCcgJiYgaXNPcHRpb25hbCA9PT0gdHJ1ZSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgdHlwZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSB0eXBlXHJcblx0fVxyXG5cclxuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuXHRcdGlmICghQXJyYXkuaXNBcnJheSh0eXBlKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZSAvLyBubyBpdGVtIHR5cGUgY2hlY2tpbmdcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiB2YWx1ZSkge1xyXG5cdFx0XHR2YXIgcmV0ID0gZmFsc2VcclxuXHRcdFx0Zm9yKGxldCB0IG9mIHR5cGUpIHtcclxuXHRcdFx0XHRyZXQgfD0gY2hlY2tUeXBlKGksIHQpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFyZXQpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAoaXNPYmplY3QodHlwZSkpIHtcclxuXHRcdGlmICghaXNPYmplY3QodmFsdWUpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBmIGluIHR5cGUpIHtcclxuXHJcblx0XHRcdC8vY29uc29sZS5sb2coJ2YnLCBmLCAndmFsdWUnLCB2YWx1ZSlcclxuXHRcdFx0dmFyIG5ld1R5cGUgPSB0eXBlW2ZdXHJcblxyXG5cdFx0XHR2YXIgaXNPcHRpb25hbCA9IGZhbHNlXHJcblx0XHRcdGlmIChmLnN0YXJ0c1dpdGgoJyQnKSkge1xyXG5cdFx0XHRcdGYgPSBmLnN1YnN0cigxKVxyXG5cdFx0XHRcdGlzT3B0aW9uYWwgPSB0cnVlXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFjaGVja1R5cGUodmFsdWVbZl0sIG5ld1R5cGUsIGlzT3B0aW9uYWwpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlXHJcbn1cdFxyXG5cclxuXHJcblxyXG4kJC51dGlsID0ge1xyXG5cdHJlYWRUZXh0RmlsZSxcclxuXHRyZWFkRmlsZUFzRGF0YVVSTCxcclxuXHRvcGVuRmlsZURpYWxvZyxcclxuXHRpc0ltYWdlLFxyXG5cdGRhdGFVUkx0b0Jsb2IsXHJcblx0bG9hZFN0eWxlLFxyXG5cdGNoZWNrVHlwZVxyXG59XHJcblxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5jbGFzcyBWaWV3Q29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIG9wdGlvbnMpIHtcclxuICAgIFx0Ly9jb25zb2xlLmxvZygnVmlld0NvbnRyb2xsZXInLCBvcHRpb25zKVxyXG4gICAgXHRpZiAodHlwZW9mIGVsdCA9PSAnc3RyaW5nJykge1xyXG4gICAgXHRcdGVsdCA9ICQoZWx0KVxyXG4gICAgXHR9XHJcblxyXG4gICAgXHRvcHRpb25zID0gJC5leHRlbmQoe30sIG9wdGlvbnMpXHJcbiAgICAgICAgdGhpcy5lbHQgPSBlbHRcclxuXHJcbiAgICAgICAgZWx0Lm9uKCdkYXRhOnVwZGF0ZScsIChldiwgbmFtZSwgdmFsdWUsIGV4Y2x1ZGVFbHQpID0+IHtcclxuICAgICAgICBcdC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gZGF0YTpjaGFuZ2UnLCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICBcdHRoaXMuc2V0RGF0YShuYW1lLCB2YWx1ZSwgZXhjbHVkZUVsdClcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0aGlzLm1vZGVsID0gJC5leHRlbmQoe30sIG9wdGlvbnMuZGF0YSlcclxuICAgICAgICB0aGlzLnJ1bGVzID0gJC5leHRlbmQoe30sIG9wdGlvbnMucnVsZXMpXHJcbiAgICAgICAgdGhpcy53YXRjaGVzID0gJC5leHRlbmQoe30sIG9wdGlvbnMud2F0Y2hlcylcclxuXHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgYXV0b21hdGljIHJ1bGVzIGZvciBjb21wdXRlZCBkYXRhIChha2EgZnVuY3Rpb24pXHJcbiAgICAgICAgZm9yKHZhciBrIGluIHRoaXMubW9kZWwpIHtcclxuICAgICAgICBcdHZhciBkYXRhID0gdGhpcy5tb2RlbFtrXVxyXG4gICAgICAgIFx0aWYgKHR5cGVvZiBkYXRhID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBcdFx0dmFyIGZ1bmNUZXh0ID0gZGF0YS50b1N0cmluZygpXHJcbiAgICAgICAgXHRcdC8vY29uc29sZS5sb2coJ2Z1bmNUZXh0JywgZnVuY1RleHQpXHJcbiAgICAgICAgXHRcdHZhciBydWxlcyA9IFtdXHJcbiAgICAgICAgXHRcdGZ1bmNUZXh0LnJlcGxhY2UoL3RoaXMuKFthLXpBLVowLTlfLV17MSx9KS9nLCBmdW5jdGlvbihtYXRjaCwgY2FwdHVyZU9uZSkge1xyXG4gICAgICAgIFx0XHRcdC8vY29uc29sZS5sb2coJ2NhcHR1cmVPbmUnLCBjYXB0dXJlT25lKVxyXG4gICAgICAgIFx0XHRcdHJ1bGVzLnB1c2goY2FwdHVyZU9uZSlcclxuICAgICAgICBcdFx0fSlcclxuICAgICAgICBcdFx0dGhpcy5ydWxlc1trXSA9IHJ1bGVzLnRvU3RyaW5nKClcclxuICAgICAgICBcdH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3J1bGVzJywgdGhpcy5ydWxlcylcclxuICAgICAgICB0aGlzLmN0eCA9ICQkLmJpbmRpbmcucHJvY2VzcyhlbHQsIHRoaXMubW9kZWwsICQkLmNvbnRyb2wuY3JlYXRlQ29udHJvbClcclxuXHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5ldmVudHMgPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgJCQuYmluZGluZy5wcm9jZXNzRXZlbnRzKGVsdCwgb3B0aW9ucy5ldmVudHMpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNjb3BlID0gJCQuYmluZGluZy5wcm9jZXNzQmluZGluZ3MoZWx0KVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3Njb3BlJywgdGhpcy5zY29wZSlcclxuICAgICAgIFxyXG5cclxuICAgIH0gXHJcblxyXG4gICAgc2V0RGF0YShhcmcxLCBhcmcyLCBleGNsdWRlRWx0KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSBzZXREYXRhJywgYXJnMSwgYXJnMilcclxuICAgICAgICB2YXIgZGF0YSA9IGFyZzFcclxuICAgICAgICBpZiAodHlwZW9mIGFyZzEgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICBcdGRhdGEgPSB7fVxyXG4gICAgICAgIFx0ZGF0YVthcmcxXSA9IGFyZzJcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSBzZXREYXRhJywgZGF0YSlcclxuICAgICAgICAkLmV4dGVuZCh0aGlzLm1vZGVsLCBkYXRhKVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ21vZGVsJywgdGhpcy5tb2RlbClcclxuICAgICAgICB0aGlzLnVwZGF0ZShPYmplY3Qua2V5cyhkYXRhKSwgZXhjbHVkZUVsdClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZmllbGRzTmFtZSwgZXhjbHVkZUVsdCkge1xyXG4gICAgXHQvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHVwZGF0ZScsIGZpZWxkc05hbWUpXHJcbiAgICBcdGlmICh0eXBlb2YgZmllbGRzTmFtZSA9PSAnc3RyaW5nJykge1xyXG4gICAgXHRcdGZpZWxkc05hbWUgPSBmaWVsZHNOYW1lLnNwbGl0KCcsJylcclxuICAgIFx0fVxyXG5cclxuXHJcbiAgICBcdGlmIChBcnJheS5pc0FycmF5KGZpZWxkc05hbWUpKSB7XHJcbiAgICBcdFx0dmFyIGZpZWxkc1NldCA9IHt9XHJcbiAgICBcdFx0ZmllbGRzTmFtZS5mb3JFYWNoKChmaWVsZCkgPT4ge1xyXG5cclxuICAgIFx0XHRcdHZhciB3YXRjaCA9IHRoaXMud2F0Y2hlc1tmaWVsZF1cclxuICAgIFx0XHRcdGlmICh0eXBlb2Ygd2F0Y2ggPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgXHRcdFx0XHR3YXRjaC5jYWxsKG51bGwsIHRoaXMubW9kZWxbZmllbGRdKVxyXG4gICAgXHRcdFx0fVxyXG4gICAgXHRcdFx0ZmllbGRzU2V0W2ZpZWxkXSA9IDFcclxuXHJcbiAgICBcdFx0XHRmb3IodmFyIHJ1bGUgaW4gdGhpcy5ydWxlcykge1xyXG4gICAgXHRcdFx0XHRpZiAodGhpcy5ydWxlc1tydWxlXS5zcGxpdCgnLCcpLmluZGV4T2YoZmllbGQpICE9IC0xKSB7XHJcbiAgICBcdFx0XHRcdFx0ZmllbGRzU2V0W3J1bGVdID0gMVxyXG4gICAgXHRcdFx0XHR9XHJcbiAgICBcdFx0XHR9XHJcbiAgICBcdFx0fSlcclxuXHJcblxyXG4gICAgXHRcdCQkLmJpbmRpbmcudXBkYXRlKHRoaXMuY3R4LCB0aGlzLm1vZGVsLCBPYmplY3Qua2V5cyhmaWVsZHNTZXQpLCBleGNsdWRlRWx0KVxyXG4gICAgXHR9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG4kJC52aWV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKGVsdCwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIG5ldyBWaWV3Q29udHJvbGxlcihlbHQsIG9wdGlvbnMpXHJcbn1cclxuXHJcblxyXG59KSgpO1xyXG4iXX0=
