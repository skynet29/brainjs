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







//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiY29udHJvbHMvY2hlY2tncm91cC5qcyIsImNvbnRyb2xzL2lucHV0Z3JvdXAuanMiLCJjb250cm9scy9uYXZiYXIuanMiLCJjb250cm9scy9yYWRpb2dyb3VwLmpzIiwiY29udHJvbHMvcm91dGVyLmpzIiwiY29udHJvbHMvdGFicy5qcyIsImxpYi9iaW5kaW5nLmpzIiwibGliL2NvbnRyb2wuanMiLCJsaWIvZGlhbG9nQ29udHJvbGxlciAuanMiLCJsaWIvZm9ybURpYWxvZ0NvbnRyb2xsZXIuanMiLCJsaWIvanF1ZXJ5LWV4dC5qcyIsImxpYi9zZXJ2aWNlLmpzIiwibGliL3V0aWwuanMiLCJsaWIvdmlld0NvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9odHRwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnJhaW5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG5cclxuXHR3aW5kb3cuJCQgPSB7fVxyXG5cdFxyXG59KSgpOyIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLmNoZWNrZ3JvdXAnLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0ZWx0Lm9uKCdjbGljaycsICdpbnB1dFt0eXBlPWNoZWNrYm94XScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZWx0LnRyaWdnZXIoJ2lucHV0Jylcblx0XHR9KVxuXG5cdFx0dGhpcy5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHJldCA9IFtdXG5cdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1jaGVja2JveF06Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldC5wdXNoKCQodGhpcykudmFsKCkpXG5cdFx0XHR9KVx0XG5cdFx0XHRyZXR1cm4gcmV0XHRcblx0XHR9XG5cblx0XHR0aGlzLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1jaGVja2JveF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcykucHJvcCgnY2hlY2tlZCcsIHZhbHVlLmluZGV4T2YoJCh0aGlzKS52YWwoKSkgPj0gMClcblx0XHRcdFx0fSlcblx0XHRcdH1cdFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZShlbHQudmFsKCkpXG5cblx0fVxuXG59KTtcblxuXG5cblxuXG5cbiIsIlxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMuaW5wdXRncm91cCcsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHR2YXIgaWQgPSBlbHQuY2hpbGRyZW4oJ2lucHV0JykudW5pcXVlSWQoKS5hdHRyKCdpZCcpXG5cdFx0ZWx0LmNoaWxkcmVuKCdsYWJlbCcpLmF0dHIoJ2ZvcicsIGlkKVxuXHR9XG59KTtcbiIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLm5hdmJhcicsIHtcblx0cHJvcHM6IHtcblx0XHRhY3RpdmVDb2xvcjogJ3czLWdyZWVuJyxcblx0XHR0eXBlOiAnaG9yaXpvbnRhbCdcblx0fSxcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCB7YWN0aXZlQ29sb3IsIHR5cGV9ID0gdGhpcy5wcm9wc1xuXG5cdFx0ZWx0LmFkZENsYXNzKCh0eXBlID09ICd2ZXJ0aWNhbCcpID8gJ3czLWJhci1ibG9jayc6ICd3My1iYXInKVxuXHRcdGVsdC5jaGlsZHJlbignYScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCd3My1iYXItaXRlbSB3My1idXR0b24nKVxuXHRcdH0pXG5cblx0XHRjb25zdCBuZXdSb3V0ZSA9ICQkLmdldE5ld1JvdXRlKClcblx0XHRlbHQuY2hpbGRyZW4oYGFbaHJlZj1cIiMke25ld1JvdXRlfVwiXWApLmFkZENsYXNzKGFjdGl2ZUNvbG9yKVxuXG5cdFx0JCh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZygnW05hdmJhckNvbnRyb2xdIHJvdXRlQ2hhbmdlJywgbmV3Um91dGUpXG5cdFx0XHRjb25zdCBuZXdSb3V0ZSA9ICQkLmdldE5ld1JvdXRlKClcblxuXHRcdFx0ZWx0LmNoaWxkcmVuKGBhLiR7YWN0aXZlQ29sb3J9YCkucmVtb3ZlQ2xhc3MoYWN0aXZlQ29sb3IpXHRcblx0XHRcdGVsdC5jaGlsZHJlbihgYVtocmVmPVwiIyR7bmV3Um91dGV9XCJdYCkuYWRkQ2xhc3MoYWN0aXZlQ29sb3IpXG5cblx0XHR9KVx0XG5cblx0fVxuXG59KTtcblxuXG5cblxuXG5cbiIsIlxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMucmFkaW9ncm91cCcsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRlbHQub24oJ2NsaWNrJywgJ2lucHV0W3R5cGU9cmFkaW9dJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdyYWRpb2dyb3VwIGNsaWNrJylcblx0XHRcdGVsdC5maW5kKCdpbnB1dFt0eXBlPXJhZGlvXTpjaGVja2VkJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKVxuXHRcdFx0JCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcblx0XHRcdGVsdC50cmlnZ2VyKCdpbnB1dCcpXG5cdFx0fSlcblx0XHRcblxuXHRcdHRoaXMuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBlbHQuZmluZCgnaW5wdXRbdHlwZT1yYWRpb106Y2hlY2tlZCcpLnZhbCgpXG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1yYWRpb10nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCB2YWx1ZSA9PT0gJCh0aGlzKS52YWwoKSlcblx0XHRcdH0pXHRcdFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZShlbHQudmFsKCkpXG5cdH1cbn0pO1xuXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIG1hdGNoUm91dGUocm91dGUsIHBhdHRlcm4pIHtcblx0XHQvL2NvbnNvbGUubG9nKCdtYXRjaFJvdXRlJywgcm91dGUsIHBhdHRlcm4pXG5cdFx0dmFyIHJvdXRlU3BsaXQgPSByb3V0ZS5zcGxpdCgnLycpXG5cdFx0dmFyIHBhdHRlcm5TcGxpdCA9IHBhdHRlcm4uc3BsaXQoJy8nKVxuXHRcdC8vY29uc29sZS5sb2cocm91dGVTcGxpdCwgcGF0dGVyblNwbGl0KVxuXHRcdHZhciByZXQgPSB7fVxuXG5cdFx0aWYgKHJvdXRlU3BsaXQubGVuZ3RoICE9IHBhdHRlcm5TcGxpdC5sZW5ndGgpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0Zm9yKHZhciBpZHggPSAwOyBpZHggPCBwYXR0ZXJuU3BsaXQubGVuZ3RoOyBpZHgrKykge1xuXHRcdFx0dmFyIHBhdGggPSBwYXR0ZXJuU3BsaXRbaWR4XVxuXHRcdFx0Ly9jb25zb2xlLmxvZygncGF0aCcsIHBhdGgpXG5cdFx0XHRpZiAocGF0aC5zdWJzdHIoMCwgMSkgPT09ICc6Jykge1xuXHRcdFx0XHRpZiAocm91dGVTcGxpdFtpZHhdLmxlbmd0aCA9PT0gMClcblx0XHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0XHRyZXRbcGF0aC5zdWJzdHIoMSldID0gcm91dGVTcGxpdFtpZHhdXG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChwYXRoICE9PSByb3V0ZVNwbGl0W2lkeF0pIHtcblx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiByZXRcblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0TmV3Um91dGUoKSB7XG5cdFx0Y29uc3QgaHJlZiA9IGxvY2F0aW9uLmhyZWZcblx0XHRjb25zdCBpZHggPSBocmVmLmluZGV4T2YoJyMnKVxuXHRcdGNvbnN0IG5ld1JvdXRlID0gKGlkeCAhPT0gLTEpICA/IGhyZWYuc3Vic3RyKGlkeCsxKSA6ICcvJ1xuXHRcdFxuXHRcdHJldHVybiBuZXdSb3V0ZVxuXHR9XG5cblx0JCQuZ2V0TmV3Um91dGUgPSBnZXROZXdSb3V0ZVxuXG5cdCQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLnJvdXRlcicsIHtcblxuXHRcdHByb3BzOiB7XG5cdFx0XHRyb3V0ZXM6IFtdXG5cdFx0fSxcblx0XHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXG5cdFx0XHQkKHdpbmRvdykub24oJ3BvcHN0YXRlJywgZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdbcm91dGVyXSBwb3BzdGF0ZScpXG5cdFx0XHRcdHByb2Nlc3NSb3V0ZShnZXROZXdSb3V0ZSgpKVxuXHRcdFx0fSlcblxuXG5cdFx0XHR2YXIgcm91dGVzID0gdGhpcy5wcm9wcy5yb3V0ZXNcblxuXHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KHJvdXRlcykpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKCdbcm91dGVyXSBiYWQgcm91dGVzJylcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cblx0XHRcdHByb2Nlc3NSb3V0ZShnZXROZXdSb3V0ZSgpKVxuXG5cdFx0XHRmdW5jdGlvbiBwcm9jZXNzUm91dGUobmV3Um91dGUpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1tyb3V0ZXJdIHByb2Nlc3NSb3V0ZScsIG5ld1JvdXRlLCByb3V0ZXMpXG5cblx0XHRcdFx0Zm9yKHZhciByb3V0ZSBvZiByb3V0ZXMpIHtcblx0XHRcdFx0XHR2YXIgcGFyYW1zID0gbWF0Y2hSb3V0ZShuZXdSb3V0ZSwgcm91dGUuaHJlZilcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGByb3V0ZTogJHtyb3V0ZS5ocmVmfSwgcGFyYW1zYCwgcGFyYW1zKVxuXHRcdFx0XHRcdGlmIChwYXJhbXMgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnW1JvdXRlckNvbnRyb2xdIHBhcmFtcycsIHBhcmFtcylcblx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygcm91dGUucmVkaXJlY3QgPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1tyb3V0ZXJdIHJlZGlyZWN0IHRvICcsIHJvdXRlLnJlZGlyZWN0KVxuXHRcdFx0XHRcdFx0XHRsb2NhdGlvbi5ocmVmID0gJyMnICsgcm91dGUucmVkaXJlY3RcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIHJvdXRlLmNvbnRyb2wgPT0gJ3N0cmluZycpIHtcblxuXHRcdFx0XHRcdFx0XHR2YXIgbmV3Q3RybCA9ICQoJzxkaXY+Jylcblx0XHRcdFx0XHRcdFx0JCQuY29udHJvbC5jcmVhdGVDb250cm9sKHJvdXRlLmNvbnRyb2wsIG5ld0N0cmwpXG5cdFx0XHRcdFx0XHRcdGVsdC5zYWZlRW1wdHkoKS5hcHBlbmQobmV3Q3RybClcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0XHR9XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1tyb3V0ZXJdIE5vIHJvdXRlIGZvdW5kICEnKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdFx0fVx0XHRcblxuXG5cdFx0fVxuXG5cdH0pXG5cbn0pKCk7XG5cblxuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMudGFicycsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHR2YXIgdWwgPSAkKCc8dWw+JykucHJlcGVuZFRvKGVsdClcblxuXHRcdGVsdC5jaGlsZHJlbignZGl2JykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0aXRsZSA9ICQodGhpcykuYXR0cigndGl0bGUnKVxuXHRcdFx0dmFyIGlkID0gJCh0aGlzKS51bmlxdWVJZCgpLmF0dHIoJ2lkJylcblx0XHRcdHZhciBsaSA9ICQoJzxsaT4nKVxuXHRcdFx0XHQuYXR0cigndGl0bGUnLCB0aXRsZSlcblx0XHRcdFx0LmFwcGVuZCgkKCc8YT4nLCB7aHJlZjogJyMnICsgaWR9KS50ZXh0KHRpdGxlKSlcblx0XHRcdFx0LmFwcGVuZFRvKHVsKVxuXHRcdFx0aWYgKCQodGhpcykuYXR0cignZGF0YS1yZW1vdmFibGUnKSAhPSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bGkuYXBwZW5kKCQoJzxzcGFuPicsIHtjbGFzczogJ3VpLWljb24gdWktaWNvbi1jbG9zZSd9KSlcblx0XHRcdH1cblx0XHR9KVx0XHRcblxuXHRcdGVsdC50YWJzKClcblxuXHR9XG5cbn0pO1xuXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VmFyVmFsdWUoZGF0YSwgdmFyTmFtZSkge1xyXG4gICAgdmFyIHJldCA9IGRhdGFcclxuICAgIGZvcihsZXQgZiBvZiB2YXJOYW1lLnNwbGl0KCcuJykpIHtcclxuICAgICAgXHJcbiAgICAgIGlmICh0eXBlb2YgcmV0ID09ICdvYmplY3QnICYmIGYgaW4gcmV0KSB7XHJcbiAgICAgICAgcmV0ID0gcmV0W2ZdXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKSB7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZygnW0NvcmVdIGdldFZhbHVlJywgdmFyTmFtZSwgY3R4KVxyXG5cclxuICAgIHZhciBub3QgPSBmYWxzZVxyXG4gICAgaWYgKHZhck5hbWUuc3RhcnRzV2l0aCgnIScpKSB7XHJcbiAgICAgIHZhck5hbWUgPSB2YXJOYW1lLnN1YnN0cigxKVxyXG4gICAgICBub3QgPSB0cnVlXHJcbiAgICB9ICAgICBcclxuXHJcbiAgICB2YXIgZnVuYyA9IGRhdGFbdmFyTmFtZV1cclxuICAgIHZhciB2YWx1ZVxyXG5cclxuICAgIGlmICh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHZhbHVlID0gZnVuYy5jYWxsKGRhdGEpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFsdWUgPSBnZXRWYXJWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdib29sZWFuJyAmJiBub3QpIHtcclxuICAgICAgdmFsdWUgPSAhdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWVcclxuICB9XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNwbGl0QXR0cihhdHRyVmFsdWUsIGNiaykge1xyXG4gIGF0dHJWYWx1ZS5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24oaSkge1xyXG4gICAgbGV0IFtuYW1lLCB2YWx1ZV0gPSBpLnNwbGl0KCc6JylcclxuICAgIGNiayhuYW1lLnRyaW0oKSwgdmFsdWUudHJpbSgpKVxyXG4gIH0pXHJcbn1cclxuXHJcblxyXG5jb25zdCBtYXAgPSB7XHJcbiAgJ2JuLWVhY2gnOiB7dHlwZTogM30sXHJcbiAgJ2JuLXRleHQnOiB7ZjogJ3RleHQnLCB0eXBlOiAxfSxcclxuICAnYm4taHRtbCc6IHtmOiAnaHRtbCcsIHR5cGU6IDF9LFxyXG4gICdibi12YWwnOiB7ZjogJ3NldFZhbHVlJywgdHlwZTogMX0sXHJcbiAgJ2JuLXNob3cnOiB7ZjogJ3NldFZpc2libGUnLCB0eXBlOiAxfSxcclxuICAnYm4tc3R5bGUnOiB7ZjogJ2NzcycsIHR5cGU6IDJ9LFxyXG4gICdibi1hdHRyJzoge2Y6ICdhdHRyJywgdHlwZTogMn0sXHJcbiAgJ2JuLXByb3AnOiB7ZjogJ3Byb3AnLCB0eXBlOiAyfSxcclxuICAnYm4tZGF0YSc6IHtmOiAnc2V0RGF0YScsIHR5cGU6IDJ9LFxyXG4gICdibi1jbGFzcyc6IHtmOiAnc2V0Q2xhc3MnLCB0eXBlOiAyfSxcclxuICAnYm4tY29udHJvbCc6IHt0eXBlOiA0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKGN0eCwgZGF0YSwgdmFycywgZXhjbHVkZUVsdCkge1xyXG5cclxuICAvL2NvbnNvbGUubG9nKCd1cGRhdGUnLCB2YXJzKVxyXG5cclxuICBpZiAodHlwZW9mIHZhcnMgPT0gJ3N0cmluZycpIHtcclxuICAgIHZhcnMgPSB2YXJzLnNwbGl0KCcsJylcclxuICB9XHJcblxyXG4gIHZhcnMuZm9yRWFjaChmdW5jdGlvbih2YXJpYWJsZSkge1xyXG4gICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyaWFibGUpXHJcbiAgICBcclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgIHVwZGF0ZShjdHgsIGRhdGEsIE9iamVjdC5rZXlzKHZhbHVlKS5tYXAoaSA9PiB2YXJpYWJsZSArICcuJyArIGkpLCBleGNsdWRlRWx0KVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKGN0eFt2YXJpYWJsZV0pIHtcclxuICAgICAgY3R4W3ZhcmlhYmxlXS5mb3JFYWNoKGZ1bmN0aW9uKGFjdGlvbikge1xyXG4gICAgICAgIGxldCB7dHlwZSwgZiwgZWx0LCBuYW1lLCB0ZW1wbGF0ZSwgaXRlcn0gPSBhY3Rpb25cclxuICAgICAgICBpZiAoZWx0ID09IGV4Y2x1ZGVFbHQpIHtcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSA9PSAxKSB7XHJcbiAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCB2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMikge1xyXG4gICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgbmFtZSwgdmFsdWUpXHJcbiAgICAgICAgfSAgIFxyXG4gICAgICAgIGlmICh0eXBlID09IDMgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgZWx0LmVtcHR5KClcclxuICAgICAgICAgICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGl0ZW1EYXRhID0gJC5leHRlbmQoe30sIGRhdGEpXHJcbiAgICAgICAgICAgICAgaXRlbURhdGFbaXRlcl0gPSBpdGVtXHJcbiAgICAgICAgICAgICAgdmFyICRpdGVtID0gdGVtcGxhdGUuY2xvbmUoKVxyXG4gICAgICAgICAgICAgIHByb2Nlc3MoJGl0ZW0sIGl0ZW1EYXRhKVxyXG4gICAgICAgICAgICAgIGVsdC5hcHBlbmQoJGl0ZW0pICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NFdmVudHMocm9vdCwgZXZlbnRzKSB7XHJcbiAgcm9vdC5ibkZpbmQoYFtibi1ldmVudF1gKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgZWx0ID0gJCh0aGlzKVxyXG4gICAgICBsZXQgYXR0clZhbHVlID0gZWx0LmF0dHIoJ2JuLWV2ZW50JylcclxuICAgICAgZWx0LnJlbW92ZUF0dHIoJ2JuLWV2ZW50JylcclxuICAgICAgXHJcbiAgICAgIHNwbGl0QXR0cihhdHRyVmFsdWUsIGZ1bmN0aW9uKGV2dE5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgbGV0IGZuICA9IGV2ZW50c1t2YWx1ZV1cclxuICAgICAgICBpZiAodHlwZW9mIGZuID09ICdmdW5jdGlvbicpIHsgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgW25hbWUsIHNlbGVjdG9yXSA9IGV2dE5hbWUuc3BsaXQoJy4nKVxyXG5cclxuICAgICAgICAgIGlmIChzZWxlY3RvciAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZWx0Lm9uKG5hbWUsICcuJyArIHNlbGVjdG9yLCBmbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlbHQub24obmFtZSwgZm4pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICBcclxuICAgIH0pXHJcbiAgICAgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3Mocm9vdCwgZGF0YSwgY3JlYXRlQ29udHJvbCkge1xyXG5cclxuXHJcbiAgbGV0IGN0eCA9IHt9XHJcbiAgXHJcbiAgZm9yKGxldCBkaXIgaW4gbWFwKSB7XHJcbiAgICBcclxuXHJcbiAgICByb290LmJuRmluZChgWyR7ZGlyfV1gKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgZWx0ID0gJCh0aGlzKVxyXG4gICAgICBsZXQgYXR0clZhbHVlID0gZWx0LmF0dHIoZGlyKVxyXG4gICAgICBlbHQucmVtb3ZlQXR0cihkaXIpXHJcblxyXG4gICAgICBsZXQge3R5cGUsIGZ9ID0gbWFwW2Rpcl1cclxuICAgICAgXHJcbiAgICAgIGlmICh0eXBlID09IDEpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgYXR0clZhbHVlKVxyXG4gICAgICAgICAgLy9lbHQudGV4dChkYXRhW2F0dHJWYWx1ZV0pXHJcbiAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIHZhbHVlKVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgaWYgKGRpciA9PSAnYm4tdmFsJykge1xyXG4gICAgICAgICAgbGV0IHVwZGF0ZUV2dCA9IGVsdC5hdHRyKCdibi11cGRhdGUnKVxyXG4gICAgICAgICAgaWYgKHVwZGF0ZUV2dCkge1xyXG4gICAgICAgICAgICBlbHQucmVtb3ZlQXR0cignYm4tdXBkYXRlJylcclxuICAgICAgICAgICAgZWx0Lm9uKHVwZGF0ZUV2dCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgcm9vdC50cmlnZ2VyKCdkYXRhOnVwZGF0ZScsIFthdHRyVmFsdWUsIGVsdC5nZXRWYWx1ZSgpLCBlbHRdKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdHhbYXR0clZhbHVlXSA9IGN0eFthdHRyVmFsdWVdIHx8IFtdXHJcbiAgICAgICAgY3R4W2F0dHJWYWx1ZV0ucHVzaCh7ZiwgZWx0LCB0eXBlfSkgICAgICAgIFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZSA9PSA0ICYmIHR5cGVvZiBjcmVhdGVDb250cm9sID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBjcmVhdGVDb250cm9sKGF0dHJWYWx1ZSwgZWx0KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZSA9PSAyKSB7XHJcblxyXG4gICAgICAgICAgc3BsaXRBdHRyKGF0dHJWYWx1ZSwgZnVuY3Rpb24obmFtZSwgdmFyTmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIHZhck5hbWUpXHJcbiAgICAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHhbdmFyTmFtZV0gPSBjdHhbdmFyTmFtZV0gfHwgW11cclxuICAgICAgICAgICAgY3R4W3Zhck5hbWVdLnB1c2goe2YsIGVsdCwgdHlwZSwgbmFtZX0pICBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICB9XHJcbiAgICAgICBcclxuICAgICAgIFxyXG4gICAgICBpZiAodHlwZSA9PSAzKSB7XHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZWx0LmNoaWxkcmVuKCkucmVtb3ZlKCkuY2xvbmUoKVxyXG4gICAgICAgIGxldCBbaXRlciwgLCB2YXJOYW1lXSA9IGF0dHJWYWx1ZS5zcGxpdCgnICcpXHJcbiAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyTmFtZSlcclxuICAgICAgICBcclxuICAgICAgICBjdHhbdmFyTmFtZV0gPSBjdHhbdmFyTmFtZV0gfHwgW11cclxuICAgICAgICBjdHhbdmFyTmFtZV0ucHVzaCh7ZWx0LCB0eXBlLCB0ZW1wbGF0ZSwgaXRlcn0pICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZGF0YSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICB2YXIgaXRlbURhdGEgPSAkLmV4dGVuZCh7fSwgZGF0YSlcclxuICAgICAgICAgICBpdGVtRGF0YVtpdGVyXSA9IGl0ZW1cclxuICAgICAgICAgICB2YXIgJGl0ZW0gPSB0ZW1wbGF0ZS5jbG9uZSgpXHJcbiAgICAgICAgICAgcHJvY2VzcygkaXRlbSwgaXRlbURhdGEsIGNyZWF0ZUNvbnRyb2wpXHJcbiAgICAgICAgICAgZWx0LmFwcGVuZCgkaXRlbSkgICAgICAgICAgXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgICBcclxuICBcclxuICB9XHJcbiAgXHJcblxyXG4gIHJldHVybiBjdHhcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc0JpbmRpbmdzKHJvb3QpIHtcclxuXHJcbiAgICB2YXIgZGF0YSA9IHt9XHJcblxyXG4gICAgcm9vdC5ibkZpbmQoJ2JuLWJpbmQnLCB0cnVlLCBmdW5jdGlvbihlbHQsIHZhck5hbWUpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnYm4tdGV4dCcsIHZhck5hbWUpXHJcbiAgICAgIGRhdGFbdmFyTmFtZV0gPSBlbHRcclxuICAgIH0pXHJcbiAgICByb290LmJuRmluZCgnYm4taWZhY2UnLCB0cnVlLCBmdW5jdGlvbihlbHQsIHZhck5hbWUpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnYm4tdGV4dCcsIHZhck5hbWUpXHJcbiAgICAgIGRhdGFbdmFyTmFtZV0gPSBlbHQuaWZhY2UoKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBkYXRhXHJcbiAgXHJcbn1cclxuXHJcbiQkLmJpbmRpbmcgPSB7XHJcbiAgcHJvY2VzcyxcclxuICB1cGRhdGUsXHJcbiAgcHJvY2Vzc0V2ZW50cyxcclxuICBwcm9jZXNzQmluZGluZ3NcclxufVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5sZXQgY29udHJvbHMgPSB7fVxyXG5cclxuZnVuY3Rpb24gaXNEZXBzT2soZGVwcykge1xyXG5cdHJldHVybiBkZXBzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcclxuXHJcblx0XHRyZXR1cm4gcHJldiAmJiAoY3VyICE9IHVuZGVmaW5lZClcclxuXHR9LCB0cnVlKVx0XHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQ29udHJvbChuYW1lLCBvcHRpb25zKSB7XHJcblx0aWYgKCEkJC51dGlsLmNoZWNrVHlwZShvcHRpb25zLCB7XHJcblx0XHQkZGVwczogWydzdHJpbmcnXSxcclxuXHRcdGluaXQ6ICdmdW5jdGlvbidcclxuXHR9KSkge1xyXG5cdFx0Y29uc29sZS5lcnJvcihgW0NvcmVdIHJlZ2lzdGVyQ29udHJvbDogYmFkIG9wdGlvbnNgLCBvcHRpb25zKVxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHJcblx0dmFyIGRlcHMgPSBvcHRpb25zLmRlcHMgfHwgW11cclxuXHJcblx0Y29uc29sZS5sb2coYFtDb3JlXSByZWdpc3RlciBjb250cm9sICcke25hbWV9JyB3aXRoIGRlcHNgLCBkZXBzKVxyXG5cclxuXHRjb250cm9sc1tuYW1lXSA9IHtkZXBzLCBvcHRpb25zLCBzdGF0dXM6ICdub3Rsb2FkZWQnfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDb250cm9sKG5hbWUpIHtcclxuXHR2YXIgcmV0ID0gY29udHJvbHNbbmFtZV1cclxuXHRpZiAocmV0ICYmIHJldC5zdGF0dXMgPT0gJ25vdGxvYWRlZCcpIHtcclxuXHRcdHJldC5kZXBzID0gJCQuc2VydmljZS5nZXRTZXJ2aWNlcyhyZXQuZGVwcylcclxuXHRcdHJldC5zdGF0dXMgPSBpc0RlcHNPayhyZXQuZGVwcykgPyAnb2snIDogJ2tvJ1xyXG5cdH1cclxuXHRyZXR1cm4gcmV0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2woY29udHJvbE5hbWUsIGVsdCkge1xyXG5cdGVsdC5hZGRDbGFzcyhjb250cm9sTmFtZS5yZXBsYWNlKCcuJywgJy0nKSlcclxuXHRlbHQuYWRkQ2xhc3MoJ0N1c3RvbUNvbnRyb2wnKS51bmlxdWVJZCgpXHRcclxuXHR2YXIgY3RybCA9IGdldENvbnRyb2woY29udHJvbE5hbWUpXHJcblx0XHRcclxuXHRpZiAoY3RybCA9PSB1bmRlZmluZWQpIHtcclxuXHRcdHRocm93KGBbQ29yZV0gY29udHJvbCAnJHtjb250cm9sTmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHR9XHJcblx0XHQvL2NvbnNvbGUubG9nKCdjcmVhdGVDb250cm9sJywgY29udHJvbE5hbWUsIGN0cmwpXHJcblx0aWYgKGN0cmwuc3RhdHVzID09PSAgJ29rJykge1xyXG5cdFx0XHJcblx0XHR2YXIgaWZhY2UgPSB7XHJcblx0XHRcdHByb3BzOiB7fSxcclxuXHRcdFx0bmFtZTogY29udHJvbE5hbWVcclxuXHRcdH1cclxuXHJcblx0XHRsZXQge2luaXQsIHByb3BzLCB0ZW1wbGF0ZX0gPSBjdHJsLm9wdGlvbnNcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge31cclxuXHJcblx0XHRPYmplY3Qua2V5cyhwcm9wcykuZm9yRWFjaChmdW5jdGlvbihwcm9wTmFtZSkge1xyXG5cdFx0XHRpZmFjZS5wcm9wc1twcm9wTmFtZV0gPSBlbHQuZGF0YShwcm9wTmFtZSkgfHwgcHJvcHNbcHJvcE5hbWVdXHJcblx0XHR9KVxyXG5cclxuXHRcdGlmICh0eXBlb2YgdGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0JCh0ZW1wbGF0ZSkuYXBwZW5kVG8oZWx0KVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIGpRdWVyeSkge1xyXG5cdFx0XHR0ZW1wbGF0ZS5jaGlsZHJlbigpLmNsb25lKCkuYXBwZW5kVG8oZWx0KVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0eXBlb2YgaW5pdCA9PSAnZnVuY3Rpb24nKSB7XHJcblxyXG5cdFx0XHR2YXIgYXJncyA9IFtlbHRdLmNvbmNhdChjdHJsLmRlcHMpXHJcblx0XHRcdGluaXQuYXBwbHkoaWZhY2UsIGFyZ3MpXHJcblx0XHRcdGNvbnNvbGUubG9nKGBbQ29yZV0gaW5zdGFuY2UgY29udHJvbCAnJHtjb250cm9sTmFtZX0nIHdpdGggcHJvcHNgLCBpZmFjZS5wcm9wcylcclxuXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKGBbQ29yZV0gY29udHJvbCAnJHtjb250cm9sTmFtZX0nIG1pc3NpbmcgaW5pdCBmdW5jdGlvbmApXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGVsdC5nZXQoMCkuY3RybCA9IGlmYWNlXHJcblx0XHRcclxuXHRcdHJldHVybiBpZmFjZVx0XHRcdFx0XHJcblx0fVxyXG5cclxuXHJcblxyXG59XHJcblxyXG4kJC5jb250cm9sID0ge1xyXG5cdHJlZ2lzdGVyQ29udHJvbCxcclxuXHRjcmVhdGVDb250cm9sXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIiQkLmRpYWxvZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGRpdiA9ICQoJzxkaXY+Jywge3RpdGxlOiBvcHRpb25zLnRpdGxlIHx8ICdEaWFsb2cnfSlcclxuXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnRlbXBsYXRlID09ICdzdHJpbmcnKSB7XHJcblx0XHQkKG9wdGlvbnMudGVtcGxhdGUpLmFwcGVuZFRvKGRpdilcclxuXHR9XHRcclxuXHJcblx0dmFyIGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihkaXYsIG9wdGlvbnMpXHJcblxyXG5cdHZhciBkbGdPcHRpb25zID0gJC5leHRlbmQoe1xyXG5cdFx0YXV0b09wZW46IGZhbHNlLFxyXG5cdFx0bW9kYWw6IHRydWUsXHJcblx0XHR3aWR0aDogJ2F1dG8nLFx0XHRcclxuXHR9LCBvcHRpb25zKVxyXG5cclxuXHR2YXIgcHJpdmF0ZSA9IHt9XHJcblxyXG5cdC8vY29uc29sZS5sb2coJ2RsZ09wdGlvbnMnLCBkbGdPcHRpb25zKVxyXG5cclxuXHRkaXYuZGlhbG9nKGRsZ09wdGlvbnMpXHJcblxyXG5cdGN0cmwuc2hvdyA9IGZ1bmN0aW9uKG9uQXBwbHkpIHtcclxuXHRcdHByaXZhdGUub25BcHBseSA9IG9uQXBwbHlcclxuXHRcdGRpdi5kaWFsb2coJ29wZW4nKVxyXG5cdH1cclxuXHJcblx0Y3RybC5oaWRlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRkaXYuZGlhbG9nKCdjbG9zZScpXHJcblx0fVxyXG5cclxuXHRjdHJsLmFwcGx5ID0gZnVuY3Rpb24ocmV0VmFsdWUpIHtcclxuXHRcdGN0cmwuaGlkZSgpXHJcblx0XHRpZiAodHlwZW9mIHByaXZhdGUub25BcHBseSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHByaXZhdGUub25BcHBseShyZXRWYWx1ZSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGN0cmwuc2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uTmFtZSwgdmFsdWUpIHtcclxuXHRcdGRpdi5kaWFsb2coJ29wdGlvbicsIG9wdGlvbk5hbWUsIHZhbHVlKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGN0cmxcclxufTtcclxuIiwiJCQuZm9ybURpYWxvZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGRpdiA9ICQoJzxkaXY+Jywge3RpdGxlOiBvcHRpb25zLnRpdGxlIHx8ICdEaWFsb2cnfSlcclxuXHJcblx0dmFyIHByaXZhdGUgPSB7fVxyXG5cclxuXHR2YXIgZm9ybSA9ICQoJzxmb3JtPicpXHJcblx0XHQuYXBwZW5kVG8oZGl2KVxyXG5cdFx0Lm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldikge1xyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdGRpdi5kaWFsb2coJ2Nsb3NlJylcclxuXHRcdFx0aWYgKHR5cGVvZiBwcml2YXRlLm9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdHByaXZhdGUub25BcHBseSgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXHJcblx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxyXG5cdFx0XHR9XHRcdFx0XHRcclxuXHRcdH0pXHJcblxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy50ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0JChvcHRpb25zLnRlbXBsYXRlKS5hcHBlbmRUbyhmb3JtKVxyXG5cdH1cdFxyXG5cclxuXHRpZiAob3B0aW9ucy50ZW1wbGF0ZSBpbnN0YW5jZW9mIGpRdWVyeSkge1xyXG5cdFx0b3B0aW9ucy50ZW1wbGF0ZS5jaGlsZHJlbigpLmNsb25lKCkuYXBwZW5kVG8oZm9ybSlcclxuXHR9XHJcblxyXG5cdHZhciBzdWJtaXRCdG4gPSAkKCc8aW5wdXQ+Jywge3R5cGU6ICdzdWJtaXQnLCBoaWRkZW46IHRydWV9KS5hcHBlbmRUbyhmb3JtKVxyXG5cclxuXHR2YXIgZGxnT3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuXHRcdGF1dG9PcGVuOiBmYWxzZSxcclxuXHRcdG1vZGFsOiB0cnVlLFxyXG5cdFx0d2lkdGg6ICdhdXRvJyxcdFxyXG5cdFx0YnV0dG9uczoge1xyXG5cdFx0XHQnQ2FuY2VsJzogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCh0aGlzKS5kaWFsb2coJ2Nsb3NlJylcclxuXHRcdFx0fSxcclxuXHRcdFx0J0FwcGx5JzogZnVuY3Rpb24oKSB7XHRcdFx0XHRcdFxyXG5cdFx0XHRcdHN1Ym1pdEJ0bi5jbGljaygpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LCBvcHRpb25zKVxyXG5cclxuXHJcblx0ZGl2LmRpYWxvZyhkbGdPcHRpb25zKVxyXG5cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHNob3c6IGZ1bmN0aW9uKG9uQXBwbHkpIHtcclxuXHRcdFx0cHJpdmF0ZS5vbkFwcGx5ID0gb25BcHBseVx0XHRcdFxyXG5cdFx0XHRkaXYuZGlhbG9nKCdvcGVuJylcdFx0XHRcclxuXHRcdH0sXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdGZvcm0uc2V0Rm9ybURhdGEoZGF0YSlcclxuXHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdH0sXHJcblxyXG5cdFx0ZGVzdHJveTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGRpdi5kaWFsb2coJ2Rlc3Ryb3knKVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuJC5mbi5ibkZpbmQ9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICByZXR1cm4gdGhpcy5maW5kKHNlbGVjdG9yKS5hZGQodGhpcy5maWx0ZXIoc2VsZWN0b3IpKVxyXG59XHJcblxyXG4kLmZuLnNldENsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpc0FjdGl2ZSkge1xyXG4gICAgaWYgKGlzQWN0aXZlKSB7XHJcbiAgICAgIHRoaXMuYWRkQ2xhc3MoY2xhc3NOYW1lKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKVxyXG4gICAgfVxyXG59XHJcblxyXG4kLmZuLnNldFZpc2libGUgPSBmdW5jdGlvbihpc1Zpc2libGUpIHtcclxuICAgIGlmIChpc1Zpc2libGUpIHtcclxuICAgICAgdGhpcy5zaG93KClcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmhpZGUoKVxyXG4gICAgfVxyXG59XHJcblxyXG4kLmZuLmlmYWNlID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuZ2V0KDApLmN0cmxcclxufVxyXG5cclxuJC5mbi5zZXREYXRhID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG5cclxuICBjb25zdCBmdW5jTmFtZSA9ICdzZXQnICsgbmFtZS5zdWJzdHIoMCwxKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHIoMSlcclxuICAvL2NvbnNvbGUubG9nKCdmdW5jTmFtZScsIGZ1bmNOYW1lKVxyXG5cclxuICBpZiAoaWZhY2UgJiYgaWZhY2UucHJvcHNbbmFtZV0gJiYgdHlwZW9mIGlmYWNlW2Z1bmNOYW1lXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBpZmFjZVtmdW5jTmFtZV0odmFsdWUpXHJcbiAgfVxyXG4gIGVsc2UgaWYgKGlmYWNlICYmICQkLmlzVmlld0NvbnRyb2xsZXIoaWZhY2UuY3RybCkgJiYgaWZhY2UuY3RybC5tb2RlbFtuYW1lXSkge1xyXG4gICAgaWZhY2UuY3RybC5zZXREYXRhKG5hbWUsIHZhbHVlKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZGF0YShuYW1lLCB2YWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbiQuZm4uc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09ICdJTlBVVCcgJiYgdGhpcy5hdHRyKCd0eXBlJykgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgdGhpcy5wcm9wKCdjaGVja2VkJywgdmFsdWUpXHJcbiAgICByZXR1cm5cclxuICB9ICBcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG5cclxuICBpZiAoaWZhY2UgJiYgdHlwZW9mIGlmYWNlLnNldFZhbHVlID09ICdmdW5jdGlvbicpIHtcclxuICAgIGlmYWNlLnNldFZhbHVlKHZhbHVlKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMudmFsKHZhbHVlKVxyXG4gIH1cclxufVxyXG5cclxuJC5mbi5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGNvbnN0IHR5cGUgPSB0aGlzLmF0dHIoJ3R5cGUnKVxyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09ICdJTlBVVCcgJiYgdHlwZSA9PSAnY2hlY2tib3gnKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wKCdjaGVja2VkJylcclxuICB9ICAgIFxyXG4gIGNvbnN0IGlmYWNlID0gdGhpcy5pZmFjZSgpXHJcbiAgaWYgKGlmYWNlICYmIHR5cGVvZiBpZmFjZS5nZXRWYWx1ZSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICByZXR1cm4gaWZhY2UuZ2V0VmFsdWUoKVxyXG4gIH1cclxuICB2YXIgcmV0ID0gdGhpcy52YWwoKVxyXG5cclxuICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdyYW5nZScpIHtcclxuICAgIHJldCA9IHBhcnNlRmxvYXQocmV0KVxyXG4gIH1cclxuICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbiQuZm4uZ2V0Rm9ybURhdGEgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgcmV0ID0ge31cclxuICB0aGlzLmZpbmQoJ1tuYW1lXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZWx0ID0gJCh0aGlzKVxyXG4gICAgdmFyIG5hbWUgPSBlbHQuYXR0cignbmFtZScpXHJcbiAgICByZXRbbmFtZV0gPSBlbHQuZ2V0VmFsdWUoKVxyXG5cclxuICB9KVxyXG5cclxuICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbiQuZm4ucmVzZXRGb3JtID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHRoaXMuZ2V0KDApLnRhZ05hbWUgPT0gXCJGT1JNXCIpIHtcclxuICAgIHRoaXMuZ2V0KDApLnJlc2V0KClcclxuICB9ICAgXHJcbn1cclxuXHJcbiQuZm4uc2V0Rm9ybURhdGEgPSBmdW5jdGlvbihkYXRhKSB7XHJcblxyXG4gIC8vY29uc29sZS5sb2coJ3NldEZvcm1EYXRhJywgZGF0YSlcclxuICB0aGlzLnJlc2V0Rm9ybSgpXHJcblxyXG4gIGZvcih2YXIgbmFtZSBpbiBkYXRhKSB7XHJcbiAgICB2YXIgdmFsdWUgPSBkYXRhW25hbWVdXHJcbiAgICB2YXIgZWx0ID0gdGhpcy5maW5kKGBbbmFtZT0ke25hbWV9XWApXHJcbiAgICBpZiAoZWx0Lmxlbmd0aCkge1xyXG4gICAgICBlbHQuc2V0VmFsdWUodmFsdWUpICAgICAgIFxyXG4gICAgfVxyXG5cclxuICBcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbiQuZm4uc2FmZUVtcHR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5maW5kKCcuQ3VzdG9tQ29udHJvbCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCBpZmFjZSA9ICQodGhpcykuaWZhY2UoKVxyXG5cclxuICAgIGlmICh0eXBlb2YgaWZhY2UuZGlzcG9zZSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIGlmYWNlLmRpc3Bvc2UoKVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gIHRoaXMuZW1wdHkoKVxyXG5cclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG59KSgpO1xyXG4iLCJcclxuKGZ1bmN0aW9uKCl7XHJcblxyXG5sZXQgc2VydmljZXMgPSB7fVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0U2VydmljZXMoZGVwcykge1xyXG5cdC8vY29uc29sZS5sb2coJ1tDb3JlXSBnZXRTZXJ2aWNlcycsIGRlcHMpXHJcblx0cmV0dXJuIGRlcHMubWFwKGZ1bmN0aW9uKGRlcE5hbWUpIHtcclxuXHRcdHZhciBzcnYgPSBzZXJ2aWNlc1tkZXBOYW1lXVxyXG5cdFx0aWYgKHNydikge1xyXG5cdFx0XHRpZiAoc3J2LnN0YXR1cyA9PSAnbm90bG9hZGVkJykge1xyXG5cdFx0XHRcdHZhciBkZXBzMiA9IGdldFNlcnZpY2VzKHNydi5kZXBzKVxyXG5cdFx0XHRcdHZhciBjb25maWcgPSBzcnYuY29uZmlnIHx8IHt9XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYFtDb3JlXSBpbnN0YW5jZSBzZXJ2aWNlICcke2RlcE5hbWV9JyB3aXRoIGNvbmZpZ2AsIGNvbmZpZylcclxuXHRcdFx0XHR2YXIgYXJncyA9IFtjb25maWddLmNvbmNhdChkZXBzMilcclxuXHRcdFx0XHRzcnYub2JqID0gc3J2LmZuLmFwcGx5KG51bGwsIGFyZ3MpXHJcblx0XHRcdFx0c3J2LnN0YXR1cyA9ICdyZWFkeSdcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gc3J2Lm9ialx0XHRcdFx0XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly9zcnYuc3RhdHVzID0gJ25vdHJlZ2lzdGVyZWQnXHJcblx0XHRcdHRocm93KGBbQ29yZV0gc2VydmljZSAnJHtkZXBOYW1lfScgaXMgbm90IHJlZ2lzdGVyZWRgKVxyXG5cdFx0fVxyXG5cclxuXHR9KVxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGNvbmZpZ3VyZVNlcnZpY2UobmFtZSwgY29uZmlnKSB7XHJcblx0Y29uc29sZS5sb2coJ1tDb3JlXSBjb25maWd1cmVTZXJ2aWNlJywgbmFtZSwgY29uZmlnKVxyXG5cdGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJyB8fCB0eXBlb2YgY29uZmlnICE9ICdvYmplY3QnKSB7XHJcblx0XHRjb25zb2xlLndhcm4oJ1tDb3JlXSBjb25maWd1cmVTZXJ2aWNlIGNhbGxlZCB3aXRoIGJhZCBhcmd1bWVudHMnKVxyXG5cdFx0cmV0dXJuXHJcblx0fSBcdFxyXG5cclxuXHR2YXIgc3J2ID0gc2VydmljZXNbbmFtZV1cclxuXHRpZiAoc3J2KSB7XHJcblx0XHRzcnYuY29uZmlnID0gY29uZmlnXHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0dGhyb3coYFtjb25maWd1cmVTZXJ2aWNlXSBzZXJ2aWNlICcke25hbWV9JyBpcyBub3QgcmVnaXN0ZXJlZGApXHJcblx0fVxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJTZXJ2aWNlKG5hbWUsIGFyZzEsIGFyZzIpIHtcclxuXHR2YXIgZGVwcyA9IFtdXHJcblx0dmFyIGZuID0gYXJnMVxyXG5cdGlmIChBcnJheS5pc0FycmF5KGFyZzEpKSB7XHJcblx0XHRkZXBzID0gYXJnMVxyXG5cdFx0Zm4gPSBhcmcyXHJcblx0fVxyXG5cdGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJyB8fCB0eXBlb2YgZm4gPT0gJ3VuZGVmaW5lZCcgfHwgIUFycmF5LmlzQXJyYXkoZGVwcykpIHtcclxuXHRcdHRocm93KCdbQ29yZV0gcmVnaXN0ZXJTZXJ2aWNlIGNhbGxlZCB3aXRoIGJhZCBhcmd1bWVudHMnKVxyXG5cdH0gXHJcblx0Y29uc29sZS5sb2coYFtDb3JlXSByZWdpc3RlciBzZXJ2aWNlICcke25hbWV9JyB3aXRoIGRlcHNgLCBkZXBzKVxyXG5cclxuXHRzZXJ2aWNlc1tuYW1lXSA9IHtkZXBzLCBmbiwgc3RhdHVzOiAnbm90bG9hZGVkJ31cclxufVxyXG5cclxuJCQuc2VydmljZSA9IHtcclxuXHRyZWdpc3RlclNlcnZpY2UsXHJcblx0Y29uZmlndXJlU2VydmljZSxcclxuXHRnZXRTZXJ2aWNlc1xyXG59XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG5cclxuZnVuY3Rpb24gcmVhZFRleHRGaWxlKGZpbGVOYW1lLCBvblJlYWQpIHtcclxuXHR2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuXHJcblx0ZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0eXBlb2Ygb25SZWFkID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0b25SZWFkKGZpbGVSZWFkZXIucmVzdWx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmaWxlUmVhZGVyLnJlYWRBc1RleHQoZmlsZU5hbWUpXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZWFkRmlsZUFzRGF0YVVSTChmaWxlTmFtZSwgb25SZWFkKSB7XHJcblx0dmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXHJcblxyXG5cdGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodHlwZW9mIG9uUmVhZCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdG9uUmVhZChmaWxlUmVhZGVyLnJlc3VsdClcclxuXHRcdH1cclxuXHR9XHJcblx0ZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGVOYW1lKVxyXG59XHJcblxyXG5cclxudmFyIGlucHV0RmlsZSA9ICQoJzxpbnB1dD4nLCB7dHlwZTogJ2ZpbGUnfSkub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG5cdHZhciBvbkFwcGx5ID0gJCh0aGlzKS5kYXRhKCdvbkFwcGx5JylcclxuXHR2YXIgZmlsZU5hbWUgPSB0aGlzLmZpbGVzWzBdXHJcblx0aWYgKHR5cGVvZiBvbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdG9uQXBwbHkoZmlsZU5hbWUpXHJcblx0fVxyXG59KVxyXG5cclxuZnVuY3Rpb24gb3BlbkZpbGVEaWFsb2cob25BcHBseSkge1xyXG5cdGlucHV0RmlsZS5kYXRhKCdvbkFwcGx5Jywgb25BcHBseSlcclxuXHRpbnB1dEZpbGUuY2xpY2soKVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc0ltYWdlKGZpbGVOYW1lKSB7XHJcblx0cmV0dXJuICgvXFwuKGdpZnxqcGd8anBlZ3xwbmcpJC9pKS50ZXN0KGZpbGVOYW1lKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkYXRhVVJMdG9CbG9iKGRhdGFVUkwpIHtcclxuICAvLyBEZWNvZGUgdGhlIGRhdGFVUkxcclxuICBjb25zdCBbICwgbWltZVR5cGUsIGVuY29kYWdlLCBkYXRhXSA9IGRhdGFVUkwuc3BsaXQoL1s6LDtdLylcclxuICBpZiAoZW5jb2RhZ2UgIT0gJ2Jhc2U2NCcpIHtcclxuICBcdHJldHVyblxyXG4gIH1cclxuXHJcbiAgLy9jb25zb2xlLmxvZygnbWltZVR5cGUnLCBtaW1lVHlwZSlcclxuICAvL2NvbnNvbGUubG9nKCdlbmNvZGFnZScsIGVuY29kYWdlKVxyXG4gIC8vY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKVxyXG5cclxuICB2YXIgYmluYXJ5ID0gYXRvYihkYXRhKVxyXG4gLy8gQ3JlYXRlIDgtYml0IHVuc2lnbmVkIGFycmF5XHJcbiAgdmFyIGFycmF5ID0gW11cclxuICBmb3IodmFyIGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgXHRhcnJheS5wdXNoKGJpbmFyeS5jaGFyQ29kZUF0KGkpKVxyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJuIG91ciBCbG9iIG9iamVjdFxyXG5cdHJldHVybiBuZXcgQmxvYihbIG5ldyBVaW50OEFycmF5KGFycmF5KSBdLCB7bWltZVR5cGV9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU3R5bGUoc3R5bGVGaWxlUGF0aCwgY2FsbGJhY2spIHtcdFxyXG5cdC8vY29uc29sZS5sb2coJ1tDb3JlXSBsb2FkU3R5bGUnLCBzdHlsZUZpbGVQYXRoKVxyXG5cclxuXHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNzc09rID0gJCgnaGVhZCcpLmZpbmQoYGxpbmtbaHJlZj1cIiR7c3R5bGVGaWxlUGF0aH1cIl1gKS5sZW5ndGhcclxuXHRcdGlmIChjc3NPayAhPSAxKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBsb2FkaW5nICcke3N0eWxlRmlsZVBhdGh9JyBzdHlsZWApXHJcblx0XHRcdCQoJzxsaW5rPicsIHtocmVmOiBzdHlsZUZpbGVQYXRoLCByZWw6ICdzdHlsZXNoZWV0J30pXHJcblx0XHRcdC5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGAnJHtzdHlsZUZpbGVQYXRofScgbG9hZGVkYClcclxuXHRcdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbygkKCdoZWFkJykpXHJcblx0XHR9XHJcblx0fSlcclxufVxyXG5cclxuXHJcblxyXG5cdFxyXG5mdW5jdGlvbiBpc09iamVjdChhKSB7XHJcblx0cmV0dXJuICh0eXBlb2YgYSA9PSAnb2JqZWN0JykgJiYgIUFycmF5LmlzQXJyYXkoYSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tUeXBlKHZhbHVlLCB0eXBlLCBpc09wdGlvbmFsKSB7XHJcblx0Ly9jb25zb2xlLmxvZygnY2hlY2tUeXBlJyx2YWx1ZSwgdHlwZSwgaXNPcHRpb25hbClcclxuXHRpZiAodHlwZW9mIHZhbHVlID09ICd1bmRlZmluZWQnICYmIGlzT3B0aW9uYWwgPT09IHRydWUpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIHR5cGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT0gdHlwZVxyXG5cdH1cclxuXHJcblx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodHlwZSkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHR5cGUubGVuZ3RoID09IDApIHtcclxuXHRcdFx0cmV0dXJuIHRydWUgLy8gbm8gaXRlbSB0eXBlIGNoZWNraW5nXHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgdmFsdWUpIHtcclxuXHRcdFx0dmFyIHJldCA9IGZhbHNlXHJcblx0XHRcdGZvcihsZXQgdCBvZiB0eXBlKSB7XHJcblx0XHRcdFx0cmV0IHw9IGNoZWNrVHlwZShpLCB0KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghcmV0KSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKGlzT2JqZWN0KHR5cGUpKSB7XHJcblx0XHRpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgZiBpbiB0eXBlKSB7XHJcblxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdmJywgZiwgJ3ZhbHVlJywgdmFsdWUpXHJcblx0XHRcdHZhciBuZXdUeXBlID0gdHlwZVtmXVxyXG5cclxuXHRcdFx0dmFyIGlzT3B0aW9uYWwgPSBmYWxzZVxyXG5cdFx0XHRpZiAoZi5zdGFydHNXaXRoKCckJykpIHtcclxuXHRcdFx0XHRmID0gZi5zdWJzdHIoMSlcclxuXHRcdFx0XHRpc09wdGlvbmFsID0gdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghY2hlY2tUeXBlKHZhbHVlW2ZdLCBuZXdUeXBlLCBpc09wdGlvbmFsKSkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cdHJldHVybiBmYWxzZVxyXG59XHRcclxuXHJcblxyXG5cclxuJCQudXRpbCA9IHtcclxuXHRyZWFkVGV4dEZpbGUsXHJcblx0cmVhZEZpbGVBc0RhdGFVUkwsXHJcblx0b3BlbkZpbGVEaWFsb2csXHJcblx0aXNJbWFnZSxcclxuXHRkYXRhVVJMdG9CbG9iLFxyXG5cdGxvYWRTdHlsZSxcclxuXHRjaGVja1R5cGVcclxufVxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxuY2xhc3MgVmlld0NvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoZWx0LCBvcHRpb25zKSB7XHJcbiAgICBcdC8vY29uc29sZS5sb2coJ1ZpZXdDb250cm9sbGVyJywgb3B0aW9ucylcclxuICAgIFx0aWYgKHR5cGVvZiBlbHQgPT0gJ3N0cmluZycpIHtcclxuICAgIFx0XHRlbHQgPSAkKGVsdClcclxuICAgIFx0fVxyXG4gICAgICAgIGlmIChlbHQuaGFzQ2xhc3MoJ0N1c3RvbUNvbnRyb2wnKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdkb25cXCd0IHVzZSB2aWV3Q29udHJvbGxlciBvbiBjb250cm9sIHRhZycpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICBcdG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucylcclxuICAgICAgICB0aGlzLmVsdCA9IGVsdFxyXG5cclxuICAgICAgICBlbHQub24oJ2RhdGE6dXBkYXRlJywgKGV2LCBuYW1lLCB2YWx1ZSwgZXhjbHVkZUVsdCkgPT4ge1xyXG4gICAgICAgIFx0Ly9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSBkYXRhOmNoYW5nZScsIG5hbWUsIHZhbHVlKVxyXG4gICAgICAgIFx0dGhpcy5zZXREYXRhKG5hbWUsIHZhbHVlLCBleGNsdWRlRWx0KVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMubW9kZWwgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy5kYXRhKVxyXG4gICAgICAgIHRoaXMucnVsZXMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy5ydWxlcylcclxuICAgICAgICB0aGlzLndhdGNoZXMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy53YXRjaGVzKVxyXG5cclxuICAgICAgICAvLyBnZW5lcmF0ZSBhdXRvbWF0aWMgcnVsZXMgZm9yIGNvbXB1dGVkIGRhdGEgKGFrYSBmdW5jdGlvbilcclxuICAgICAgICBmb3IodmFyIGsgaW4gdGhpcy5tb2RlbCkge1xyXG4gICAgICAgIFx0dmFyIGRhdGEgPSB0aGlzLm1vZGVsW2tdXHJcbiAgICAgICAgXHRpZiAodHlwZW9mIGRhdGEgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIFx0XHR2YXIgZnVuY1RleHQgPSBkYXRhLnRvU3RyaW5nKClcclxuICAgICAgICBcdFx0Ly9jb25zb2xlLmxvZygnZnVuY1RleHQnLCBmdW5jVGV4dClcclxuICAgICAgICBcdFx0dmFyIHJ1bGVzID0gW11cclxuICAgICAgICBcdFx0ZnVuY1RleHQucmVwbGFjZSgvdGhpcy4oW2EtekEtWjAtOV8tXXsxLH0pL2csIGZ1bmN0aW9uKG1hdGNoLCBjYXB0dXJlT25lKSB7XHJcbiAgICAgICAgXHRcdFx0Ly9jb25zb2xlLmxvZygnY2FwdHVyZU9uZScsIGNhcHR1cmVPbmUpXHJcbiAgICAgICAgXHRcdFx0cnVsZXMucHVzaChjYXB0dXJlT25lKVxyXG4gICAgICAgIFx0XHR9KVxyXG4gICAgICAgIFx0XHR0aGlzLnJ1bGVzW2tdID0gcnVsZXMudG9TdHJpbmcoKVxyXG4gICAgICAgIFx0fVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygncnVsZXMnLCB0aGlzLnJ1bGVzKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gJCQuYmluZGluZy5wcm9jZXNzKGVsdCwgdGhpcy5tb2RlbCwgJCQuY29udHJvbC5jcmVhdGVDb250cm9sKVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmV2ZW50cyA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAkJC5iaW5kaW5nLnByb2Nlc3NFdmVudHMoZWx0LCBvcHRpb25zLmV2ZW50cylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2NvcGUgPSAkJC5iaW5kaW5nLnByb2Nlc3NCaW5kaW5ncyhlbHQpXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc2NvcGUnLCB0aGlzLnNjb3BlKVxyXG4gICAgICAgXHJcblxyXG4gICAgfSBcclxuXHJcbiAgICBzZXREYXRhKGFyZzEsIGFyZzIsIGV4Y2x1ZGVFbHQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHNldERhdGEnLCBhcmcxLCBhcmcyKVxyXG4gICAgICAgIHZhciBkYXRhID0gYXJnMVxyXG4gICAgICAgIGlmICh0eXBlb2YgYXJnMSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIFx0ZGF0YSA9IHt9XHJcbiAgICAgICAgXHRkYXRhW2FyZzFdID0gYXJnMlxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHNldERhdGEnLCBkYXRhKVxyXG4gICAgICAgICQuZXh0ZW5kKHRoaXMubW9kZWwsIGRhdGEpXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbW9kZWwnLCB0aGlzLm1vZGVsKVxyXG4gICAgICAgIHRoaXMudXBkYXRlKE9iamVjdC5rZXlzKGRhdGEpLCBleGNsdWRlRWx0KVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShmaWVsZHNOYW1lLCBleGNsdWRlRWx0KSB7XHJcbiAgICBcdC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gdXBkYXRlJywgZmllbGRzTmFtZSlcclxuICAgIFx0aWYgKHR5cGVvZiBmaWVsZHNOYW1lID09ICdzdHJpbmcnKSB7XHJcbiAgICBcdFx0ZmllbGRzTmFtZSA9IGZpZWxkc05hbWUuc3BsaXQoJywnKVxyXG4gICAgXHR9XHJcblxyXG5cclxuICAgIFx0aWYgKEFycmF5LmlzQXJyYXkoZmllbGRzTmFtZSkpIHtcclxuICAgIFx0XHR2YXIgZmllbGRzU2V0ID0ge31cclxuICAgIFx0XHRmaWVsZHNOYW1lLmZvckVhY2goKGZpZWxkKSA9PiB7XHJcblxyXG4gICAgXHRcdFx0dmFyIHdhdGNoID0gdGhpcy53YXRjaGVzW2ZpZWxkXVxyXG4gICAgXHRcdFx0aWYgKHR5cGVvZiB3YXRjaCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBcdFx0XHRcdHdhdGNoLmNhbGwobnVsbCwgdGhpcy5tb2RlbFtmaWVsZF0pXHJcbiAgICBcdFx0XHR9XHJcbiAgICBcdFx0XHRmaWVsZHNTZXRbZmllbGRdID0gMVxyXG5cclxuICAgIFx0XHRcdGZvcih2YXIgcnVsZSBpbiB0aGlzLnJ1bGVzKSB7XHJcbiAgICBcdFx0XHRcdGlmICh0aGlzLnJ1bGVzW3J1bGVdLnNwbGl0KCcsJykuaW5kZXhPZihmaWVsZCkgIT0gLTEpIHtcclxuICAgIFx0XHRcdFx0XHRmaWVsZHNTZXRbcnVsZV0gPSAxXHJcbiAgICBcdFx0XHRcdH1cclxuICAgIFx0XHRcdH1cclxuICAgIFx0XHR9KVxyXG5cclxuXHJcbiAgICBcdFx0JCQuYmluZGluZy51cGRhdGUodGhpcy5jdHgsIHRoaXMubW9kZWwsIE9iamVjdC5rZXlzKGZpZWxkc1NldCksIGV4Y2x1ZGVFbHQpXHJcbiAgICBcdH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbiQkLnZpZXdDb250cm9sbGVyID0gZnVuY3Rpb24oZWx0LCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IFZpZXdDb250cm9sbGVyKGVsdCwgb3B0aW9ucylcclxufVxyXG5cclxuJCQuaXNWaWV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKG8pIHtcclxuICAgIHJldHVybiBvIGluc3RhbmNlb2YgVmlld0NvbnRyb2xsZXJcclxufVxyXG5cclxufSkoKTtcclxuIiwiXG4kJC5zZXJ2aWNlLnJlZ2lzdGVyU2VydmljZSgnYnJhaW5qcy5odHRwJywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0Z2V0KHVybCkge1xuXHRcdFx0cmV0dXJuICQuZ2V0SlNPTih1cmwpXG5cdFx0fSxcblxuXG5cdFx0cG9zdCh1cmwsIGRhdGEpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0dXJsIDogdXJsLFxuXHRcdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0XHRkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxuXHRcdFx0fSlcblx0XHR9LFxuXG5cdFx0cHV0KHVybCwgZGF0YSkge1xuXHRcdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogJ1BVVCcsXG5cdFx0XHRcdHVybCA6IHVybCxcblx0XHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdFx0ZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSlcblx0XHRcdH0pXG5cdFx0fSxcdFx0XHRcblxuXHRcdGRlbGV0ZSh1cmwpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6ICdERUxFVEUnLFxuXHRcdFx0XHR1cmwgOiB1cmwsXG5cdFx0XHR9KVx0XHRcdFx0XG5cdFx0fSxcblxuXHRcdHBvc3RGb3JtRGF0YSh1cmwsIGZkKSB7XG5cdFx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdCAgdXJsOiB1cmwsXG5cdFx0XHQgIHR5cGU6IFwiUE9TVFwiLFxuXHRcdFx0ICBkYXRhOiBmZCxcblx0XHRcdCAgcHJvY2Vzc0RhdGE6IGZhbHNlLCAgLy8gaW5kaXF1ZSDDoCBqUXVlcnkgZGUgbmUgcGFzIHRyYWl0ZXIgbGVzIGRvbm7DqWVzXG5cdFx0XHQgIGNvbnRlbnRUeXBlOiBmYWxzZSAgIC8vIGluZGlxdWUgw6AgalF1ZXJ5IGRlIG5lIHBhcyBjb25maWd1cmVyIGxlIGNvbnRlbnRUeXBlXG5cdFx0XHR9KVx0XHRcdFx0XG5cdFx0fVxuXG5cdFx0XG5cdH1cbn0pO1xuXG5cblxuXG5cblxuIl19
