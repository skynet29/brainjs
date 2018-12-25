(function(){

	window.$$ = {}
	
})();
$$.control.registerControl('brainjs.checkgroup', {
	init: function(elt) {

		elt.on('click', 'input[type=checkbox]', function() {
			elt.trigger('input')
		})

		this.getValue = function() {
			var ret = []
			elt.find('input[type=checkbox]:checked').each(function() {
				ret.push($(this).val())
			})	
			return ret	
		}

		this.setValue = function(value) {
			if (Array.isArray(value)) {
				elt.find('input[type=checkbox]').each(function() {
					$(this).prop('checked', value.indexOf($(this).val()) >= 0)
				})
			}		
		}

		this.setValue(elt.val())

	}

});








$$.control.registerControl('brainjs.inputgroup', {
	init: function(elt) {

		var id = elt.children('input').uniqueId().attr('id')
		elt.children('label').attr('for', id)
	}
});

$$.control.registerControl('brainjs.navbar', {
	props: {
		activeColor: 'w3-green',
		type: 'horizontal'
	},
	init: function(elt) {

		const {activeColor, type} = this.props

		elt.addClass((type == 'vertical') ? 'w3-bar-block': 'w3-bar')
		elt.children('a').each(function() {
			$(this).addClass('w3-bar-item w3-button')
		})

		const newRoute = $$.getNewRoute()
		elt.children(`a[href="#${newRoute}"]`).addClass(activeColor)

		$(window).on('popstate', function(evt) {
			//console.log('[NavbarControl] routeChange', newRoute)
			const newRoute = $$.getNewRoute()

			elt.children(`a.${activeColor}`).removeClass(activeColor)	
			elt.children(`a[href="#${newRoute}"]`).addClass(activeColor)

		})	

	}

});








$$.control.registerControl('brainjs.radiogroup', {
	init: function(elt) {

		elt.on('click', 'input[type=radio]', function() {
			//console.log('radiogroup click')
			elt.find('input[type=radio]:checked').prop('checked', false)
			$(this).prop('checked', true)
			elt.trigger('input')
		})
		

		this.getValue = function() {
			return elt.find('input[type=radio]:checked').val()
		}

		this.setValue = function(value) {
			elt.find('input[type=radio]').each(function() {
				$(this).prop('checked', value === $(this).val())
			})			
		}

		this.setValue(elt.val())
	}
});







(function() {

	function matchRoute(route, pattern) {
		//console.log('matchRoute', route, pattern)
		var routeSplit = route.split('/')
		var patternSplit = pattern.split('/')
		//console.log(routeSplit, patternSplit)
		var ret = {}

		if (routeSplit.length != patternSplit.length)
			return null

		for(var idx = 0; idx < patternSplit.length; idx++) {
			var path = patternSplit[idx]
			//console.log('path', path)
			if (path.substr(0, 1) === ':') {
				if (routeSplit[idx].length === 0)
					return null
				ret[path.substr(1)] = routeSplit[idx]
			}
			else if (path !== routeSplit[idx]) {
				return null
			}

		}

		return ret
	}


	function getNewRoute() {
		const href = location.href
		const idx = href.indexOf('#')
		const newRoute = (idx !== -1)  ? href.substr(idx+1) : '/'
		
		return newRoute
	}

	$$.getNewRoute = getNewRoute

	$$.control.registerControl('brainjs.router', {

		props: {
			routes: []
		},
		init: function(elt) {


			$(window).on('popstate', function(evt) {
				console.log('[router] popstate')
				processRoute(getNewRoute())
			})


			var routes = this.props.routes

			if (!Array.isArray(routes)) {
				console.warn('[router] bad routes')
				return
			}

			processRoute(getNewRoute())

			function processRoute(newRoute) {
				console.log('[router] processRoute', newRoute, routes)

				for(var route of routes) {
					var params = matchRoute(newRoute, route.href)
					//console.log(`route: ${route.href}, params`, params)
					if (params != null) {
						//console.log('[RouterControl] params', params)
						if (typeof route.redirect == 'string') {
							console.log('[router] redirect to ', route.redirect)
							location.href = '#' + route.redirect							
						}
						else if (typeof route.control == 'string') {

							var newCtrl = $('<div>')
							$$.control.createControl(route.control, newCtrl)
							elt.safeEmpty().append(newCtrl)	
						}
						return true
					}	
				}
				console.warn('[router] No route found !')
				return false

			}		


		}

	})

})();



$$.control.registerControl('brainjs.tabs', {
	init: function(elt) {

		var ul = $('<ul>').prependTo(elt)

		elt.children('div').each(function() {
			var title = $(this).attr('title')
			var id = $(this).uniqueId().attr('id')
			var li = $('<li>')
				.attr('title', title)
				.append($('<a>', {href: '#' + id}).text(title))
				.appendTo(ul)
			if ($(this).attr('data-removable') != undefined) {
				li.append($('<span>', {class: 'ui-icon ui-icon-close'}))
			}
		})		

		elt.tabs()

	}

});







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
  root.bnFind(`[bn-event]`).each(function() {
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
	elt.addClass(controlName.replace('.', '-'))
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
			init.apply(iface, args)
			console.log(`[Core] instance control '${controlName}' with props`, iface.props)

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

	ctrl.destroy = function() {
		div.dialog('destroy')
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
		},

		destroy: function() {
			div.dialog('destroy')
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
  else if (iface && $$.isViewController(iface.ctrl) && iface.ctrl.model[name]) {
    iface.ctrl.setData(name, value)
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

$.fn.safeEmpty = function() {
  this.find('.CustomControl').each(function() {
    const iface = $(this).iface()

    if (typeof iface.dispose == 'function') {
      iface.dispose()
    }
  })

  this.empty()

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

$$.isViewController = function(o) {
    return o instanceof ViewController
}

})();


$$.service.registerService('brainjs.http', function() {
	return {
		get(url) {
			return $.getJSON(url)
		},


		post(url, data) {
			return $.ajax({
				method: 'POST',
				url : url,
				contentType: 'application/json',
				data: JSON.stringify(data)
			})
		},

		put(url, data) {
			return $.ajax({
				method: 'PUT',
				url : url,
				contentType: 'application/json',
				data: JSON.stringify(data)
			})
		},			

		delete(url) {
			return $.ajax({
				method: 'DELETE',
				url : url,
			})				
		},

		postFormData(url, fd) {
			return $.ajax({
			  url: url,
			  type: "POST",
			  data: fd,
			  processData: false,  // indique à jQuery de ne pas traiter les données
			  contentType: false   // indique à jQuery de ne pas configurer le contentType
			})				
		}

		
	}
});







//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiY29udHJvbHMvY2hlY2tncm91cC5qcyIsImNvbnRyb2xzL2lucHV0Z3JvdXAuanMiLCJjb250cm9scy9uYXZiYXIuanMiLCJjb250cm9scy9yYWRpb2dyb3VwLmpzIiwiY29udHJvbHMvcm91dGVyLmpzIiwiY29udHJvbHMvdGFicy5qcyIsImxpYi9iaW5kaW5nLmpzIiwibGliL2NvbnRyb2wuanMiLCJsaWIvZGlhbG9nQ29udHJvbGxlciAuanMiLCJsaWIvZm9ybURpYWxvZ0NvbnRyb2xsZXIuanMiLCJsaWIvanF1ZXJ5LWV4dC5qcyIsImxpYi9zZXJ2aWNlLmpzIiwibGliL3V0aWwuanMiLCJsaWIvdmlld0NvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9odHRwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJicmFpbmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XHJcblxyXG5cdHdpbmRvdy4kJCA9IHt9XHJcblx0XHJcbn0pKCk7IiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMuY2hlY2tncm91cCcsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRlbHQub24oJ2NsaWNrJywgJ2lucHV0W3R5cGU9Y2hlY2tib3hdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRlbHQudHJpZ2dlcignaW5wdXQnKVxuXHRcdH0pXG5cblx0XHR0aGlzLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcmV0ID0gW11cblx0XHRcdGVsdC5maW5kKCdpbnB1dFt0eXBlPWNoZWNrYm94XTpjaGVja2VkJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0LnB1c2goJCh0aGlzKS52YWwoKSlcblx0XHRcdH0pXHRcblx0XHRcdHJldHVybiByZXRcdFxuXHRcdH1cblxuXHRcdHRoaXMuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdGVsdC5maW5kKCdpbnB1dFt0eXBlPWNoZWNrYm94XScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdmFsdWUuaW5kZXhPZigkKHRoaXMpLnZhbCgpKSA+PSAwKVxuXHRcdFx0XHR9KVxuXHRcdFx0fVx0XHRcblx0XHR9XG5cblx0XHR0aGlzLnNldFZhbHVlKGVsdC52YWwoKSlcblxuXHR9XG5cbn0pO1xuXG5cblxuXG5cblxuIiwiXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5pbnB1dGdyb3VwJywge1xuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHZhciBpZCA9IGVsdC5jaGlsZHJlbignaW5wdXQnKS51bmlxdWVJZCgpLmF0dHIoJ2lkJylcblx0XHRlbHQuY2hpbGRyZW4oJ2xhYmVsJykuYXR0cignZm9yJywgaWQpXG5cdH1cbn0pO1xuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMubmF2YmFyJywge1xuXHRwcm9wczoge1xuXHRcdGFjdGl2ZUNvbG9yOiAndzMtZ3JlZW4nLFxuXHRcdHR5cGU6ICdob3Jpem9udGFsJ1xuXHR9LFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IHthY3RpdmVDb2xvciwgdHlwZX0gPSB0aGlzLnByb3BzXG5cblx0XHRlbHQuYWRkQ2xhc3MoKHR5cGUgPT0gJ3ZlcnRpY2FsJykgPyAndzMtYmFyLWJsb2NrJzogJ3czLWJhcicpXG5cdFx0ZWx0LmNoaWxkcmVuKCdhJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ3czLWJhci1pdGVtIHczLWJ1dHRvbicpXG5cdFx0fSlcblxuXHRcdGNvbnN0IG5ld1JvdXRlID0gJCQuZ2V0TmV3Um91dGUoKVxuXHRcdGVsdC5jaGlsZHJlbihgYVtocmVmPVwiIyR7bmV3Um91dGV9XCJdYCkuYWRkQ2xhc3MoYWN0aXZlQ29sb3IpXG5cblx0XHQkKHdpbmRvdykub24oJ3BvcHN0YXRlJywgZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdbTmF2YmFyQ29udHJvbF0gcm91dGVDaGFuZ2UnLCBuZXdSb3V0ZSlcblx0XHRcdGNvbnN0IG5ld1JvdXRlID0gJCQuZ2V0TmV3Um91dGUoKVxuXG5cdFx0XHRlbHQuY2hpbGRyZW4oYGEuJHthY3RpdmVDb2xvcn1gKS5yZW1vdmVDbGFzcyhhY3RpdmVDb2xvcilcdFxuXHRcdFx0ZWx0LmNoaWxkcmVuKGBhW2hyZWY9XCIjJHtuZXdSb3V0ZX1cIl1gKS5hZGRDbGFzcyhhY3RpdmVDb2xvcilcblxuXHRcdH0pXHRcblxuXHR9XG5cbn0pO1xuXG5cblxuXG5cblxuIiwiXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5yYWRpb2dyb3VwJywge1xuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGVsdC5vbignY2xpY2snLCAnaW5wdXRbdHlwZT1yYWRpb10nLCBmdW5jdGlvbigpIHtcblx0XHRcdC8vY29uc29sZS5sb2coJ3JhZGlvZ3JvdXAgY2xpY2snKVxuXHRcdFx0ZWx0LmZpbmQoJ2lucHV0W3R5cGU9cmFkaW9dOmNoZWNrZWQnKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpXG5cdFx0XHQkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKVxuXHRcdFx0ZWx0LnRyaWdnZXIoJ2lucHV0Jylcblx0XHR9KVxuXHRcdFxuXG5cdFx0dGhpcy5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGVsdC5maW5kKCdpbnB1dFt0eXBlPXJhZGlvXTpjaGVja2VkJykudmFsKClcblx0XHR9XG5cblx0XHR0aGlzLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGVsdC5maW5kKCdpbnB1dFt0eXBlPXJhZGlvXScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQodGhpcykucHJvcCgnY2hlY2tlZCcsIHZhbHVlID09PSAkKHRoaXMpLnZhbCgpKVxuXHRcdFx0fSlcdFx0XHRcblx0XHR9XG5cblx0XHR0aGlzLnNldFZhbHVlKGVsdC52YWwoKSlcblx0fVxufSk7XG5cblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gbWF0Y2hSb3V0ZShyb3V0ZSwgcGF0dGVybikge1xuXHRcdC8vY29uc29sZS5sb2coJ21hdGNoUm91dGUnLCByb3V0ZSwgcGF0dGVybilcblx0XHR2YXIgcm91dGVTcGxpdCA9IHJvdXRlLnNwbGl0KCcvJylcblx0XHR2YXIgcGF0dGVyblNwbGl0ID0gcGF0dGVybi5zcGxpdCgnLycpXG5cdFx0Ly9jb25zb2xlLmxvZyhyb3V0ZVNwbGl0LCBwYXR0ZXJuU3BsaXQpXG5cdFx0dmFyIHJldCA9IHt9XG5cblx0XHRpZiAocm91dGVTcGxpdC5sZW5ndGggIT0gcGF0dGVyblNwbGl0Lmxlbmd0aClcblx0XHRcdHJldHVybiBudWxsXG5cblx0XHRmb3IodmFyIGlkeCA9IDA7IGlkeCA8IHBhdHRlcm5TcGxpdC5sZW5ndGg7IGlkeCsrKSB7XG5cdFx0XHR2YXIgcGF0aCA9IHBhdHRlcm5TcGxpdFtpZHhdXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdwYXRoJywgcGF0aClcblx0XHRcdGlmIChwYXRoLnN1YnN0cigwLCAxKSA9PT0gJzonKSB7XG5cdFx0XHRcdGlmIChyb3V0ZVNwbGl0W2lkeF0ubGVuZ3RoID09PSAwKVxuXHRcdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHRcdHJldFtwYXRoLnN1YnN0cigxKV0gPSByb3V0ZVNwbGl0W2lkeF1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHBhdGggIT09IHJvdXRlU3BsaXRbaWR4XSkge1xuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldFxuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXROZXdSb3V0ZSgpIHtcblx0XHRjb25zdCBocmVmID0gbG9jYXRpb24uaHJlZlxuXHRcdGNvbnN0IGlkeCA9IGhyZWYuaW5kZXhPZignIycpXG5cdFx0Y29uc3QgbmV3Um91dGUgPSAoaWR4ICE9PSAtMSkgID8gaHJlZi5zdWJzdHIoaWR4KzEpIDogJy8nXG5cdFx0XG5cdFx0cmV0dXJuIG5ld1JvdXRlXG5cdH1cblxuXHQkJC5nZXROZXdSb3V0ZSA9IGdldE5ld1JvdXRlXG5cblx0JCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMucm91dGVyJywge1xuXG5cdFx0cHJvcHM6IHtcblx0XHRcdHJvdXRlczogW11cblx0XHR9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cblx0XHRcdCQod2luZG93KS5vbigncG9wc3RhdGUnLCBmdW5jdGlvbihldnQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1tyb3V0ZXJdIHBvcHN0YXRlJylcblx0XHRcdFx0cHJvY2Vzc1JvdXRlKGdldE5ld1JvdXRlKCkpXG5cdFx0XHR9KVxuXG5cblx0XHRcdHZhciByb3V0ZXMgPSB0aGlzLnByb3BzLnJvdXRlc1xuXG5cdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkocm91dGVzKSkge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1tyb3V0ZXJdIGJhZCByb3V0ZXMnKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblxuXHRcdFx0cHJvY2Vzc1JvdXRlKGdldE5ld1JvdXRlKCkpXG5cblx0XHRcdGZ1bmN0aW9uIHByb2Nlc3NSb3V0ZShuZXdSb3V0ZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnW3JvdXRlcl0gcHJvY2Vzc1JvdXRlJywgbmV3Um91dGUsIHJvdXRlcylcblxuXHRcdFx0XHRmb3IodmFyIHJvdXRlIG9mIHJvdXRlcykge1xuXHRcdFx0XHRcdHZhciBwYXJhbXMgPSBtYXRjaFJvdXRlKG5ld1JvdXRlLCByb3V0ZS5ocmVmKVxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coYHJvdXRlOiAke3JvdXRlLmhyZWZ9LCBwYXJhbXNgLCBwYXJhbXMpXG5cdFx0XHRcdFx0aWYgKHBhcmFtcyAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdbUm91dGVyQ29udHJvbF0gcGFyYW1zJywgcGFyYW1zKVxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiByb3V0ZS5yZWRpcmVjdCA9PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnW3JvdXRlcl0gcmVkaXJlY3QgdG8gJywgcm91dGUucmVkaXJlY3QpXG5cdFx0XHRcdFx0XHRcdGxvY2F0aW9uLmhyZWYgPSAnIycgKyByb3V0ZS5yZWRpcmVjdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICh0eXBlb2Ygcm91dGUuY29udHJvbCA9PSAnc3RyaW5nJykge1xuXG5cdFx0XHRcdFx0XHRcdHZhciBuZXdDdHJsID0gJCgnPGRpdj4nKVxuXHRcdFx0XHRcdFx0XHQkJC5jb250cm9sLmNyZWF0ZUNvbnRyb2wocm91dGUuY29udHJvbCwgbmV3Q3RybClcblx0XHRcdFx0XHRcdFx0ZWx0LnNhZmVFbXB0eSgpLmFwcGVuZChuZXdDdHJsKVx0XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0XHRcdH1cdFxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUud2FybignW3JvdXRlcl0gTm8gcm91dGUgZm91bmQgIScpXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XHR9XHRcdFxuXG5cblx0XHR9XG5cblx0fSlcblxufSkoKTtcblxuXG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy50YWJzJywge1xuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHZhciB1bCA9ICQoJzx1bD4nKS5wcmVwZW5kVG8oZWx0KVxuXG5cdFx0ZWx0LmNoaWxkcmVuKCdkaXYnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRpdGxlID0gJCh0aGlzKS5hdHRyKCd0aXRsZScpXG5cdFx0XHR2YXIgaWQgPSAkKHRoaXMpLnVuaXF1ZUlkKCkuYXR0cignaWQnKVxuXHRcdFx0dmFyIGxpID0gJCgnPGxpPicpXG5cdFx0XHRcdC5hdHRyKCd0aXRsZScsIHRpdGxlKVxuXHRcdFx0XHQuYXBwZW5kKCQoJzxhPicsIHtocmVmOiAnIycgKyBpZH0pLnRleHQodGl0bGUpKVxuXHRcdFx0XHQuYXBwZW5kVG8odWwpXG5cdFx0XHRpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLXJlbW92YWJsZScpICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRsaS5hcHBlbmQoJCgnPHNwYW4+Jywge2NsYXNzOiAndWktaWNvbiB1aS1pY29uLWNsb3NlJ30pKVxuXHRcdFx0fVxuXHRcdH0pXHRcdFxuXG5cdFx0ZWx0LnRhYnMoKVxuXG5cdH1cblxufSk7XG5cblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRWYXJWYWx1ZShkYXRhLCB2YXJOYW1lKSB7XHJcbiAgICB2YXIgcmV0ID0gZGF0YVxyXG4gICAgZm9yKGxldCBmIG9mIHZhck5hbWUuc3BsaXQoJy4nKSkge1xyXG4gICAgICBcclxuICAgICAgaWYgKHR5cGVvZiByZXQgPT0gJ29iamVjdCcgJiYgZiBpbiByZXQpIHtcclxuICAgICAgICByZXQgPSByZXRbZl1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFZhbHVlKGRhdGEsIHZhck5hbWUpIHtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCdbQ29yZV0gZ2V0VmFsdWUnLCB2YXJOYW1lLCBjdHgpXHJcblxyXG4gICAgdmFyIG5vdCA9IGZhbHNlXHJcbiAgICBpZiAodmFyTmFtZS5zdGFydHNXaXRoKCchJykpIHtcclxuICAgICAgdmFyTmFtZSA9IHZhck5hbWUuc3Vic3RyKDEpXHJcbiAgICAgIG5vdCA9IHRydWVcclxuICAgIH0gICAgIFxyXG5cclxuICAgIHZhciBmdW5jID0gZGF0YVt2YXJOYW1lXVxyXG4gICAgdmFyIHZhbHVlXHJcblxyXG4gICAgaWYgKHR5cGVvZiBmdW5jID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdmFsdWUgPSBmdW5jLmNhbGwoZGF0YSlcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YWx1ZSA9IGdldFZhclZhbHVlKGRhdGEsIHZhck5hbWUpXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Jvb2xlYW4nICYmIG5vdCkge1xyXG4gICAgICB2YWx1ZSA9ICF2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWx1ZVxyXG4gIH1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc3BsaXRBdHRyKGF0dHJWYWx1ZSwgY2JrKSB7XHJcbiAgYXR0clZhbHVlLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihpKSB7XHJcbiAgICBsZXQgW25hbWUsIHZhbHVlXSA9IGkuc3BsaXQoJzonKVxyXG4gICAgY2JrKG5hbWUudHJpbSgpLCB2YWx1ZS50cmltKCkpXHJcbiAgfSlcclxufVxyXG5cclxuXHJcbmNvbnN0IG1hcCA9IHtcclxuICAnYm4tZWFjaCc6IHt0eXBlOiAzfSxcclxuICAnYm4tdGV4dCc6IHtmOiAndGV4dCcsIHR5cGU6IDF9LFxyXG4gICdibi1odG1sJzoge2Y6ICdodG1sJywgdHlwZTogMX0sXHJcbiAgJ2JuLXZhbCc6IHtmOiAnc2V0VmFsdWUnLCB0eXBlOiAxfSxcclxuICAnYm4tc2hvdyc6IHtmOiAnc2V0VmlzaWJsZScsIHR5cGU6IDF9LFxyXG4gICdibi1zdHlsZSc6IHtmOiAnY3NzJywgdHlwZTogMn0sXHJcbiAgJ2JuLWF0dHInOiB7ZjogJ2F0dHInLCB0eXBlOiAyfSxcclxuICAnYm4tcHJvcCc6IHtmOiAncHJvcCcsIHR5cGU6IDJ9LFxyXG4gICdibi1kYXRhJzoge2Y6ICdzZXREYXRhJywgdHlwZTogMn0sXHJcbiAgJ2JuLWNsYXNzJzoge2Y6ICdzZXRDbGFzcycsIHR5cGU6IDJ9LFxyXG4gICdibi1jb250cm9sJzoge3R5cGU6IDR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGUoY3R4LCBkYXRhLCB2YXJzLCBleGNsdWRlRWx0KSB7XHJcblxyXG4gIC8vY29uc29sZS5sb2coJ3VwZGF0ZScsIHZhcnMpXHJcblxyXG4gIGlmICh0eXBlb2YgdmFycyA9PSAnc3RyaW5nJykge1xyXG4gICAgdmFycyA9IHZhcnMuc3BsaXQoJywnKVxyXG4gIH1cclxuXHJcbiAgdmFycy5mb3JFYWNoKGZ1bmN0aW9uKHZhcmlhYmxlKSB7XHJcbiAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJpYWJsZSlcclxuICAgIFxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgdXBkYXRlKGN0eCwgZGF0YSwgT2JqZWN0LmtleXModmFsdWUpLm1hcChpID0+IHZhcmlhYmxlICsgJy4nICsgaSksIGV4Y2x1ZGVFbHQpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoY3R4W3ZhcmlhYmxlXSkge1xyXG4gICAgICBjdHhbdmFyaWFibGVdLmZvckVhY2goZnVuY3Rpb24oYWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IHt0eXBlLCBmLCBlbHQsIG5hbWUsIHRlbXBsYXRlLCBpdGVyfSA9IGFjdGlvblxyXG4gICAgICAgIGlmIChlbHQgPT0gZXhjbHVkZUVsdCkge1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlID09IDEpIHtcclxuICAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIHZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSA9PSAyKSB7XHJcbiAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICB9ICAgXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMyAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICBlbHQuZW1wdHkoKVxyXG4gICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICB2YXIgaXRlbURhdGEgPSAkLmV4dGVuZCh7fSwgZGF0YSlcclxuICAgICAgICAgICAgICBpdGVtRGF0YVtpdGVyXSA9IGl0ZW1cclxuICAgICAgICAgICAgICB2YXIgJGl0ZW0gPSB0ZW1wbGF0ZS5jbG9uZSgpXHJcbiAgICAgICAgICAgICAgcHJvY2VzcygkaXRlbSwgaXRlbURhdGEpXHJcbiAgICAgICAgICAgICAgZWx0LmFwcGVuZCgkaXRlbSkgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc0V2ZW50cyhyb290LCBldmVudHMpIHtcclxuICByb290LmJuRmluZChgW2JuLWV2ZW50XWApLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBlbHQgPSAkKHRoaXMpXHJcbiAgICAgIGxldCBhdHRyVmFsdWUgPSBlbHQuYXR0cignYm4tZXZlbnQnKVxyXG4gICAgICBlbHQucmVtb3ZlQXR0cignYm4tZXZlbnQnKVxyXG4gICAgICBcclxuICAgICAgc3BsaXRBdHRyKGF0dHJWYWx1ZSwgZnVuY3Rpb24oZXZ0TmFtZSwgdmFsdWUpIHtcclxuICAgICAgICBsZXQgZm4gID0gZXZlbnRzW3ZhbHVlXVxyXG4gICAgICAgIGlmICh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJykgeyAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBbbmFtZSwgc2VsZWN0b3JdID0gZXZ0TmFtZS5zcGxpdCgnLicpXHJcblxyXG4gICAgICAgICAgaWYgKHNlbGVjdG9yICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbHQub24obmFtZSwgJy4nICsgc2VsZWN0b3IsIGZuKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVsdC5vbihuYW1lLCBmbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgIFxyXG4gICAgfSlcclxuICAgICBcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzcyhyb290LCBkYXRhLCBjcmVhdGVDb250cm9sKSB7XHJcblxyXG5cclxuICBsZXQgY3R4ID0ge31cclxuICBcclxuICBmb3IobGV0IGRpciBpbiBtYXApIHtcclxuICAgIFxyXG5cclxuICAgIHJvb3QuYm5GaW5kKGBbJHtkaXJ9XWApLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBlbHQgPSAkKHRoaXMpXHJcbiAgICAgIGxldCBhdHRyVmFsdWUgPSBlbHQuYXR0cihkaXIpXHJcbiAgICAgIGVsdC5yZW1vdmVBdHRyKGRpcilcclxuXHJcbiAgICAgIGxldCB7dHlwZSwgZn0gPSBtYXBbZGlyXVxyXG4gICAgICBcclxuICAgICAgaWYgKHR5cGUgPT0gMSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCBhdHRyVmFsdWUpXHJcbiAgICAgICAgICAvL2VsdC50ZXh0KGRhdGFbYXR0clZhbHVlXSlcclxuICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgdmFsdWUpXHJcbiAgICAgICAgfSBcclxuICAgICAgICBpZiAoZGlyID09ICdibi12YWwnKSB7XHJcbiAgICAgICAgICBsZXQgdXBkYXRlRXZ0ID0gZWx0LmF0dHIoJ2JuLXVwZGF0ZScpXHJcbiAgICAgICAgICBpZiAodXBkYXRlRXZ0KSB7XHJcbiAgICAgICAgICAgIGVsdC5yZW1vdmVBdHRyKCdibi11cGRhdGUnKVxyXG4gICAgICAgICAgICBlbHQub24odXBkYXRlRXZ0LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICByb290LnRyaWdnZXIoJ2RhdGE6dXBkYXRlJywgW2F0dHJWYWx1ZSwgZWx0LmdldFZhbHVlKCksIGVsdF0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eFthdHRyVmFsdWVdID0gY3R4W2F0dHJWYWx1ZV0gfHwgW11cclxuICAgICAgICBjdHhbYXR0clZhbHVlXS5wdXNoKHtmLCBlbHQsIHR5cGV9KSAgICAgICAgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlID09IDQgJiYgdHlwZW9mIGNyZWF0ZUNvbnRyb2wgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGNyZWF0ZUNvbnRyb2woYXR0clZhbHVlLCBlbHQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlID09IDIpIHtcclxuXHJcbiAgICAgICAgICBzcGxpdEF0dHIoYXR0clZhbHVlLCBmdW5jdGlvbihuYW1lLCB2YXJOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyTmFtZSlcclxuICAgICAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIG5hbWUsIHZhbHVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eFt2YXJOYW1lXSA9IGN0eFt2YXJOYW1lXSB8fCBbXVxyXG4gICAgICAgICAgICBjdHhbdmFyTmFtZV0ucHVzaCh7ZiwgZWx0LCB0eXBlLCBuYW1lfSkgIFxyXG4gICAgICAgICAgfSlcclxuICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgIGlmICh0eXBlID09IDMpIHtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSBlbHQuY2hpbGRyZW4oKS5yZW1vdmUoKS5jbG9uZSgpXHJcbiAgICAgICAgbGV0IFtpdGVyLCAsIHZhck5hbWVdID0gYXR0clZhbHVlLnNwbGl0KCcgJylcclxuICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eFt2YXJOYW1lXSA9IGN0eFt2YXJOYW1lXSB8fCBbXVxyXG4gICAgICAgIGN0eFt2YXJOYW1lXS5wdXNoKHtlbHQsIHR5cGUsIHRlbXBsYXRlLCBpdGVyfSkgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChkYXRhICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgIHZhciBpdGVtRGF0YSA9ICQuZXh0ZW5kKHt9LCBkYXRhKVxyXG4gICAgICAgICAgIGl0ZW1EYXRhW2l0ZXJdID0gaXRlbVxyXG4gICAgICAgICAgIHZhciAkaXRlbSA9IHRlbXBsYXRlLmNsb25lKClcclxuICAgICAgICAgICBwcm9jZXNzKCRpdGVtLCBpdGVtRGF0YSwgY3JlYXRlQ29udHJvbClcclxuICAgICAgICAgICBlbHQuYXBwZW5kKCRpdGVtKSAgICAgICAgICBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgIFxyXG4gIFxyXG4gIH1cclxuICBcclxuXHJcbiAgcmV0dXJuIGN0eFxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzQmluZGluZ3Mocm9vdCkge1xyXG5cclxuICAgIHZhciBkYXRhID0ge31cclxuXHJcbiAgICByb290LmJuRmluZCgnYm4tYmluZCcsIHRydWUsIGZ1bmN0aW9uKGVsdCwgdmFyTmFtZSkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdibi10ZXh0JywgdmFyTmFtZSlcclxuICAgICAgZGF0YVt2YXJOYW1lXSA9IGVsdFxyXG4gICAgfSlcclxuICAgIHJvb3QuYm5GaW5kKCdibi1pZmFjZScsIHRydWUsIGZ1bmN0aW9uKGVsdCwgdmFyTmFtZSkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdibi10ZXh0JywgdmFyTmFtZSlcclxuICAgICAgZGF0YVt2YXJOYW1lXSA9IGVsdC5pZmFjZSgpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGRhdGFcclxuICBcclxufVxyXG5cclxuJCQuYmluZGluZyA9IHtcclxuICBwcm9jZXNzLFxyXG4gIHVwZGF0ZSxcclxuICBwcm9jZXNzRXZlbnRzLFxyXG4gIHByb2Nlc3NCaW5kaW5nc1xyXG59XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcbmxldCBjb250cm9scyA9IHt9XHJcblxyXG5mdW5jdGlvbiBpc0RlcHNPayhkZXBzKSB7XHJcblx0cmV0dXJuIGRlcHMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xyXG5cclxuXHRcdHJldHVybiBwcmV2ICYmIChjdXIgIT0gdW5kZWZpbmVkKVxyXG5cdH0sIHRydWUpXHRcdFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb250cm9sKG5hbWUsIG9wdGlvbnMpIHtcclxuXHRpZiAoISQkLnV0aWwuY2hlY2tUeXBlKG9wdGlvbnMsIHtcclxuXHRcdCRkZXBzOiBbJ3N0cmluZyddLFxyXG5cdFx0aW5pdDogJ2Z1bmN0aW9uJ1xyXG5cdH0pKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKGBbQ29yZV0gcmVnaXN0ZXJDb250cm9sOiBiYWQgb3B0aW9uc2AsIG9wdGlvbnMpXHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cclxuXHR2YXIgZGVwcyA9IG9wdGlvbnMuZGVwcyB8fCBbXVxyXG5cclxuXHRjb25zb2xlLmxvZyhgW0NvcmVdIHJlZ2lzdGVyIGNvbnRyb2wgJyR7bmFtZX0nIHdpdGggZGVwc2AsIGRlcHMpXHJcblxyXG5cdGNvbnRyb2xzW25hbWVdID0ge2RlcHMsIG9wdGlvbnMsIHN0YXR1czogJ25vdGxvYWRlZCd9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvbnRyb2wobmFtZSkge1xyXG5cdHZhciByZXQgPSBjb250cm9sc1tuYW1lXVxyXG5cdGlmIChyZXQgJiYgcmV0LnN0YXR1cyA9PSAnbm90bG9hZGVkJykge1xyXG5cdFx0cmV0LmRlcHMgPSAkJC5zZXJ2aWNlLmdldFNlcnZpY2VzKHJldC5kZXBzKVxyXG5cdFx0cmV0LnN0YXR1cyA9IGlzRGVwc09rKHJldC5kZXBzKSA/ICdvaycgOiAna28nXHJcblx0fVxyXG5cdHJldHVybiByZXRcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ29udHJvbChjb250cm9sTmFtZSwgZWx0KSB7XHJcblx0ZWx0LmFkZENsYXNzKGNvbnRyb2xOYW1lLnJlcGxhY2UoJy4nLCAnLScpKVxyXG5cdGVsdC5hZGRDbGFzcygnQ3VzdG9tQ29udHJvbCcpLnVuaXF1ZUlkKClcdFxyXG5cdHZhciBjdHJsID0gZ2V0Q29udHJvbChjb250cm9sTmFtZSlcclxuXHRcdFxyXG5cdGlmIChjdHJsID09IHVuZGVmaW5lZCkge1xyXG5cdFx0dGhyb3coYFtDb3JlXSBjb250cm9sICcke2NvbnRyb2xOYW1lfScgaXMgbm90IHJlZ2lzdGVyZWRgKVxyXG5cdH1cclxuXHRcdC8vY29uc29sZS5sb2coJ2NyZWF0ZUNvbnRyb2wnLCBjb250cm9sTmFtZSwgY3RybClcclxuXHRpZiAoY3RybC5zdGF0dXMgPT09ICAnb2snKSB7XHJcblx0XHRcclxuXHRcdHZhciBpZmFjZSA9IHtcclxuXHRcdFx0cHJvcHM6IHt9LFxyXG5cdFx0XHRuYW1lOiBjb250cm9sTmFtZVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB7aW5pdCwgcHJvcHMsIHRlbXBsYXRlfSA9IGN0cmwub3B0aW9uc1xyXG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fVxyXG5cclxuXHRcdE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BOYW1lKSB7XHJcblx0XHRcdGlmYWNlLnByb3BzW3Byb3BOYW1lXSA9IGVsdC5kYXRhKHByb3BOYW1lKSB8fCBwcm9wc1twcm9wTmFtZV1cclxuXHRcdH0pXHJcblxyXG5cdFx0aWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHQkKHRlbXBsYXRlKS5hcHBlbmRUbyhlbHQpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRlbXBsYXRlIGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcblx0XHRcdHRlbXBsYXRlLmNoaWxkcmVuKCkuY2xvbmUoKS5hcHBlbmRUbyhlbHQpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBpbml0ID09ICdmdW5jdGlvbicpIHtcclxuXHJcblx0XHRcdHZhciBhcmdzID0gW2VsdF0uY29uY2F0KGN0cmwuZGVwcylcclxuXHRcdFx0aW5pdC5hcHBseShpZmFjZSwgYXJncylcclxuXHRcdFx0Y29uc29sZS5sb2coYFtDb3JlXSBpbnN0YW5jZSBjb250cm9sICcke2NvbnRyb2xOYW1lfScgd2l0aCBwcm9wc2AsIGlmYWNlLnByb3BzKVxyXG5cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oYFtDb3JlXSBjb250cm9sICcke2NvbnRyb2xOYW1lfScgbWlzc2luZyBpbml0IGZ1bmN0aW9uYClcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZWx0LmdldCgwKS5jdHJsID0gaWZhY2VcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGlmYWNlXHRcdFx0XHRcclxuXHR9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiQkLmNvbnRyb2wgPSB7XHJcblx0cmVnaXN0ZXJDb250cm9sLFxyXG5cdGNyZWF0ZUNvbnRyb2xcclxufVxyXG5cclxufSkoKTtcclxuIiwiJCQuZGlhbG9nQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgZGl2ID0gJCgnPGRpdj4nLCB7dGl0bGU6IG9wdGlvbnMudGl0bGUgfHwgJ0RpYWxvZyd9KVxyXG5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMudGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdCQob3B0aW9ucy50ZW1wbGF0ZSkuYXBwZW5kVG8oZGl2KVxyXG5cdH1cdFxyXG5cclxuXHR2YXIgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGRpdiwgb3B0aW9ucylcclxuXHJcblx0dmFyIGRsZ09wdGlvbnMgPSAkLmV4dGVuZCh7XHJcblx0XHRhdXRvT3BlbjogZmFsc2UsXHJcblx0XHRtb2RhbDogdHJ1ZSxcclxuXHRcdHdpZHRoOiAnYXV0bycsXHRcdFxyXG5cdH0sIG9wdGlvbnMpXHJcblxyXG5cdHZhciBwcml2YXRlID0ge31cclxuXHJcblx0Ly9jb25zb2xlLmxvZygnZGxnT3B0aW9ucycsIGRsZ09wdGlvbnMpXHJcblxyXG5cdGRpdi5kaWFsb2coZGxnT3B0aW9ucylcclxuXHJcblx0Y3RybC5zaG93ID0gZnVuY3Rpb24ob25BcHBseSkge1xyXG5cdFx0cHJpdmF0ZS5vbkFwcGx5ID0gb25BcHBseVxyXG5cdFx0ZGl2LmRpYWxvZygnb3BlbicpXHJcblx0fVxyXG5cclxuXHRjdHJsLmhpZGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdGRpdi5kaWFsb2coJ2Nsb3NlJylcclxuXHR9XHJcblxyXG5cdGN0cmwuYXBwbHkgPSBmdW5jdGlvbihyZXRWYWx1ZSkge1xyXG5cdFx0Y3RybC5oaWRlKClcclxuXHRcdGlmICh0eXBlb2YgcHJpdmF0ZS5vbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0cHJpdmF0ZS5vbkFwcGx5KHJldFZhbHVlKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y3RybC5zZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb25OYW1lLCB2YWx1ZSkge1xyXG5cdFx0ZGl2LmRpYWxvZygnb3B0aW9uJywgb3B0aW9uTmFtZSwgdmFsdWUpXHJcblx0fVxyXG5cclxuXHRjdHJsLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcclxuXHRcdGRpdi5kaWFsb2coJ2Rlc3Ryb3knKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGN0cmxcclxufTtcclxuIiwiJCQuZm9ybURpYWxvZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGRpdiA9ICQoJzxkaXY+Jywge3RpdGxlOiBvcHRpb25zLnRpdGxlIHx8ICdEaWFsb2cnfSlcclxuXHJcblx0dmFyIHByaXZhdGUgPSB7fVxyXG5cclxuXHR2YXIgZm9ybSA9ICQoJzxmb3JtPicpXHJcblx0XHQuYXBwZW5kVG8oZGl2KVxyXG5cdFx0Lm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldikge1xyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdGRpdi5kaWFsb2coJ2Nsb3NlJylcclxuXHRcdFx0aWYgKHR5cGVvZiBwcml2YXRlLm9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdHByaXZhdGUub25BcHBseSgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXHJcblx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxyXG5cdFx0XHR9XHRcdFx0XHRcclxuXHRcdH0pXHJcblxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy50ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0JChvcHRpb25zLnRlbXBsYXRlKS5hcHBlbmRUbyhmb3JtKVxyXG5cdH1cdFxyXG5cclxuXHRpZiAob3B0aW9ucy50ZW1wbGF0ZSBpbnN0YW5jZW9mIGpRdWVyeSkge1xyXG5cdFx0b3B0aW9ucy50ZW1wbGF0ZS5jaGlsZHJlbigpLmNsb25lKCkuYXBwZW5kVG8oZm9ybSlcclxuXHR9XHJcblxyXG5cdHZhciBzdWJtaXRCdG4gPSAkKCc8aW5wdXQ+Jywge3R5cGU6ICdzdWJtaXQnLCBoaWRkZW46IHRydWV9KS5hcHBlbmRUbyhmb3JtKVxyXG5cclxuXHR2YXIgZGxnT3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuXHRcdGF1dG9PcGVuOiBmYWxzZSxcclxuXHRcdG1vZGFsOiB0cnVlLFxyXG5cdFx0d2lkdGg6ICdhdXRvJyxcdFxyXG5cdFx0YnV0dG9uczoge1xyXG5cdFx0XHQnQ2FuY2VsJzogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCh0aGlzKS5kaWFsb2coJ2Nsb3NlJylcclxuXHRcdFx0fSxcclxuXHRcdFx0J0FwcGx5JzogZnVuY3Rpb24oKSB7XHRcdFx0XHRcdFxyXG5cdFx0XHRcdHN1Ym1pdEJ0bi5jbGljaygpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LCBvcHRpb25zKVxyXG5cclxuXHJcblx0ZGl2LmRpYWxvZyhkbGdPcHRpb25zKVxyXG5cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHNob3c6IGZ1bmN0aW9uKG9uQXBwbHkpIHtcclxuXHRcdFx0cHJpdmF0ZS5vbkFwcGx5ID0gb25BcHBseVx0XHRcdFxyXG5cdFx0XHRkaXYuZGlhbG9nKCdvcGVuJylcdFx0XHRcclxuXHRcdH0sXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdGZvcm0uc2V0Rm9ybURhdGEoZGF0YSlcclxuXHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdH0sXHJcblxyXG5cdFx0ZGVzdHJveTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGRpdi5kaWFsb2coJ2Rlc3Ryb3knKVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuJC5mbi5ibkZpbmQ9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICByZXR1cm4gdGhpcy5maW5kKHNlbGVjdG9yKS5hZGQodGhpcy5maWx0ZXIoc2VsZWN0b3IpKVxyXG59XHJcblxyXG4kLmZuLnNldENsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpc0FjdGl2ZSkge1xyXG4gICAgaWYgKGlzQWN0aXZlKSB7XHJcbiAgICAgIHRoaXMuYWRkQ2xhc3MoY2xhc3NOYW1lKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKVxyXG4gICAgfVxyXG59XHJcblxyXG4kLmZuLnNldFZpc2libGUgPSBmdW5jdGlvbihpc1Zpc2libGUpIHtcclxuICAgIGlmIChpc1Zpc2libGUpIHtcclxuICAgICAgdGhpcy5zaG93KClcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmhpZGUoKVxyXG4gICAgfVxyXG59XHJcblxyXG4kLmZuLmlmYWNlID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuZ2V0KDApLmN0cmxcclxufVxyXG5cclxuJC5mbi5zZXREYXRhID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG5cclxuICBjb25zdCBmdW5jTmFtZSA9ICdzZXQnICsgbmFtZS5zdWJzdHIoMCwxKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHIoMSlcclxuICAvL2NvbnNvbGUubG9nKCdmdW5jTmFtZScsIGZ1bmNOYW1lKVxyXG5cclxuICBpZiAoaWZhY2UgJiYgaWZhY2UucHJvcHNbbmFtZV0gJiYgdHlwZW9mIGlmYWNlW2Z1bmNOYW1lXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBpZmFjZVtmdW5jTmFtZV0odmFsdWUpXHJcbiAgfVxyXG4gIGVsc2UgaWYgKGlmYWNlICYmICQkLmlzVmlld0NvbnRyb2xsZXIoaWZhY2UuY3RybCkgJiYgaWZhY2UuY3RybC5tb2RlbFtuYW1lXSkge1xyXG4gICAgaWZhY2UuY3RybC5zZXREYXRhKG5hbWUsIHZhbHVlKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZGF0YShuYW1lLCB2YWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbiQuZm4uc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09ICdJTlBVVCcgJiYgdGhpcy5hdHRyKCd0eXBlJykgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgdGhpcy5wcm9wKCdjaGVja2VkJywgdmFsdWUpXHJcbiAgICByZXR1cm5cclxuICB9ICBcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG5cclxuICBpZiAoaWZhY2UgJiYgdHlwZW9mIGlmYWNlLnNldFZhbHVlID09ICdmdW5jdGlvbicpIHtcclxuICAgIGlmYWNlLnNldFZhbHVlKHZhbHVlKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMudmFsKHZhbHVlKVxyXG4gIH1cclxufVxyXG5cclxuJC5mbi5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGNvbnN0IHR5cGUgPSB0aGlzLmF0dHIoJ3R5cGUnKVxyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09ICdJTlBVVCcgJiYgdHlwZSA9PSAnY2hlY2tib3gnKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wKCdjaGVja2VkJylcclxuICB9ICAgIFxyXG4gIGNvbnN0IGlmYWNlID0gdGhpcy5pZmFjZSgpXHJcbiAgaWYgKGlmYWNlICYmIHR5cGVvZiBpZmFjZS5nZXRWYWx1ZSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICByZXR1cm4gaWZhY2UuZ2V0VmFsdWUoKVxyXG4gIH1cclxuICB2YXIgcmV0ID0gdGhpcy52YWwoKVxyXG5cclxuICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdyYW5nZScpIHtcclxuICAgIHJldCA9IHBhcnNlRmxvYXQocmV0KVxyXG4gIH1cclxuICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbiQuZm4uZ2V0Rm9ybURhdGEgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgcmV0ID0ge31cclxuICB0aGlzLmZpbmQoJ1tuYW1lXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZWx0ID0gJCh0aGlzKVxyXG4gICAgdmFyIG5hbWUgPSBlbHQuYXR0cignbmFtZScpXHJcbiAgICByZXRbbmFtZV0gPSBlbHQuZ2V0VmFsdWUoKVxyXG5cclxuICB9KVxyXG5cclxuICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbiQuZm4ucmVzZXRGb3JtID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHRoaXMuZ2V0KDApLnRhZ05hbWUgPT0gXCJGT1JNXCIpIHtcclxuICAgIHRoaXMuZ2V0KDApLnJlc2V0KClcclxuICB9ICAgXHJcbn1cclxuXHJcbiQuZm4uc2V0Rm9ybURhdGEgPSBmdW5jdGlvbihkYXRhKSB7XHJcblxyXG4gIC8vY29uc29sZS5sb2coJ3NldEZvcm1EYXRhJywgZGF0YSlcclxuICB0aGlzLnJlc2V0Rm9ybSgpXHJcblxyXG4gIGZvcih2YXIgbmFtZSBpbiBkYXRhKSB7XHJcbiAgICB2YXIgdmFsdWUgPSBkYXRhW25hbWVdXHJcbiAgICB2YXIgZWx0ID0gdGhpcy5maW5kKGBbbmFtZT0ke25hbWV9XWApXHJcbiAgICBpZiAoZWx0Lmxlbmd0aCkge1xyXG4gICAgICBlbHQuc2V0VmFsdWUodmFsdWUpICAgICAgIFxyXG4gICAgfVxyXG5cclxuICBcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbiQuZm4uc2FmZUVtcHR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5maW5kKCcuQ3VzdG9tQ29udHJvbCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCBpZmFjZSA9ICQodGhpcykuaWZhY2UoKVxyXG5cclxuICAgIGlmICh0eXBlb2YgaWZhY2UuZGlzcG9zZSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIGlmYWNlLmRpc3Bvc2UoKVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gIHRoaXMuZW1wdHkoKVxyXG5cclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG59KSgpO1xyXG4iLCJcclxuKGZ1bmN0aW9uKCl7XHJcblxyXG5sZXQgc2VydmljZXMgPSB7fVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0U2VydmljZXMoZGVwcykge1xyXG5cdC8vY29uc29sZS5sb2coJ1tDb3JlXSBnZXRTZXJ2aWNlcycsIGRlcHMpXHJcblx0cmV0dXJuIGRlcHMubWFwKGZ1bmN0aW9uKGRlcE5hbWUpIHtcclxuXHRcdHZhciBzcnYgPSBzZXJ2aWNlc1tkZXBOYW1lXVxyXG5cdFx0aWYgKHNydikge1xyXG5cdFx0XHRpZiAoc3J2LnN0YXR1cyA9PSAnbm90bG9hZGVkJykge1xyXG5cdFx0XHRcdHZhciBkZXBzMiA9IGdldFNlcnZpY2VzKHNydi5kZXBzKVxyXG5cdFx0XHRcdHZhciBjb25maWcgPSBzcnYuY29uZmlnIHx8IHt9XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYFtDb3JlXSBpbnN0YW5jZSBzZXJ2aWNlICcke2RlcE5hbWV9JyB3aXRoIGNvbmZpZ2AsIGNvbmZpZylcclxuXHRcdFx0XHR2YXIgYXJncyA9IFtjb25maWddLmNvbmNhdChkZXBzMilcclxuXHRcdFx0XHRzcnYub2JqID0gc3J2LmZuLmFwcGx5KG51bGwsIGFyZ3MpXHJcblx0XHRcdFx0c3J2LnN0YXR1cyA9ICdyZWFkeSdcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gc3J2Lm9ialx0XHRcdFx0XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly9zcnYuc3RhdHVzID0gJ25vdHJlZ2lzdGVyZWQnXHJcblx0XHRcdHRocm93KGBbQ29yZV0gc2VydmljZSAnJHtkZXBOYW1lfScgaXMgbm90IHJlZ2lzdGVyZWRgKVxyXG5cdFx0fVxyXG5cclxuXHR9KVxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGNvbmZpZ3VyZVNlcnZpY2UobmFtZSwgY29uZmlnKSB7XHJcblx0Y29uc29sZS5sb2coJ1tDb3JlXSBjb25maWd1cmVTZXJ2aWNlJywgbmFtZSwgY29uZmlnKVxyXG5cdGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJyB8fCB0eXBlb2YgY29uZmlnICE9ICdvYmplY3QnKSB7XHJcblx0XHRjb25zb2xlLndhcm4oJ1tDb3JlXSBjb25maWd1cmVTZXJ2aWNlIGNhbGxlZCB3aXRoIGJhZCBhcmd1bWVudHMnKVxyXG5cdFx0cmV0dXJuXHJcblx0fSBcdFxyXG5cclxuXHR2YXIgc3J2ID0gc2VydmljZXNbbmFtZV1cclxuXHRpZiAoc3J2KSB7XHJcblx0XHRzcnYuY29uZmlnID0gY29uZmlnXHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0dGhyb3coYFtjb25maWd1cmVTZXJ2aWNlXSBzZXJ2aWNlICcke25hbWV9JyBpcyBub3QgcmVnaXN0ZXJlZGApXHJcblx0fVxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJTZXJ2aWNlKG5hbWUsIGFyZzEsIGFyZzIpIHtcclxuXHR2YXIgZGVwcyA9IFtdXHJcblx0dmFyIGZuID0gYXJnMVxyXG5cdGlmIChBcnJheS5pc0FycmF5KGFyZzEpKSB7XHJcblx0XHRkZXBzID0gYXJnMVxyXG5cdFx0Zm4gPSBhcmcyXHJcblx0fVxyXG5cdGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJyB8fCB0eXBlb2YgZm4gPT0gJ3VuZGVmaW5lZCcgfHwgIUFycmF5LmlzQXJyYXkoZGVwcykpIHtcclxuXHRcdHRocm93KCdbQ29yZV0gcmVnaXN0ZXJTZXJ2aWNlIGNhbGxlZCB3aXRoIGJhZCBhcmd1bWVudHMnKVxyXG5cdH0gXHJcblx0Y29uc29sZS5sb2coYFtDb3JlXSByZWdpc3RlciBzZXJ2aWNlICcke25hbWV9JyB3aXRoIGRlcHNgLCBkZXBzKVxyXG5cclxuXHRzZXJ2aWNlc1tuYW1lXSA9IHtkZXBzLCBmbiwgc3RhdHVzOiAnbm90bG9hZGVkJ31cclxufVxyXG5cclxuJCQuc2VydmljZSA9IHtcclxuXHRyZWdpc3RlclNlcnZpY2UsXHJcblx0Y29uZmlndXJlU2VydmljZSxcclxuXHRnZXRTZXJ2aWNlc1xyXG59XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG5cclxuZnVuY3Rpb24gcmVhZFRleHRGaWxlKGZpbGVOYW1lLCBvblJlYWQpIHtcclxuXHR2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuXHJcblx0ZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0eXBlb2Ygb25SZWFkID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0b25SZWFkKGZpbGVSZWFkZXIucmVzdWx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmaWxlUmVhZGVyLnJlYWRBc1RleHQoZmlsZU5hbWUpXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZWFkRmlsZUFzRGF0YVVSTChmaWxlTmFtZSwgb25SZWFkKSB7XHJcblx0dmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXHJcblxyXG5cdGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodHlwZW9mIG9uUmVhZCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdG9uUmVhZChmaWxlUmVhZGVyLnJlc3VsdClcclxuXHRcdH1cclxuXHR9XHJcblx0ZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGVOYW1lKVxyXG59XHJcblxyXG5cclxudmFyIGlucHV0RmlsZSA9ICQoJzxpbnB1dD4nLCB7dHlwZTogJ2ZpbGUnfSkub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG5cdHZhciBvbkFwcGx5ID0gJCh0aGlzKS5kYXRhKCdvbkFwcGx5JylcclxuXHR2YXIgZmlsZU5hbWUgPSB0aGlzLmZpbGVzWzBdXHJcblx0aWYgKHR5cGVvZiBvbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdG9uQXBwbHkoZmlsZU5hbWUpXHJcblx0fVxyXG59KVxyXG5cclxuZnVuY3Rpb24gb3BlbkZpbGVEaWFsb2cob25BcHBseSkge1xyXG5cdGlucHV0RmlsZS5kYXRhKCdvbkFwcGx5Jywgb25BcHBseSlcclxuXHRpbnB1dEZpbGUuY2xpY2soKVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc0ltYWdlKGZpbGVOYW1lKSB7XHJcblx0cmV0dXJuICgvXFwuKGdpZnxqcGd8anBlZ3xwbmcpJC9pKS50ZXN0KGZpbGVOYW1lKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkYXRhVVJMdG9CbG9iKGRhdGFVUkwpIHtcclxuICAvLyBEZWNvZGUgdGhlIGRhdGFVUkxcclxuICBjb25zdCBbICwgbWltZVR5cGUsIGVuY29kYWdlLCBkYXRhXSA9IGRhdGFVUkwuc3BsaXQoL1s6LDtdLylcclxuICBpZiAoZW5jb2RhZ2UgIT0gJ2Jhc2U2NCcpIHtcclxuICBcdHJldHVyblxyXG4gIH1cclxuXHJcbiAgLy9jb25zb2xlLmxvZygnbWltZVR5cGUnLCBtaW1lVHlwZSlcclxuICAvL2NvbnNvbGUubG9nKCdlbmNvZGFnZScsIGVuY29kYWdlKVxyXG4gIC8vY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKVxyXG5cclxuICB2YXIgYmluYXJ5ID0gYXRvYihkYXRhKVxyXG4gLy8gQ3JlYXRlIDgtYml0IHVuc2lnbmVkIGFycmF5XHJcbiAgdmFyIGFycmF5ID0gW11cclxuICBmb3IodmFyIGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgXHRhcnJheS5wdXNoKGJpbmFyeS5jaGFyQ29kZUF0KGkpKVxyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJuIG91ciBCbG9iIG9iamVjdFxyXG5cdHJldHVybiBuZXcgQmxvYihbIG5ldyBVaW50OEFycmF5KGFycmF5KSBdLCB7bWltZVR5cGV9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU3R5bGUoc3R5bGVGaWxlUGF0aCwgY2FsbGJhY2spIHtcdFxyXG5cdC8vY29uc29sZS5sb2coJ1tDb3JlXSBsb2FkU3R5bGUnLCBzdHlsZUZpbGVQYXRoKVxyXG5cclxuXHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNzc09rID0gJCgnaGVhZCcpLmZpbmQoYGxpbmtbaHJlZj1cIiR7c3R5bGVGaWxlUGF0aH1cIl1gKS5sZW5ndGhcclxuXHRcdGlmIChjc3NPayAhPSAxKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBsb2FkaW5nICcke3N0eWxlRmlsZVBhdGh9JyBzdHlsZWApXHJcblx0XHRcdCQoJzxsaW5rPicsIHtocmVmOiBzdHlsZUZpbGVQYXRoLCByZWw6ICdzdHlsZXNoZWV0J30pXHJcblx0XHRcdC5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGAnJHtzdHlsZUZpbGVQYXRofScgbG9hZGVkYClcclxuXHRcdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbygkKCdoZWFkJykpXHJcblx0XHR9XHJcblx0fSlcclxufVxyXG5cclxuXHJcblxyXG5cdFxyXG5mdW5jdGlvbiBpc09iamVjdChhKSB7XHJcblx0cmV0dXJuICh0eXBlb2YgYSA9PSAnb2JqZWN0JykgJiYgIUFycmF5LmlzQXJyYXkoYSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tUeXBlKHZhbHVlLCB0eXBlLCBpc09wdGlvbmFsKSB7XHJcblx0Ly9jb25zb2xlLmxvZygnY2hlY2tUeXBlJyx2YWx1ZSwgdHlwZSwgaXNPcHRpb25hbClcclxuXHRpZiAodHlwZW9mIHZhbHVlID09ICd1bmRlZmluZWQnICYmIGlzT3B0aW9uYWwgPT09IHRydWUpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIHR5cGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT0gdHlwZVxyXG5cdH1cclxuXHJcblx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodHlwZSkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHR5cGUubGVuZ3RoID09IDApIHtcclxuXHRcdFx0cmV0dXJuIHRydWUgLy8gbm8gaXRlbSB0eXBlIGNoZWNraW5nXHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgdmFsdWUpIHtcclxuXHRcdFx0dmFyIHJldCA9IGZhbHNlXHJcblx0XHRcdGZvcihsZXQgdCBvZiB0eXBlKSB7XHJcblx0XHRcdFx0cmV0IHw9IGNoZWNrVHlwZShpLCB0KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghcmV0KSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKGlzT2JqZWN0KHR5cGUpKSB7XHJcblx0XHRpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgZiBpbiB0eXBlKSB7XHJcblxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdmJywgZiwgJ3ZhbHVlJywgdmFsdWUpXHJcblx0XHRcdHZhciBuZXdUeXBlID0gdHlwZVtmXVxyXG5cclxuXHRcdFx0dmFyIGlzT3B0aW9uYWwgPSBmYWxzZVxyXG5cdFx0XHRpZiAoZi5zdGFydHNXaXRoKCckJykpIHtcclxuXHRcdFx0XHRmID0gZi5zdWJzdHIoMSlcclxuXHRcdFx0XHRpc09wdGlvbmFsID0gdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghY2hlY2tUeXBlKHZhbHVlW2ZdLCBuZXdUeXBlLCBpc09wdGlvbmFsKSkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cdHJldHVybiBmYWxzZVxyXG59XHRcclxuXHJcblxyXG5cclxuJCQudXRpbCA9IHtcclxuXHRyZWFkVGV4dEZpbGUsXHJcblx0cmVhZEZpbGVBc0RhdGFVUkwsXHJcblx0b3BlbkZpbGVEaWFsb2csXHJcblx0aXNJbWFnZSxcclxuXHRkYXRhVVJMdG9CbG9iLFxyXG5cdGxvYWRTdHlsZSxcclxuXHRjaGVja1R5cGVcclxufVxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxuY2xhc3MgVmlld0NvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoZWx0LCBvcHRpb25zKSB7XHJcbiAgICBcdC8vY29uc29sZS5sb2coJ1ZpZXdDb250cm9sbGVyJywgb3B0aW9ucylcclxuICAgIFx0aWYgKHR5cGVvZiBlbHQgPT0gJ3N0cmluZycpIHtcclxuICAgIFx0XHRlbHQgPSAkKGVsdClcclxuICAgIFx0fVxyXG4gICAgICAgIGlmIChlbHQuaGFzQ2xhc3MoJ0N1c3RvbUNvbnRyb2wnKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdkb25cXCd0IHVzZSB2aWV3Q29udHJvbGxlciBvbiBjb250cm9sIHRhZycpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICBcdG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucylcclxuICAgICAgICB0aGlzLmVsdCA9IGVsdFxyXG5cclxuICAgICAgICBlbHQub24oJ2RhdGE6dXBkYXRlJywgKGV2LCBuYW1lLCB2YWx1ZSwgZXhjbHVkZUVsdCkgPT4ge1xyXG4gICAgICAgIFx0Ly9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSBkYXRhOmNoYW5nZScsIG5hbWUsIHZhbHVlKVxyXG4gICAgICAgIFx0dGhpcy5zZXREYXRhKG5hbWUsIHZhbHVlLCBleGNsdWRlRWx0KVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMubW9kZWwgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy5kYXRhKVxyXG4gICAgICAgIHRoaXMucnVsZXMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy5ydWxlcylcclxuICAgICAgICB0aGlzLndhdGNoZXMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy53YXRjaGVzKVxyXG5cclxuICAgICAgICAvLyBnZW5lcmF0ZSBhdXRvbWF0aWMgcnVsZXMgZm9yIGNvbXB1dGVkIGRhdGEgKGFrYSBmdW5jdGlvbilcclxuICAgICAgICBmb3IodmFyIGsgaW4gdGhpcy5tb2RlbCkge1xyXG4gICAgICAgIFx0dmFyIGRhdGEgPSB0aGlzLm1vZGVsW2tdXHJcbiAgICAgICAgXHRpZiAodHlwZW9mIGRhdGEgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIFx0XHR2YXIgZnVuY1RleHQgPSBkYXRhLnRvU3RyaW5nKClcclxuICAgICAgICBcdFx0Ly9jb25zb2xlLmxvZygnZnVuY1RleHQnLCBmdW5jVGV4dClcclxuICAgICAgICBcdFx0dmFyIHJ1bGVzID0gW11cclxuICAgICAgICBcdFx0ZnVuY1RleHQucmVwbGFjZSgvdGhpcy4oW2EtekEtWjAtOV8tXXsxLH0pL2csIGZ1bmN0aW9uKG1hdGNoLCBjYXB0dXJlT25lKSB7XHJcbiAgICAgICAgXHRcdFx0Ly9jb25zb2xlLmxvZygnY2FwdHVyZU9uZScsIGNhcHR1cmVPbmUpXHJcbiAgICAgICAgXHRcdFx0cnVsZXMucHVzaChjYXB0dXJlT25lKVxyXG4gICAgICAgIFx0XHR9KVxyXG4gICAgICAgIFx0XHR0aGlzLnJ1bGVzW2tdID0gcnVsZXMudG9TdHJpbmcoKVxyXG4gICAgICAgIFx0fVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygncnVsZXMnLCB0aGlzLnJ1bGVzKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gJCQuYmluZGluZy5wcm9jZXNzKGVsdCwgdGhpcy5tb2RlbCwgJCQuY29udHJvbC5jcmVhdGVDb250cm9sKVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmV2ZW50cyA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAkJC5iaW5kaW5nLnByb2Nlc3NFdmVudHMoZWx0LCBvcHRpb25zLmV2ZW50cylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2NvcGUgPSAkJC5iaW5kaW5nLnByb2Nlc3NCaW5kaW5ncyhlbHQpXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc2NvcGUnLCB0aGlzLnNjb3BlKVxyXG4gICAgICAgXHJcblxyXG4gICAgfSBcclxuXHJcbiAgICBzZXREYXRhKGFyZzEsIGFyZzIsIGV4Y2x1ZGVFbHQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHNldERhdGEnLCBhcmcxLCBhcmcyKVxyXG4gICAgICAgIHZhciBkYXRhID0gYXJnMVxyXG4gICAgICAgIGlmICh0eXBlb2YgYXJnMSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIFx0ZGF0YSA9IHt9XHJcbiAgICAgICAgXHRkYXRhW2FyZzFdID0gYXJnMlxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHNldERhdGEnLCBkYXRhKVxyXG4gICAgICAgICQuZXh0ZW5kKHRoaXMubW9kZWwsIGRhdGEpXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbW9kZWwnLCB0aGlzLm1vZGVsKVxyXG4gICAgICAgIHRoaXMudXBkYXRlKE9iamVjdC5rZXlzKGRhdGEpLCBleGNsdWRlRWx0KVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShmaWVsZHNOYW1lLCBleGNsdWRlRWx0KSB7XHJcbiAgICBcdC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gdXBkYXRlJywgZmllbGRzTmFtZSlcclxuICAgIFx0aWYgKHR5cGVvZiBmaWVsZHNOYW1lID09ICdzdHJpbmcnKSB7XHJcbiAgICBcdFx0ZmllbGRzTmFtZSA9IGZpZWxkc05hbWUuc3BsaXQoJywnKVxyXG4gICAgXHR9XHJcblxyXG5cclxuICAgIFx0aWYgKEFycmF5LmlzQXJyYXkoZmllbGRzTmFtZSkpIHtcclxuICAgIFx0XHR2YXIgZmllbGRzU2V0ID0ge31cclxuICAgIFx0XHRmaWVsZHNOYW1lLmZvckVhY2goKGZpZWxkKSA9PiB7XHJcblxyXG4gICAgXHRcdFx0dmFyIHdhdGNoID0gdGhpcy53YXRjaGVzW2ZpZWxkXVxyXG4gICAgXHRcdFx0aWYgKHR5cGVvZiB3YXRjaCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBcdFx0XHRcdHdhdGNoLmNhbGwobnVsbCwgdGhpcy5tb2RlbFtmaWVsZF0pXHJcbiAgICBcdFx0XHR9XHJcbiAgICBcdFx0XHRmaWVsZHNTZXRbZmllbGRdID0gMVxyXG5cclxuICAgIFx0XHRcdGZvcih2YXIgcnVsZSBpbiB0aGlzLnJ1bGVzKSB7XHJcbiAgICBcdFx0XHRcdGlmICh0aGlzLnJ1bGVzW3J1bGVdLnNwbGl0KCcsJykuaW5kZXhPZihmaWVsZCkgIT0gLTEpIHtcclxuICAgIFx0XHRcdFx0XHRmaWVsZHNTZXRbcnVsZV0gPSAxXHJcbiAgICBcdFx0XHRcdH1cclxuICAgIFx0XHRcdH1cclxuICAgIFx0XHR9KVxyXG5cclxuXHJcbiAgICBcdFx0JCQuYmluZGluZy51cGRhdGUodGhpcy5jdHgsIHRoaXMubW9kZWwsIE9iamVjdC5rZXlzKGZpZWxkc1NldCksIGV4Y2x1ZGVFbHQpXHJcbiAgICBcdH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbiQkLnZpZXdDb250cm9sbGVyID0gZnVuY3Rpb24oZWx0LCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IFZpZXdDb250cm9sbGVyKGVsdCwgb3B0aW9ucylcclxufVxyXG5cclxuJCQuaXNWaWV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKG8pIHtcclxuICAgIHJldHVybiBvIGluc3RhbmNlb2YgVmlld0NvbnRyb2xsZXJcclxufVxyXG5cclxufSkoKTtcclxuIiwiXG4kJC5zZXJ2aWNlLnJlZ2lzdGVyU2VydmljZSgnYnJhaW5qcy5odHRwJywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0Z2V0KHVybCkge1xuXHRcdFx0cmV0dXJuICQuZ2V0SlNPTih1cmwpXG5cdFx0fSxcblxuXG5cdFx0cG9zdCh1cmwsIGRhdGEpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0dXJsIDogdXJsLFxuXHRcdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0XHRkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxuXHRcdFx0fSlcblx0XHR9LFxuXG5cdFx0cHV0KHVybCwgZGF0YSkge1xuXHRcdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogJ1BVVCcsXG5cdFx0XHRcdHVybCA6IHVybCxcblx0XHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdFx0ZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSlcblx0XHRcdH0pXG5cdFx0fSxcdFx0XHRcblxuXHRcdGRlbGV0ZSh1cmwpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6ICdERUxFVEUnLFxuXHRcdFx0XHR1cmwgOiB1cmwsXG5cdFx0XHR9KVx0XHRcdFx0XG5cdFx0fSxcblxuXHRcdHBvc3RGb3JtRGF0YSh1cmwsIGZkKSB7XG5cdFx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdCAgdXJsOiB1cmwsXG5cdFx0XHQgIHR5cGU6IFwiUE9TVFwiLFxuXHRcdFx0ICBkYXRhOiBmZCxcblx0XHRcdCAgcHJvY2Vzc0RhdGE6IGZhbHNlLCAgLy8gaW5kaXF1ZSDDoCBqUXVlcnkgZGUgbmUgcGFzIHRyYWl0ZXIgbGVzIGRvbm7DqWVzXG5cdFx0XHQgIGNvbnRlbnRUeXBlOiBmYWxzZSAgIC8vIGluZGlxdWUgw6AgalF1ZXJ5IGRlIG5lIHBhcyBjb25maWd1cmVyIGxlIGNvbnRlbnRUeXBlXG5cdFx0XHR9KVx0XHRcdFx0XG5cdFx0fVxuXG5cdFx0XG5cdH1cbn0pO1xuXG5cblxuXG5cblxuIl19
