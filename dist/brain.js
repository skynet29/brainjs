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
			$(template).appendTo(elt)
		}

		if (template instanceof jQuery) {
			template.children().clone().appendTo(elt)
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

  const funcName = 'set' + name.substr(0,1).toUpperCase() + name.substr(1)
  //console.log('funcName', funcName)

  if (iface && iface.props[name] && typeof iface[funcName] == 'function') {
    iface[funcName](value)
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
        if (elt.hasClass('CustomControl')) {
            console.error('don\'t use viewController on control tag')
            return
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwibGliL2JpbmRpbmcuanMiLCJsaWIvY29udHJvbC5qcyIsImxpYi9kaWFsb2dDb250cm9sbGVyIC5qcyIsImxpYi9mb3JtRGlhbG9nQ29udHJvbGxlci5qcyIsImxpYi9qcXVlcnktZXh0LmpzIiwibGliL3NlcnZpY2UuanMiLCJsaWIvdXRpbC5qcyIsImxpYi92aWV3Q29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJyYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XHJcblxyXG5cdHdpbmRvdy4kJCA9IHt9XHJcblx0XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VmFyVmFsdWUoZGF0YSwgdmFyTmFtZSkge1xyXG4gICAgdmFyIHJldCA9IGRhdGFcclxuICAgIGZvcihsZXQgZiBvZiB2YXJOYW1lLnNwbGl0KCcuJykpIHtcclxuICAgICAgXHJcbiAgICAgIGlmICh0eXBlb2YgcmV0ID09ICdvYmplY3QnICYmIGYgaW4gcmV0KSB7XHJcbiAgICAgICAgcmV0ID0gcmV0W2ZdXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKSB7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZygnW0NvcmVdIGdldFZhbHVlJywgdmFyTmFtZSwgY3R4KVxyXG5cclxuICAgIHZhciBub3QgPSBmYWxzZVxyXG4gICAgaWYgKHZhck5hbWUuc3RhcnRzV2l0aCgnIScpKSB7XHJcbiAgICAgIHZhck5hbWUgPSB2YXJOYW1lLnN1YnN0cigxKVxyXG4gICAgICBub3QgPSB0cnVlXHJcbiAgICB9ICAgICBcclxuXHJcbiAgICB2YXIgZnVuYyA9IGRhdGFbdmFyTmFtZV1cclxuICAgIHZhciB2YWx1ZVxyXG5cclxuICAgIGlmICh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHZhbHVlID0gZnVuYy5jYWxsKGRhdGEpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFsdWUgPSBnZXRWYXJWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdib29sZWFuJyAmJiBub3QpIHtcclxuICAgICAgdmFsdWUgPSAhdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWVcclxuICB9XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNwbGl0QXR0cihhdHRyVmFsdWUsIGNiaykge1xyXG4gIGF0dHJWYWx1ZS5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24oaSkge1xyXG4gICAgbGV0IFtuYW1lLCB2YWx1ZV0gPSBpLnNwbGl0KCc6JylcclxuICAgIGNiayhuYW1lLnRyaW0oKSwgdmFsdWUudHJpbSgpKVxyXG4gIH0pXHJcbn1cclxuXHJcblxyXG5jb25zdCBtYXAgPSB7XHJcbiAgJ2JuLWVhY2gnOiB7dHlwZTogM30sXHJcbiAgJ2JuLXRleHQnOiB7ZjogJ3RleHQnLCB0eXBlOiAxfSxcclxuICAnYm4taHRtbCc6IHtmOiAnaHRtbCcsIHR5cGU6IDF9LFxyXG4gICdibi12YWwnOiB7ZjogJ3NldFZhbHVlJywgdHlwZTogMX0sXHJcbiAgJ2JuLXNob3cnOiB7ZjogJ3NldFZpc2libGUnLCB0eXBlOiAxfSxcclxuICAnYm4tc3R5bGUnOiB7ZjogJ2NzcycsIHR5cGU6IDJ9LFxyXG4gICdibi1hdHRyJzoge2Y6ICdhdHRyJywgdHlwZTogMn0sXHJcbiAgJ2JuLXByb3AnOiB7ZjogJ3Byb3AnLCB0eXBlOiAyfSxcclxuICAnYm4tZGF0YSc6IHtmOiAnc2V0RGF0YScsIHR5cGU6IDJ9LFxyXG4gICdibi1jbGFzcyc6IHtmOiAnc2V0Q2xhc3MnLCB0eXBlOiAyfSxcclxuICAnYm4tY29udHJvbCc6IHt0eXBlOiA0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKGN0eCwgZGF0YSwgdmFycywgZXhjbHVkZUVsdCkge1xyXG5cclxuICAvL2NvbnNvbGUubG9nKCd1cGRhdGUnLCB2YXJzKVxyXG5cclxuICBpZiAodHlwZW9mIHZhcnMgPT0gJ3N0cmluZycpIHtcclxuICAgIHZhcnMgPSB2YXJzLnNwbGl0KCcsJylcclxuICB9XHJcblxyXG4gIHZhcnMuZm9yRWFjaChmdW5jdGlvbih2YXJpYWJsZSkge1xyXG4gICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyaWFibGUpXHJcbiAgICBcclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgIHVwZGF0ZShjdHgsIGRhdGEsIE9iamVjdC5rZXlzKHZhbHVlKS5tYXAoaSA9PiB2YXJpYWJsZSArICcuJyArIGkpLCBleGNsdWRlRWx0KVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKGN0eFt2YXJpYWJsZV0pIHtcclxuICAgICAgY3R4W3ZhcmlhYmxlXS5mb3JFYWNoKGZ1bmN0aW9uKGFjdGlvbikge1xyXG4gICAgICAgIGxldCB7dHlwZSwgZiwgZWx0LCBuYW1lLCB0ZW1wbGF0ZSwgaXRlcn0gPSBhY3Rpb25cclxuICAgICAgICBpZiAoZWx0ID09IGV4Y2x1ZGVFbHQpIHtcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSA9PSAxKSB7XHJcbiAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCB2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMikge1xyXG4gICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgbmFtZSwgdmFsdWUpXHJcbiAgICAgICAgfSAgIFxyXG4gICAgICAgIGlmICh0eXBlID09IDMgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgZWx0LmVtcHR5KClcclxuICAgICAgICAgICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGl0ZW1EYXRhID0gJC5leHRlbmQoe30sIGRhdGEpXHJcbiAgICAgICAgICAgICAgaXRlbURhdGFbaXRlcl0gPSBpdGVtXHJcbiAgICAgICAgICAgICAgdmFyICRpdGVtID0gdGVtcGxhdGUuY2xvbmUoKVxyXG4gICAgICAgICAgICAgIHByb2Nlc3MoJGl0ZW0sIGl0ZW1EYXRhKVxyXG4gICAgICAgICAgICAgIGVsdC5hcHBlbmQoJGl0ZW0pICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NFdmVudHMocm9vdCwgZXZlbnRzKSB7XHJcbiAgcm9vdC5maW5kKGBbYm4tZXZlbnRdYCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IGVsdCA9ICQodGhpcylcclxuICAgICAgbGV0IGF0dHJWYWx1ZSA9IGVsdC5hdHRyKCdibi1ldmVudCcpXHJcbiAgICAgIGVsdC5yZW1vdmVBdHRyKCdibi1ldmVudCcpXHJcbiAgICAgIFxyXG4gICAgICBzcGxpdEF0dHIoYXR0clZhbHVlLCBmdW5jdGlvbihldnROYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgIGxldCBmbiAgPSBldmVudHNbdmFsdWVdXHJcbiAgICAgICAgaWYgKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nKSB7ICAgICAgICBcclxuICAgICAgICAgIGNvbnN0IFtuYW1lLCBzZWxlY3Rvcl0gPSBldnROYW1lLnNwbGl0KCcuJylcclxuXHJcbiAgICAgICAgICBpZiAoc2VsZWN0b3IgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGVsdC5vbihuYW1lLCAnLicgKyBzZWxlY3RvciwgZm4pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZWx0Lm9uKG5hbWUsIGZuKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgXHJcbiAgICB9KVxyXG4gICAgIFxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzKHJvb3QsIGRhdGEsIGNyZWF0ZUNvbnRyb2wpIHtcclxuXHJcblxyXG4gIGxldCBjdHggPSB7fVxyXG4gIFxyXG4gIGZvcihsZXQgZGlyIGluIG1hcCkge1xyXG4gICAgXHJcblxyXG4gICAgcm9vdC5ibkZpbmQoYFske2Rpcn1dYCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IGVsdCA9ICQodGhpcylcclxuICAgICAgbGV0IGF0dHJWYWx1ZSA9IGVsdC5hdHRyKGRpcilcclxuICAgICAgZWx0LnJlbW92ZUF0dHIoZGlyKVxyXG5cclxuICAgICAgbGV0IHt0eXBlLCBmfSA9IG1hcFtkaXJdXHJcbiAgICAgIFxyXG4gICAgICBpZiAodHlwZSA9PSAxKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIGF0dHJWYWx1ZSlcclxuICAgICAgICAgIC8vZWx0LnRleHQoZGF0YVthdHRyVmFsdWVdKVxyXG4gICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCB2YWx1ZSlcclxuICAgICAgICB9IFxyXG4gICAgICAgIGlmIChkaXIgPT0gJ2JuLXZhbCcpIHtcclxuICAgICAgICAgIGxldCB1cGRhdGVFdnQgPSBlbHQuYXR0cignYm4tdXBkYXRlJylcclxuICAgICAgICAgIGlmICh1cGRhdGVFdnQpIHtcclxuICAgICAgICAgICAgZWx0LnJlbW92ZUF0dHIoJ2JuLXVwZGF0ZScpXHJcbiAgICAgICAgICAgIGVsdC5vbih1cGRhdGVFdnQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHJvb3QudHJpZ2dlcignZGF0YTp1cGRhdGUnLCBbYXR0clZhbHVlLCBlbHQuZ2V0VmFsdWUoKSwgZWx0XSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4W2F0dHJWYWx1ZV0gPSBjdHhbYXR0clZhbHVlXSB8fCBbXVxyXG4gICAgICAgIGN0eFthdHRyVmFsdWVdLnB1c2goe2YsIGVsdCwgdHlwZX0pICAgICAgICBcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGUgPT0gNCAmJiB0eXBlb2YgY3JlYXRlQ29udHJvbCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgY3JlYXRlQ29udHJvbChhdHRyVmFsdWUsIGVsdClcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGUgPT0gMikge1xyXG5cclxuICAgICAgICAgIHNwbGl0QXR0cihhdHRyVmFsdWUsIGZ1bmN0aW9uKG5hbWUsIHZhck5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgbmFtZSwgdmFsdWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3R4W3Zhck5hbWVdID0gY3R4W3Zhck5hbWVdIHx8IFtdXHJcbiAgICAgICAgICAgIGN0eFt2YXJOYW1lXS5wdXNoKHtmLCBlbHQsIHR5cGUsIG5hbWV9KSAgXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgfVxyXG4gICAgICAgXHJcbiAgICAgICBcclxuICAgICAgaWYgKHR5cGUgPT0gMykge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGVsdC5jaGlsZHJlbigpLnJlbW92ZSgpLmNsb25lKClcclxuICAgICAgICBsZXQgW2l0ZXIsICwgdmFyTmFtZV0gPSBhdHRyVmFsdWUuc3BsaXQoJyAnKVxyXG4gICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIHZhck5hbWUpXHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4W3Zhck5hbWVdID0gY3R4W3Zhck5hbWVdIHx8IFtdXHJcbiAgICAgICAgY3R4W3Zhck5hbWVdLnB1c2goe2VsdCwgdHlwZSwgdGVtcGxhdGUsIGl0ZXJ9KSAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGRhdGEgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgdmFyIGl0ZW1EYXRhID0gJC5leHRlbmQoe30sIGRhdGEpXHJcbiAgICAgICAgICAgaXRlbURhdGFbaXRlcl0gPSBpdGVtXHJcbiAgICAgICAgICAgdmFyICRpdGVtID0gdGVtcGxhdGUuY2xvbmUoKVxyXG4gICAgICAgICAgIHByb2Nlc3MoJGl0ZW0sIGl0ZW1EYXRhLCBjcmVhdGVDb250cm9sKVxyXG4gICAgICAgICAgIGVsdC5hcHBlbmQoJGl0ZW0pICAgICAgICAgIFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAgXHJcbiAgXHJcbiAgfVxyXG4gIFxyXG5cclxuICByZXR1cm4gY3R4XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NCaW5kaW5ncyhyb290KSB7XHJcblxyXG4gICAgdmFyIGRhdGEgPSB7fVxyXG5cclxuICAgIHJvb3QuYm5GaW5kKCdibi1iaW5kJywgdHJ1ZSwgZnVuY3Rpb24oZWx0LCB2YXJOYW1lKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coJ2JuLXRleHQnLCB2YXJOYW1lKVxyXG4gICAgICBkYXRhW3Zhck5hbWVdID0gZWx0XHJcbiAgICB9KVxyXG4gICAgcm9vdC5ibkZpbmQoJ2JuLWlmYWNlJywgdHJ1ZSwgZnVuY3Rpb24oZWx0LCB2YXJOYW1lKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coJ2JuLXRleHQnLCB2YXJOYW1lKVxyXG4gICAgICBkYXRhW3Zhck5hbWVdID0gZWx0LmlmYWNlKClcclxuICAgIH0pXHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIFxyXG59XHJcblxyXG4kJC5iaW5kaW5nID0ge1xyXG4gIHByb2Nlc3MsXHJcbiAgdXBkYXRlLFxyXG4gIHByb2Nlc3NFdmVudHMsXHJcbiAgcHJvY2Vzc0JpbmRpbmdzXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxubGV0IGNvbnRyb2xzID0ge31cclxuXHJcbmZ1bmN0aW9uIGlzRGVwc09rKGRlcHMpIHtcclxuXHRyZXR1cm4gZGVwcy5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XHJcblxyXG5cdFx0cmV0dXJuIHByZXYgJiYgKGN1ciAhPSB1bmRlZmluZWQpXHJcblx0fSwgdHJ1ZSlcdFx0XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckNvbnRyb2wobmFtZSwgb3B0aW9ucykge1xyXG5cdGlmICghJCQudXRpbC5jaGVja1R5cGUob3B0aW9ucywge1xyXG5cdFx0JGRlcHM6IFsnc3RyaW5nJ10sXHJcblx0XHRpbml0OiAnZnVuY3Rpb24nXHJcblx0fSkpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoYFtDb3JlXSByZWdpc3RlckNvbnRyb2w6IGJhZCBvcHRpb25zYCwgb3B0aW9ucylcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblxyXG5cdHZhciBkZXBzID0gb3B0aW9ucy5kZXBzIHx8IFtdXHJcblxyXG5cdGNvbnNvbGUubG9nKGBbQ29yZV0gcmVnaXN0ZXIgY29udHJvbCAnJHtuYW1lfScgd2l0aCBkZXBzYCwgZGVwcylcclxuXHJcblx0Y29udHJvbHNbbmFtZV0gPSB7ZGVwcywgb3B0aW9ucywgc3RhdHVzOiAnbm90bG9hZGVkJ31cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q29udHJvbChuYW1lKSB7XHJcblx0dmFyIHJldCA9IGNvbnRyb2xzW25hbWVdXHJcblx0aWYgKHJldCAmJiByZXQuc3RhdHVzID09ICdub3Rsb2FkZWQnKSB7XHJcblx0XHRyZXQuZGVwcyA9ICQkLnNlcnZpY2UuZ2V0U2VydmljZXMocmV0LmRlcHMpXHJcblx0XHRyZXQuc3RhdHVzID0gaXNEZXBzT2socmV0LmRlcHMpID8gJ29rJyA6ICdrbydcclxuXHR9XHJcblx0cmV0dXJuIHJldFxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDb250cm9sKGNvbnRyb2xOYW1lLCBlbHQpIHtcclxuXHRlbHQuYWRkQ2xhc3MoY29udHJvbE5hbWUpXHJcblx0ZWx0LmFkZENsYXNzKCdDdXN0b21Db250cm9sJykudW5pcXVlSWQoKVx0XHJcblx0dmFyIGN0cmwgPSBnZXRDb250cm9sKGNvbnRyb2xOYW1lKVxyXG5cdFx0XHJcblx0aWYgKGN0cmwgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHR0aHJvdyhgW0NvcmVdIGNvbnRyb2wgJyR7Y29udHJvbE5hbWV9JyBpcyBub3QgcmVnaXN0ZXJlZGApXHJcblx0fVxyXG5cdFx0Ly9jb25zb2xlLmxvZygnY3JlYXRlQ29udHJvbCcsIGNvbnRyb2xOYW1lLCBjdHJsKVxyXG5cdGlmIChjdHJsLnN0YXR1cyA9PT0gICdvaycpIHtcclxuXHRcdFxyXG5cdFx0dmFyIGlmYWNlID0ge1xyXG5cdFx0XHRwcm9wczoge30sXHJcblx0XHRcdG5hbWU6IGNvbnRyb2xOYW1lXHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHtpbml0LCBwcm9wcywgdGVtcGxhdGV9ID0gY3RybC5vcHRpb25zXHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9XHJcblxyXG5cdFx0T2JqZWN0LmtleXMocHJvcHMpLmZvckVhY2goZnVuY3Rpb24ocHJvcE5hbWUpIHtcclxuXHRcdFx0aWZhY2UucHJvcHNbcHJvcE5hbWVdID0gZWx0LmRhdGEocHJvcE5hbWUpIHx8IHByb3BzW3Byb3BOYW1lXVxyXG5cdFx0fSlcclxuXHJcblx0XHRpZiAodHlwZW9mIHRlbXBsYXRlID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdCQodGVtcGxhdGUpLmFwcGVuZFRvKGVsdClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuXHRcdFx0dGVtcGxhdGUuY2hpbGRyZW4oKS5jbG9uZSgpLmFwcGVuZFRvKGVsdClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZW9mIGluaXQgPT0gJ2Z1bmN0aW9uJykge1xyXG5cclxuXHRcdFx0dmFyIGFyZ3MgPSBbZWx0XS5jb25jYXQoY3RybC5kZXBzKVxyXG5cdFx0XHRjb25zb2xlLmxvZyhgW0NvcmVdIGluc3RhbmNlIGNvbnRyb2wgJyR7Y29udHJvbE5hbWV9J2ApXHJcblx0XHRcdGluaXQuYXBwbHkoaWZhY2UsIGFyZ3MpXHJcblxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUud2FybihgW0NvcmVdIGNvbnRyb2wgJyR7Y29udHJvbE5hbWV9JyBtaXNzaW5nIGluaXQgZnVuY3Rpb25gKVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRlbHQuZ2V0KDApLmN0cmwgPSBpZmFjZVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gaWZhY2VcdFx0XHRcdFxyXG5cdH1cclxuXHJcblxyXG5cclxufVxyXG5cclxuJCQuY29udHJvbCA9IHtcclxuXHRyZWdpc3RlckNvbnRyb2wsXHJcblx0Y3JlYXRlQ29udHJvbFxyXG59XHJcblxyXG59KSgpO1xyXG4iLCIkJC5kaWFsb2dDb250cm9sbGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBkaXYgPSAkKCc8ZGl2PicsIHt0aXRsZTogb3B0aW9ucy50aXRsZSB8fCAnRGlhbG9nJ30pXHJcblxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy50ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0JChvcHRpb25zLnRlbXBsYXRlKS5hcHBlbmRUbyhkaXYpXHJcblx0fVx0XHJcblxyXG5cdHZhciBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZGl2LCBvcHRpb25zKVxyXG5cclxuXHR2YXIgZGxnT3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuXHRcdGF1dG9PcGVuOiBmYWxzZSxcclxuXHRcdG1vZGFsOiB0cnVlLFxyXG5cdFx0d2lkdGg6ICdhdXRvJyxcdFx0XHJcblx0fSwgb3B0aW9ucylcclxuXHJcblx0dmFyIHByaXZhdGUgPSB7fVxyXG5cclxuXHQvL2NvbnNvbGUubG9nKCdkbGdPcHRpb25zJywgZGxnT3B0aW9ucylcclxuXHJcblx0ZGl2LmRpYWxvZyhkbGdPcHRpb25zKVxyXG5cclxuXHRjdHJsLnNob3cgPSBmdW5jdGlvbihvbkFwcGx5KSB7XHJcblx0XHRwcml2YXRlLm9uQXBwbHkgPSBvbkFwcGx5XHJcblx0XHRkaXYuZGlhbG9nKCdvcGVuJylcclxuXHR9XHJcblxyXG5cdGN0cmwuaGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZGl2LmRpYWxvZygnY2xvc2UnKVxyXG5cdH1cclxuXHJcblx0Y3RybC5hcHBseSA9IGZ1bmN0aW9uKHJldFZhbHVlKSB7XHJcblx0XHRjdHJsLmhpZGUoKVxyXG5cdFx0aWYgKHR5cGVvZiBwcml2YXRlLm9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRwcml2YXRlLm9uQXBwbHkocmV0VmFsdWUpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjdHJsLnNldE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbk5hbWUsIHZhbHVlKSB7XHJcblx0XHRkaXYuZGlhbG9nKCdvcHRpb24nLCBvcHRpb25OYW1lLCB2YWx1ZSlcclxuXHR9XHJcblxyXG5cdHJldHVybiBjdHJsXHJcbn07XHJcbiIsIiQkLmZvcm1EaWFsb2dDb250cm9sbGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBkaXYgPSAkKCc8ZGl2PicsIHt0aXRsZTogb3B0aW9ucy50aXRsZSB8fCAnRGlhbG9nJ30pXHJcblxyXG5cdHZhciBwcml2YXRlID0ge31cclxuXHJcblx0dmFyIGZvcm0gPSAkKCc8Zm9ybT4nKVxyXG5cdFx0LmFwcGVuZFRvKGRpdilcclxuXHRcdC5vbignc3VibWl0JywgZnVuY3Rpb24oZXYpIHtcclxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxyXG5cdFx0XHRkaXYuZGlhbG9nKCdjbG9zZScpXHJcblx0XHRcdGlmICh0eXBlb2YgcHJpdmF0ZS5vbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRwcml2YXRlLm9uQXBwbHkoJCh0aGlzKS5nZXRGb3JtRGF0YSgpKVxyXG5cdFx0XHRcdCQodGhpcykucmVzZXRGb3JtKClcclxuXHRcdFx0fVx0XHRcdFx0XHJcblx0XHR9KVxyXG5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMudGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdCQob3B0aW9ucy50ZW1wbGF0ZSkuYXBwZW5kVG8oZm9ybSlcclxuXHR9XHRcclxuXHJcblx0aWYgKG9wdGlvbnMudGVtcGxhdGUgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuXHRcdGNvbnNvbGUubG9nKG9wdGlvbnMudGVtcGxhdGUuY2hpbGRyZW4oKS5sZW5ndGgpXHJcblx0XHRvcHRpb25zLnRlbXBsYXRlLmNoaWxkcmVuKCkuY2xvbmUoKS5hcHBlbmRUbyhmb3JtKVxyXG5cdH1cclxuXHJcblx0dmFyIHN1Ym1pdEJ0biA9ICQoJzxpbnB1dD4nLCB7dHlwZTogJ3N1Ym1pdCcsIGhpZGRlbjogdHJ1ZX0pLmFwcGVuZFRvKGZvcm0pXHJcblxyXG5cdHZhciBkbGdPcHRpb25zID0gJC5leHRlbmQoe1xyXG5cdFx0YXV0b09wZW46IGZhbHNlLFxyXG5cdFx0bW9kYWw6IHRydWUsXHJcblx0XHR3aWR0aDogJ2F1dG8nLFx0XHJcblx0XHRidXR0b25zOiB7XHJcblx0XHRcdCdDYW5jZWwnOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKHRoaXMpLmRpYWxvZygnY2xvc2UnKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnQXBwbHknOiBmdW5jdGlvbigpIHtcdFx0XHRcdFx0XHJcblx0XHRcdFx0c3VibWl0QnRuLmNsaWNrKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sIG9wdGlvbnMpXHJcblxyXG5cclxuXHRkaXYuZGlhbG9nKGRsZ09wdGlvbnMpXHJcblxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0c2hvdzogZnVuY3Rpb24ob25BcHBseSkge1xyXG5cdFx0XHRwcml2YXRlLm9uQXBwbHkgPSBvbkFwcGx5XHRcdFx0XHJcblx0XHRcdGRpdi5kaWFsb2coJ29wZW4nKVx0XHRcdFxyXG5cdFx0fSxcclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0Zm9ybS5zZXRGb3JtRGF0YShkYXRhKVxyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuJC5mbi5ibkZpbmQ9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICByZXR1cm4gdGhpcy5maW5kKHNlbGVjdG9yKS5hZGQodGhpcy5maWx0ZXIoc2VsZWN0b3IpKVxyXG59XHJcblxyXG4kLmZuLnNldENsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpc0FjdGl2ZSkge1xyXG4gICAgaWYgKGlzQWN0aXZlKSB7XHJcbiAgICAgIHRoaXMuYWRkQ2xhc3MoY2xhc3NOYW1lKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKVxyXG4gICAgfVxyXG59XHJcblxyXG4kLmZuLnNldFZpc2libGUgPSBmdW5jdGlvbihpc1Zpc2libGUpIHtcclxuICAgIGlmIChpc1Zpc2libGUpIHtcclxuICAgICAgdGhpcy5zaG93KClcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmhpZGUoKVxyXG4gICAgfVxyXG59XHJcblxyXG4kLmZuLmlmYWNlID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuZ2V0KDApLmN0cmxcclxufVxyXG5cclxuJC5mbi5zZXREYXRhID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG5cclxuICBjb25zdCBmdW5jTmFtZSA9ICdzZXQnICsgbmFtZS5zdWJzdHIoMCwxKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHIoMSlcclxuICAvL2NvbnNvbGUubG9nKCdmdW5jTmFtZScsIGZ1bmNOYW1lKVxyXG5cclxuICBpZiAoaWZhY2UgJiYgaWZhY2UucHJvcHNbbmFtZV0gJiYgdHlwZW9mIGlmYWNlW2Z1bmNOYW1lXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBpZmFjZVtmdW5jTmFtZV0odmFsdWUpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5kYXRhKG5hbWUsIHZhbHVlKVxyXG4gIH1cclxufVxyXG5cclxuJC5mbi5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgaWYgKHRoaXMuZ2V0KDApLnRhZ05hbWUgPT0gJ0lOUFVUJyAmJiB0aGlzLmF0dHIoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKSB7XHJcbiAgICB0aGlzLnByb3AoJ2NoZWNrZWQnLCB2YWx1ZSlcclxuICAgIHJldHVyblxyXG4gIH0gIFxyXG4gIGNvbnN0IGlmYWNlID0gdGhpcy5pZmFjZSgpXHJcblxyXG4gIGlmIChpZmFjZSAmJiB0eXBlb2YgaWZhY2Uuc2V0VmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgaWZhY2Uuc2V0VmFsdWUodmFsdWUpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy52YWwodmFsdWUpXHJcbiAgfVxyXG59XHJcblxyXG4kLmZuLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XHJcbiAgY29uc3QgdHlwZSA9IHRoaXMuYXR0cigndHlwZScpXHJcbiAgaWYgKHRoaXMuZ2V0KDApLnRhZ05hbWUgPT0gJ0lOUFVUJyAmJiB0eXBlID09ICdjaGVja2JveCcpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3AoJ2NoZWNrZWQnKVxyXG4gIH0gICAgXHJcbiAgY29uc3QgaWZhY2UgPSB0aGlzLmlmYWNlKClcclxuICBpZiAoaWZhY2UgJiYgdHlwZW9mIGlmYWNlLmdldFZhbHVlID09ICdmdW5jdGlvbicpIHtcclxuICAgIHJldHVybiBpZmFjZS5nZXRWYWx1ZSgpXHJcbiAgfVxyXG4gIHZhciByZXQgPSB0aGlzLnZhbCgpXHJcblxyXG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3JhbmdlJykge1xyXG4gICAgcmV0ID0gcGFyc2VGbG9hdChyZXQpXHJcbiAgfVxyXG4gIHJldHVybiByZXRcclxufVxyXG5cclxuJC5mbi5nZXRGb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciByZXQgPSB7fVxyXG4gIHRoaXMuZmluZCgnW25hbWVdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIHZhciBlbHQgPSAkKHRoaXMpXHJcbiAgICB2YXIgbmFtZSA9IGVsdC5hdHRyKCduYW1lJylcclxuICAgIHJldFtuYW1lXSA9IGVsdC5nZXRWYWx1ZSgpXHJcblxyXG4gIH0pXHJcblxyXG4gIHJldHVybiByZXRcclxufVxyXG5cclxuJC5mbi5yZXNldEZvcm0gPSBmdW5jdGlvbigpIHtcclxuICBpZiAodGhpcy5nZXQoMCkudGFnTmFtZSA9PSBcIkZPUk1cIikge1xyXG4gICAgdGhpcy5nZXQoMCkucmVzZXQoKVxyXG4gIH0gICBcclxufVxyXG5cclxuJC5mbi5zZXRGb3JtRGF0YSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHJcbiAgLy9jb25zb2xlLmxvZygnc2V0Rm9ybURhdGEnLCBkYXRhKVxyXG4gIHRoaXMucmVzZXRGb3JtKClcclxuXHJcbiAgZm9yKHZhciBuYW1lIGluIGRhdGEpIHtcclxuICAgIHZhciB2YWx1ZSA9IGRhdGFbbmFtZV1cclxuICAgIHZhciBlbHQgPSB0aGlzLmZpbmQoYFtuYW1lPSR7bmFtZX1dYClcclxuICAgIGlmIChlbHQubGVuZ3RoKSB7XHJcbiAgICAgIGVsdC5zZXRWYWx1ZSh2YWx1ZSkgICAgICAgXHJcbiAgICB9XHJcblxyXG4gIFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxufSkoKTtcclxuIiwiXHJcbihmdW5jdGlvbigpe1xyXG5cclxubGV0IHNlcnZpY2VzID0ge31cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNlcnZpY2VzKGRlcHMpIHtcclxuXHQvL2NvbnNvbGUubG9nKCdbQ29yZV0gZ2V0U2VydmljZXMnLCBkZXBzKVxyXG5cdHJldHVybiBkZXBzLm1hcChmdW5jdGlvbihkZXBOYW1lKSB7XHJcblx0XHR2YXIgc3J2ID0gc2VydmljZXNbZGVwTmFtZV1cclxuXHRcdGlmIChzcnYpIHtcclxuXHRcdFx0aWYgKHNydi5zdGF0dXMgPT0gJ25vdGxvYWRlZCcpIHtcclxuXHRcdFx0XHR2YXIgZGVwczIgPSBnZXRTZXJ2aWNlcyhzcnYuZGVwcylcclxuXHRcdFx0XHR2YXIgY29uZmlnID0gc3J2LmNvbmZpZyB8fCB7fVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBbQ29yZV0gaW5zdGFuY2Ugc2VydmljZSAnJHtkZXBOYW1lfScgd2l0aCBjb25maWdgLCBjb25maWcpXHJcblx0XHRcdFx0dmFyIGFyZ3MgPSBbY29uZmlnXS5jb25jYXQoZGVwczIpXHJcblx0XHRcdFx0c3J2Lm9iaiA9IHNydi5mbi5hcHBseShudWxsLCBhcmdzKVxyXG5cdFx0XHRcdHNydi5zdGF0dXMgPSAncmVhZHknXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHNydi5vYmpcdFx0XHRcdFxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vc3J2LnN0YXR1cyA9ICdub3RyZWdpc3RlcmVkJ1xyXG5cdFx0XHR0aHJvdyhgW0NvcmVdIHNlcnZpY2UgJyR7ZGVwTmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHRcdH1cclxuXHJcblx0fSlcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBjb25maWd1cmVTZXJ2aWNlKG5hbWUsIGNvbmZpZykge1xyXG5cdGNvbnNvbGUubG9nKCdbQ29yZV0gY29uZmlndXJlU2VydmljZScsIG5hbWUsIGNvbmZpZylcclxuXHRpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgdHlwZW9mIGNvbmZpZyAhPSAnb2JqZWN0Jykge1xyXG5cdFx0Y29uc29sZS53YXJuKCdbQ29yZV0gY29uZmlndXJlU2VydmljZSBjYWxsZWQgd2l0aCBiYWQgYXJndW1lbnRzJylcclxuXHRcdHJldHVyblxyXG5cdH0gXHRcclxuXHJcblx0dmFyIHNydiA9IHNlcnZpY2VzW25hbWVdXHJcblx0aWYgKHNydikge1xyXG5cdFx0c3J2LmNvbmZpZyA9IGNvbmZpZ1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRocm93KGBbY29uZmlndXJlU2VydmljZV0gc2VydmljZSAnJHtuYW1lfScgaXMgbm90IHJlZ2lzdGVyZWRgKVxyXG5cdH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZShuYW1lLCBhcmcxLCBhcmcyKSB7XHJcblx0dmFyIGRlcHMgPSBbXVxyXG5cdHZhciBmbiA9IGFyZzFcclxuXHRpZiAoQXJyYXkuaXNBcnJheShhcmcxKSkge1xyXG5cdFx0ZGVwcyA9IGFyZzFcclxuXHRcdGZuID0gYXJnMlxyXG5cdH1cclxuXHRpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgdHlwZW9mIGZuID09ICd1bmRlZmluZWQnIHx8ICFBcnJheS5pc0FycmF5KGRlcHMpKSB7XHJcblx0XHR0aHJvdygnW0NvcmVdIHJlZ2lzdGVyU2VydmljZSBjYWxsZWQgd2l0aCBiYWQgYXJndW1lbnRzJylcclxuXHR9IFxyXG5cdGNvbnNvbGUubG9nKGBbQ29yZV0gcmVnaXN0ZXIgc2VydmljZSAnJHtuYW1lfScgd2l0aCBkZXBzYCwgZGVwcylcclxuXHJcblx0c2VydmljZXNbbmFtZV0gPSB7ZGVwcywgZm4sIHN0YXR1czogJ25vdGxvYWRlZCd9XHJcbn1cclxuXHJcbiQkLnNlcnZpY2UgPSB7XHJcblx0cmVnaXN0ZXJTZXJ2aWNlLFxyXG5cdGNvbmZpZ3VyZVNlcnZpY2UsXHJcblx0Z2V0U2VydmljZXNcclxufVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuXHJcbmZ1bmN0aW9uIHJlYWRUZXh0RmlsZShmaWxlTmFtZSwgb25SZWFkKSB7XHJcblx0dmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXHJcblxyXG5cdGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodHlwZW9mIG9uUmVhZCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdG9uUmVhZChmaWxlUmVhZGVyLnJlc3VsdClcclxuXHRcdH1cclxuXHR9XHJcblx0ZmlsZVJlYWRlci5yZWFkQXNUZXh0KGZpbGVOYW1lKVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcmVhZEZpbGVBc0RhdGFVUkwoZmlsZU5hbWUsIG9uUmVhZCkge1xyXG5cdHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG5cclxuXHRmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHR5cGVvZiBvblJlYWQgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRvblJlYWQoZmlsZVJlYWRlci5yZXN1bHQpXHJcblx0XHR9XHJcblx0fVxyXG5cdGZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlTmFtZSlcclxufVxyXG5cclxuXHJcbnZhciBpbnB1dEZpbGUgPSAkKCc8aW5wdXQ+Jywge3R5cGU6ICdmaWxlJ30pLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuXHR2YXIgb25BcHBseSA9ICQodGhpcykuZGF0YSgnb25BcHBseScpXHJcblx0dmFyIGZpbGVOYW1lID0gdGhpcy5maWxlc1swXVxyXG5cdGlmICh0eXBlb2Ygb25BcHBseSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRvbkFwcGx5KGZpbGVOYW1lKVxyXG5cdH1cclxufSlcclxuXHJcbmZ1bmN0aW9uIG9wZW5GaWxlRGlhbG9nKG9uQXBwbHkpIHtcclxuXHRpbnB1dEZpbGUuZGF0YSgnb25BcHBseScsIG9uQXBwbHkpXHJcblx0aW5wdXRGaWxlLmNsaWNrKClcclxufVxyXG5cclxuZnVuY3Rpb24gaXNJbWFnZShmaWxlTmFtZSkge1xyXG5cdHJldHVybiAoL1xcLihnaWZ8anBnfGpwZWd8cG5nKSQvaSkudGVzdChmaWxlTmFtZSlcclxufVxyXG5cclxuZnVuY3Rpb24gZGF0YVVSTHRvQmxvYihkYXRhVVJMKSB7XHJcbiAgLy8gRGVjb2RlIHRoZSBkYXRhVVJMXHJcbiAgY29uc3QgWyAsIG1pbWVUeXBlLCBlbmNvZGFnZSwgZGF0YV0gPSBkYXRhVVJMLnNwbGl0KC9bOiw7XS8pXHJcbiAgaWYgKGVuY29kYWdlICE9ICdiYXNlNjQnKSB7XHJcbiAgXHRyZXR1cm5cclxuICB9XHJcblxyXG4gIC8vY29uc29sZS5sb2coJ21pbWVUeXBlJywgbWltZVR5cGUpXHJcbiAgLy9jb25zb2xlLmxvZygnZW5jb2RhZ2UnLCBlbmNvZGFnZSlcclxuICAvL2NvbnNvbGUubG9nKCdkYXRhJywgZGF0YSlcclxuXHJcbiAgdmFyIGJpbmFyeSA9IGF0b2IoZGF0YSlcclxuIC8vIENyZWF0ZSA4LWJpdCB1bnNpZ25lZCBhcnJheVxyXG4gIHZhciBhcnJheSA9IFtdXHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykge1xyXG4gIFx0YXJyYXkucHVzaChiaW5hcnkuY2hhckNvZGVBdChpKSlcclxuICB9XHJcblxyXG4gIC8vIFJldHVybiBvdXIgQmxvYiBvYmplY3RcclxuXHRyZXR1cm4gbmV3IEJsb2IoWyBuZXcgVWludDhBcnJheShhcnJheSkgXSwge21pbWVUeXBlfSlcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFN0eWxlKHN0eWxlRmlsZVBhdGgsIGNhbGxiYWNrKSB7XHRcclxuXHQvL2NvbnNvbGUubG9nKCdbQ29yZV0gbG9hZFN0eWxlJywgc3R5bGVGaWxlUGF0aClcclxuXHJcblx0JChmdW5jdGlvbigpIHtcclxuXHRcdHZhciBjc3NPayA9ICQoJ2hlYWQnKS5maW5kKGBsaW5rW2hyZWY9XCIke3N0eWxlRmlsZVBhdGh9XCJdYCkubGVuZ3RoXHJcblx0XHRpZiAoY3NzT2sgIT0gMSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgbG9hZGluZyAnJHtzdHlsZUZpbGVQYXRofScgc3R5bGVgKVxyXG5cdFx0XHQkKCc8bGluaz4nLCB7aHJlZjogc3R5bGVGaWxlUGF0aCwgcmVsOiAnc3R5bGVzaGVldCd9KVxyXG5cdFx0XHQub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgJyR7c3R5bGVGaWxlUGF0aH0nIGxvYWRlZGApXHJcblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjaygpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQuYXBwZW5kVG8oJCgnaGVhZCcpKVxyXG5cdFx0fVxyXG5cdH0pXHJcbn1cclxuXHJcblxyXG5cclxuXHRcclxuZnVuY3Rpb24gaXNPYmplY3QoYSkge1xyXG5cdHJldHVybiAodHlwZW9mIGEgPT0gJ29iamVjdCcpICYmICFBcnJheS5pc0FycmF5KGEpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrVHlwZSh2YWx1ZSwgdHlwZSwgaXNPcHRpb25hbCkge1xyXG5cdC8vY29uc29sZS5sb2coJ2NoZWNrVHlwZScsdmFsdWUsIHR5cGUsIGlzT3B0aW9uYWwpXHJcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PSAndW5kZWZpbmVkJyAmJiBpc09wdGlvbmFsID09PSB0cnVlKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiB0eXBlID09ICdzdHJpbmcnKSB7XHJcblx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09IHR5cGVcclxuXHR9XHJcblxyXG5cdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHR5cGUpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0eXBlLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdHJldHVybiB0cnVlIC8vIG5vIGl0ZW0gdHlwZSBjaGVja2luZ1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBpIG9mIHZhbHVlKSB7XHJcblx0XHRcdHZhciByZXQgPSBmYWxzZVxyXG5cdFx0XHRmb3IobGV0IHQgb2YgdHlwZSkge1xyXG5cdFx0XHRcdHJldCB8PSBjaGVja1R5cGUoaSwgdClcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIXJldCkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmIChpc09iamVjdCh0eXBlKSkge1xyXG5cdFx0aWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGYgaW4gdHlwZSkge1xyXG5cclxuXHRcdFx0Ly9jb25zb2xlLmxvZygnZicsIGYsICd2YWx1ZScsIHZhbHVlKVxyXG5cdFx0XHR2YXIgbmV3VHlwZSA9IHR5cGVbZl1cclxuXHJcblx0XHRcdHZhciBpc09wdGlvbmFsID0gZmFsc2VcclxuXHRcdFx0aWYgKGYuc3RhcnRzV2l0aCgnJCcpKSB7XHJcblx0XHRcdFx0ZiA9IGYuc3Vic3RyKDEpXHJcblx0XHRcdFx0aXNPcHRpb25hbCA9IHRydWVcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWNoZWNrVHlwZSh2YWx1ZVtmXSwgbmV3VHlwZSwgaXNPcHRpb25hbCkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2VcclxufVx0XHJcblxyXG5cclxuXHJcbiQkLnV0aWwgPSB7XHJcblx0cmVhZFRleHRGaWxlLFxyXG5cdHJlYWRGaWxlQXNEYXRhVVJMLFxyXG5cdG9wZW5GaWxlRGlhbG9nLFxyXG5cdGlzSW1hZ2UsXHJcblx0ZGF0YVVSTHRvQmxvYixcclxuXHRsb2FkU3R5bGUsXHJcblx0Y2hlY2tUeXBlXHJcbn1cclxuXHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcbmNsYXNzIFZpZXdDb250cm9sbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsdCwgb3B0aW9ucykge1xyXG4gICAgXHQvL2NvbnNvbGUubG9nKCdWaWV3Q29udHJvbGxlcicsIG9wdGlvbnMpXHJcbiAgICBcdGlmICh0eXBlb2YgZWx0ID09ICdzdHJpbmcnKSB7XHJcbiAgICBcdFx0ZWx0ID0gJChlbHQpXHJcbiAgICBcdH1cclxuICAgICAgICBpZiAoZWx0Lmhhc0NsYXNzKCdDdXN0b21Db250cm9sJykpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZG9uXFwndCB1c2Ugdmlld0NvbnRyb2xsZXIgb24gY29udHJvbCB0YWcnKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgXHRvcHRpb25zID0gJC5leHRlbmQoe30sIG9wdGlvbnMpXHJcbiAgICAgICAgdGhpcy5lbHQgPSBlbHRcclxuXHJcbiAgICAgICAgZWx0Lm9uKCdkYXRhOnVwZGF0ZScsIChldiwgbmFtZSwgdmFsdWUsIGV4Y2x1ZGVFbHQpID0+IHtcclxuICAgICAgICBcdC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gZGF0YTpjaGFuZ2UnLCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICBcdHRoaXMuc2V0RGF0YShuYW1lLCB2YWx1ZSwgZXhjbHVkZUVsdClcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0aGlzLm1vZGVsID0gJC5leHRlbmQoe30sIG9wdGlvbnMuZGF0YSlcclxuICAgICAgICB0aGlzLnJ1bGVzID0gJC5leHRlbmQoe30sIG9wdGlvbnMucnVsZXMpXHJcbiAgICAgICAgdGhpcy53YXRjaGVzID0gJC5leHRlbmQoe30sIG9wdGlvbnMud2F0Y2hlcylcclxuXHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgYXV0b21hdGljIHJ1bGVzIGZvciBjb21wdXRlZCBkYXRhIChha2EgZnVuY3Rpb24pXHJcbiAgICAgICAgZm9yKHZhciBrIGluIHRoaXMubW9kZWwpIHtcclxuICAgICAgICBcdHZhciBkYXRhID0gdGhpcy5tb2RlbFtrXVxyXG4gICAgICAgIFx0aWYgKHR5cGVvZiBkYXRhID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBcdFx0dmFyIGZ1bmNUZXh0ID0gZGF0YS50b1N0cmluZygpXHJcbiAgICAgICAgXHRcdC8vY29uc29sZS5sb2coJ2Z1bmNUZXh0JywgZnVuY1RleHQpXHJcbiAgICAgICAgXHRcdHZhciBydWxlcyA9IFtdXHJcbiAgICAgICAgXHRcdGZ1bmNUZXh0LnJlcGxhY2UoL3RoaXMuKFthLXpBLVowLTlfLV17MSx9KS9nLCBmdW5jdGlvbihtYXRjaCwgY2FwdHVyZU9uZSkge1xyXG4gICAgICAgIFx0XHRcdC8vY29uc29sZS5sb2coJ2NhcHR1cmVPbmUnLCBjYXB0dXJlT25lKVxyXG4gICAgICAgIFx0XHRcdHJ1bGVzLnB1c2goY2FwdHVyZU9uZSlcclxuICAgICAgICBcdFx0fSlcclxuICAgICAgICBcdFx0dGhpcy5ydWxlc1trXSA9IHJ1bGVzLnRvU3RyaW5nKClcclxuICAgICAgICBcdH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3J1bGVzJywgdGhpcy5ydWxlcylcclxuICAgICAgICB0aGlzLmN0eCA9ICQkLmJpbmRpbmcucHJvY2VzcyhlbHQsIHRoaXMubW9kZWwsICQkLmNvbnRyb2wuY3JlYXRlQ29udHJvbClcclxuXHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5ldmVudHMgPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgJCQuYmluZGluZy5wcm9jZXNzRXZlbnRzKGVsdCwgb3B0aW9ucy5ldmVudHMpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNjb3BlID0gJCQuYmluZGluZy5wcm9jZXNzQmluZGluZ3MoZWx0KVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3Njb3BlJywgdGhpcy5zY29wZSlcclxuICAgICAgIFxyXG5cclxuICAgIH0gXHJcblxyXG4gICAgc2V0RGF0YShhcmcxLCBhcmcyLCBleGNsdWRlRWx0KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSBzZXREYXRhJywgYXJnMSwgYXJnMilcclxuICAgICAgICB2YXIgZGF0YSA9IGFyZzFcclxuICAgICAgICBpZiAodHlwZW9mIGFyZzEgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICBcdGRhdGEgPSB7fVxyXG4gICAgICAgIFx0ZGF0YVthcmcxXSA9IGFyZzJcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSBzZXREYXRhJywgZGF0YSlcclxuICAgICAgICAkLmV4dGVuZCh0aGlzLm1vZGVsLCBkYXRhKVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ21vZGVsJywgdGhpcy5tb2RlbClcclxuICAgICAgICB0aGlzLnVwZGF0ZShPYmplY3Qua2V5cyhkYXRhKSwgZXhjbHVkZUVsdClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZmllbGRzTmFtZSwgZXhjbHVkZUVsdCkge1xyXG4gICAgXHQvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHVwZGF0ZScsIGZpZWxkc05hbWUpXHJcbiAgICBcdGlmICh0eXBlb2YgZmllbGRzTmFtZSA9PSAnc3RyaW5nJykge1xyXG4gICAgXHRcdGZpZWxkc05hbWUgPSBmaWVsZHNOYW1lLnNwbGl0KCcsJylcclxuICAgIFx0fVxyXG5cclxuXHJcbiAgICBcdGlmIChBcnJheS5pc0FycmF5KGZpZWxkc05hbWUpKSB7XHJcbiAgICBcdFx0dmFyIGZpZWxkc1NldCA9IHt9XHJcbiAgICBcdFx0ZmllbGRzTmFtZS5mb3JFYWNoKChmaWVsZCkgPT4ge1xyXG5cclxuICAgIFx0XHRcdHZhciB3YXRjaCA9IHRoaXMud2F0Y2hlc1tmaWVsZF1cclxuICAgIFx0XHRcdGlmICh0eXBlb2Ygd2F0Y2ggPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgXHRcdFx0XHR3YXRjaC5jYWxsKG51bGwsIHRoaXMubW9kZWxbZmllbGRdKVxyXG4gICAgXHRcdFx0fVxyXG4gICAgXHRcdFx0ZmllbGRzU2V0W2ZpZWxkXSA9IDFcclxuXHJcbiAgICBcdFx0XHRmb3IodmFyIHJ1bGUgaW4gdGhpcy5ydWxlcykge1xyXG4gICAgXHRcdFx0XHRpZiAodGhpcy5ydWxlc1tydWxlXS5zcGxpdCgnLCcpLmluZGV4T2YoZmllbGQpICE9IC0xKSB7XHJcbiAgICBcdFx0XHRcdFx0ZmllbGRzU2V0W3J1bGVdID0gMVxyXG4gICAgXHRcdFx0XHR9XHJcbiAgICBcdFx0XHR9XHJcbiAgICBcdFx0fSlcclxuXHJcblxyXG4gICAgXHRcdCQkLmJpbmRpbmcudXBkYXRlKHRoaXMuY3R4LCB0aGlzLm1vZGVsLCBPYmplY3Qua2V5cyhmaWVsZHNTZXQpLCBleGNsdWRlRWx0KVxyXG4gICAgXHR9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG4kJC52aWV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKGVsdCwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIG5ldyBWaWV3Q29udHJvbGxlcihlbHQsIG9wdGlvbnMpXHJcbn1cclxuXHJcblxyXG59KSgpO1xyXG4iXX0=
