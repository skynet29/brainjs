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
							elt.empty().append(newCtrl)	
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







//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiY29udHJvbHMvY2hlY2tncm91cC5qcyIsImNvbnRyb2xzL2lucHV0Z3JvdXAuanMiLCJjb250cm9scy9uYXZiYXIuanMiLCJjb250cm9scy9yYWRpb2dyb3VwLmpzIiwiY29udHJvbHMvcm91dGVyLmpzIiwiY29udHJvbHMvdGFicy5qcyIsImxpYi9iaW5kaW5nLmpzIiwibGliL2NvbnRyb2wuanMiLCJsaWIvZGlhbG9nQ29udHJvbGxlciAuanMiLCJsaWIvZm9ybURpYWxvZ0NvbnRyb2xsZXIuanMiLCJsaWIvanF1ZXJ5LWV4dC5qcyIsImxpYi9zZXJ2aWNlLmpzIiwibGliL3V0aWwuanMiLCJsaWIvdmlld0NvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9odHRwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnJhaW5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG5cclxuXHR3aW5kb3cuJCQgPSB7fVxyXG5cdFxyXG59KSgpOyIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLmNoZWNrZ3JvdXAnLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0ZWx0Lm9uKCdjbGljaycsICdpbnB1dFt0eXBlPWNoZWNrYm94XScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZWx0LnRyaWdnZXIoJ2lucHV0Jylcblx0XHR9KVxuXG5cdFx0dGhpcy5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHJldCA9IFtdXG5cdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1jaGVja2JveF06Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldC5wdXNoKCQodGhpcykudmFsKCkpXG5cdFx0XHR9KVx0XG5cdFx0XHRyZXR1cm4gcmV0XHRcblx0XHR9XG5cblx0XHR0aGlzLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1jaGVja2JveF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcykucHJvcCgnY2hlY2tlZCcsIHZhbHVlLmluZGV4T2YoJCh0aGlzKS52YWwoKSkgPj0gMClcblx0XHRcdFx0fSlcblx0XHRcdH1cdFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZShlbHQudmFsKCkpXG5cblx0fVxuXG59KTtcblxuXG5cblxuXG5cbiIsIlxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMuaW5wdXRncm91cCcsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHR2YXIgaWQgPSBlbHQuY2hpbGRyZW4oJ2lucHV0JykudW5pcXVlSWQoKS5hdHRyKCdpZCcpXG5cdFx0ZWx0LmNoaWxkcmVuKCdsYWJlbCcpLmF0dHIoJ2ZvcicsIGlkKVxuXHR9XG59KTtcbiIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLm5hdmJhcicsIHtcblx0cHJvcHM6IHtcblx0XHRhY3RpdmVDb2xvcjogJ3czLWdyZWVuJyxcblx0XHR0eXBlOiAnaG9yaXpvbnRhbCdcblx0fSxcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCB7YWN0aXZlQ29sb3IsIHR5cGV9ID0gdGhpcy5wcm9wc1xuXG5cdFx0ZWx0LmFkZENsYXNzKCh0eXBlID09ICd2ZXJ0aWNhbCcpID8gJ3czLWJhci1ibG9jayc6ICd3My1iYXInKVxuXHRcdGVsdC5jaGlsZHJlbignYScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCd3My1iYXItaXRlbSB3My1idXR0b24nKVxuXHRcdH0pXG5cblx0XHRjb25zdCBuZXdSb3V0ZSA9ICQkLmdldE5ld1JvdXRlKClcblx0XHRlbHQuY2hpbGRyZW4oYGFbaHJlZj1cIiMke25ld1JvdXRlfVwiXWApLmFkZENsYXNzKGFjdGl2ZUNvbG9yKVxuXG5cdFx0JCh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZygnW05hdmJhckNvbnRyb2xdIHJvdXRlQ2hhbmdlJywgbmV3Um91dGUpXG5cdFx0XHRjb25zdCBuZXdSb3V0ZSA9ICQkLmdldE5ld1JvdXRlKClcblxuXHRcdFx0ZWx0LmNoaWxkcmVuKGBhLiR7YWN0aXZlQ29sb3J9YCkucmVtb3ZlQ2xhc3MoYWN0aXZlQ29sb3IpXHRcblx0XHRcdGVsdC5jaGlsZHJlbihgYVtocmVmPVwiIyR7bmV3Um91dGV9XCJdYCkuYWRkQ2xhc3MoYWN0aXZlQ29sb3IpXG5cblx0XHR9KVx0XG5cblx0fVxuXG59KTtcblxuXG5cblxuXG5cbiIsIlxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMucmFkaW9ncm91cCcsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRlbHQub24oJ2NsaWNrJywgJ2lucHV0W3R5cGU9cmFkaW9dJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdyYWRpb2dyb3VwIGNsaWNrJylcblx0XHRcdGVsdC5maW5kKCdpbnB1dFt0eXBlPXJhZGlvXTpjaGVja2VkJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKVxuXHRcdFx0JCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcblx0XHRcdGVsdC50cmlnZ2VyKCdpbnB1dCcpXG5cdFx0fSlcblx0XHRcblxuXHRcdHRoaXMuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBlbHQuZmluZCgnaW5wdXRbdHlwZT1yYWRpb106Y2hlY2tlZCcpLnZhbCgpXG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1yYWRpb10nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCB2YWx1ZSA9PT0gJCh0aGlzKS52YWwoKSlcblx0XHRcdH0pXHRcdFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZShlbHQudmFsKCkpXG5cdH1cbn0pO1xuXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIG1hdGNoUm91dGUocm91dGUsIHBhdHRlcm4pIHtcblx0XHQvL2NvbnNvbGUubG9nKCdtYXRjaFJvdXRlJywgcm91dGUsIHBhdHRlcm4pXG5cdFx0dmFyIHJvdXRlU3BsaXQgPSByb3V0ZS5zcGxpdCgnLycpXG5cdFx0dmFyIHBhdHRlcm5TcGxpdCA9IHBhdHRlcm4uc3BsaXQoJy8nKVxuXHRcdC8vY29uc29sZS5sb2cocm91dGVTcGxpdCwgcGF0dGVyblNwbGl0KVxuXHRcdHZhciByZXQgPSB7fVxuXG5cdFx0aWYgKHJvdXRlU3BsaXQubGVuZ3RoICE9IHBhdHRlcm5TcGxpdC5sZW5ndGgpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0Zm9yKHZhciBpZHggPSAwOyBpZHggPCBwYXR0ZXJuU3BsaXQubGVuZ3RoOyBpZHgrKykge1xuXHRcdFx0dmFyIHBhdGggPSBwYXR0ZXJuU3BsaXRbaWR4XVxuXHRcdFx0Ly9jb25zb2xlLmxvZygncGF0aCcsIHBhdGgpXG5cdFx0XHRpZiAocGF0aC5zdWJzdHIoMCwgMSkgPT09ICc6Jykge1xuXHRcdFx0XHRpZiAocm91dGVTcGxpdFtpZHhdLmxlbmd0aCA9PT0gMClcblx0XHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0XHRyZXRbcGF0aC5zdWJzdHIoMSldID0gcm91dGVTcGxpdFtpZHhdXG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChwYXRoICE9PSByb3V0ZVNwbGl0W2lkeF0pIHtcblx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiByZXRcblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0TmV3Um91dGUoKSB7XG5cdFx0Y29uc3QgaHJlZiA9IGxvY2F0aW9uLmhyZWZcblx0XHRjb25zdCBpZHggPSBocmVmLmluZGV4T2YoJyMnKVxuXHRcdGNvbnN0IG5ld1JvdXRlID0gKGlkeCAhPT0gLTEpICA/IGhyZWYuc3Vic3RyKGlkeCsxKSA6ICcvJ1xuXHRcdFxuXHRcdHJldHVybiBuZXdSb3V0ZVxuXHR9XG5cblx0JCQuZ2V0TmV3Um91dGUgPSBnZXROZXdSb3V0ZVxuXG5cdCQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLnJvdXRlcicsIHtcblxuXHRcdHByb3BzOiB7XG5cdFx0XHRyb3V0ZXM6IFtdXG5cdFx0fSxcblx0XHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXG5cdFx0XHQkKHdpbmRvdykub24oJ3BvcHN0YXRlJywgZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdbcm91dGVyXSBwb3BzdGF0ZScpXG5cdFx0XHRcdHByb2Nlc3NSb3V0ZShnZXROZXdSb3V0ZSgpKVxuXHRcdFx0fSlcblxuXG5cdFx0XHR2YXIgcm91dGVzID0gdGhpcy5wcm9wcy5yb3V0ZXNcblxuXHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KHJvdXRlcykpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKCdbcm91dGVyXSBiYWQgcm91dGVzJylcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cblx0XHRcdHByb2Nlc3NSb3V0ZShnZXROZXdSb3V0ZSgpKVxuXG5cdFx0XHRmdW5jdGlvbiBwcm9jZXNzUm91dGUobmV3Um91dGUpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1tyb3V0ZXJdIHByb2Nlc3NSb3V0ZScsIG5ld1JvdXRlLCByb3V0ZXMpXG5cblx0XHRcdFx0Zm9yKHZhciByb3V0ZSBvZiByb3V0ZXMpIHtcblx0XHRcdFx0XHR2YXIgcGFyYW1zID0gbWF0Y2hSb3V0ZShuZXdSb3V0ZSwgcm91dGUuaHJlZilcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGByb3V0ZTogJHtyb3V0ZS5ocmVmfSwgcGFyYW1zYCwgcGFyYW1zKVxuXHRcdFx0XHRcdGlmIChwYXJhbXMgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnW1JvdXRlckNvbnRyb2xdIHBhcmFtcycsIHBhcmFtcylcblx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygcm91dGUucmVkaXJlY3QgPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1tyb3V0ZXJdIHJlZGlyZWN0IHRvICcsIHJvdXRlLnJlZGlyZWN0KVxuXHRcdFx0XHRcdFx0XHRsb2NhdGlvbi5ocmVmID0gJyMnICsgcm91dGUucmVkaXJlY3RcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIHJvdXRlLmNvbnRyb2wgPT0gJ3N0cmluZycpIHtcblxuXHRcdFx0XHRcdFx0XHR2YXIgbmV3Q3RybCA9ICQoJzxkaXY+Jylcblx0XHRcdFx0XHRcdFx0JCQuY29udHJvbC5jcmVhdGVDb250cm9sKHJvdXRlLmNvbnRyb2wsIG5ld0N0cmwpXG5cdFx0XHRcdFx0XHRcdGVsdC5lbXB0eSgpLmFwcGVuZChuZXdDdHJsKVx0XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0XHRcdH1cdFxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUud2FybignW3JvdXRlcl0gTm8gcm91dGUgZm91bmQgIScpXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XHR9XHRcdFxuXG5cblx0XHR9XG5cblx0fSlcblxufSkoKTtcblxuXG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy50YWJzJywge1xuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHZhciB1bCA9ICQoJzx1bD4nKS5wcmVwZW5kVG8oZWx0KVxuXG5cdFx0ZWx0LmNoaWxkcmVuKCdkaXYnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRpdGxlID0gJCh0aGlzKS5hdHRyKCd0aXRsZScpXG5cdFx0XHR2YXIgaWQgPSAkKHRoaXMpLnVuaXF1ZUlkKCkuYXR0cignaWQnKVxuXHRcdFx0dmFyIGxpID0gJCgnPGxpPicpXG5cdFx0XHRcdC5hdHRyKCd0aXRsZScsIHRpdGxlKVxuXHRcdFx0XHQuYXBwZW5kKCQoJzxhPicsIHtocmVmOiAnIycgKyBpZH0pLnRleHQodGl0bGUpKVxuXHRcdFx0XHQuYXBwZW5kVG8odWwpXG5cdFx0XHRpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLXJlbW92YWJsZScpICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRsaS5hcHBlbmQoJCgnPHNwYW4+Jywge2NsYXNzOiAndWktaWNvbiB1aS1pY29uLWNsb3NlJ30pKVxuXHRcdFx0fVxuXHRcdH0pXHRcdFxuXG5cdFx0ZWx0LnRhYnMoKVxuXG5cdH1cblxufSk7XG5cblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRWYXJWYWx1ZShkYXRhLCB2YXJOYW1lKSB7XHJcbiAgICB2YXIgcmV0ID0gZGF0YVxyXG4gICAgZm9yKGxldCBmIG9mIHZhck5hbWUuc3BsaXQoJy4nKSkge1xyXG4gICAgICBcclxuICAgICAgaWYgKHR5cGVvZiByZXQgPT0gJ29iamVjdCcgJiYgZiBpbiByZXQpIHtcclxuICAgICAgICByZXQgPSByZXRbZl1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFZhbHVlKGRhdGEsIHZhck5hbWUpIHtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCdbQ29yZV0gZ2V0VmFsdWUnLCB2YXJOYW1lLCBjdHgpXHJcblxyXG4gICAgdmFyIG5vdCA9IGZhbHNlXHJcbiAgICBpZiAodmFyTmFtZS5zdGFydHNXaXRoKCchJykpIHtcclxuICAgICAgdmFyTmFtZSA9IHZhck5hbWUuc3Vic3RyKDEpXHJcbiAgICAgIG5vdCA9IHRydWVcclxuICAgIH0gICAgIFxyXG5cclxuICAgIHZhciBmdW5jID0gZGF0YVt2YXJOYW1lXVxyXG4gICAgdmFyIHZhbHVlXHJcblxyXG4gICAgaWYgKHR5cGVvZiBmdW5jID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdmFsdWUgPSBmdW5jLmNhbGwoZGF0YSlcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YWx1ZSA9IGdldFZhclZhbHVlKGRhdGEsIHZhck5hbWUpXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Jvb2xlYW4nICYmIG5vdCkge1xyXG4gICAgICB2YWx1ZSA9ICF2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWx1ZVxyXG4gIH1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc3BsaXRBdHRyKGF0dHJWYWx1ZSwgY2JrKSB7XHJcbiAgYXR0clZhbHVlLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihpKSB7XHJcbiAgICBsZXQgW25hbWUsIHZhbHVlXSA9IGkuc3BsaXQoJzonKVxyXG4gICAgY2JrKG5hbWUudHJpbSgpLCB2YWx1ZS50cmltKCkpXHJcbiAgfSlcclxufVxyXG5cclxuXHJcbmNvbnN0IG1hcCA9IHtcclxuICAnYm4tZWFjaCc6IHt0eXBlOiAzfSxcclxuICAnYm4tdGV4dCc6IHtmOiAndGV4dCcsIHR5cGU6IDF9LFxyXG4gICdibi1odG1sJzoge2Y6ICdodG1sJywgdHlwZTogMX0sXHJcbiAgJ2JuLXZhbCc6IHtmOiAnc2V0VmFsdWUnLCB0eXBlOiAxfSxcclxuICAnYm4tc2hvdyc6IHtmOiAnc2V0VmlzaWJsZScsIHR5cGU6IDF9LFxyXG4gICdibi1zdHlsZSc6IHtmOiAnY3NzJywgdHlwZTogMn0sXHJcbiAgJ2JuLWF0dHInOiB7ZjogJ2F0dHInLCB0eXBlOiAyfSxcclxuICAnYm4tcHJvcCc6IHtmOiAncHJvcCcsIHR5cGU6IDJ9LFxyXG4gICdibi1kYXRhJzoge2Y6ICdzZXREYXRhJywgdHlwZTogMn0sXHJcbiAgJ2JuLWNsYXNzJzoge2Y6ICdzZXRDbGFzcycsIHR5cGU6IDJ9LFxyXG4gICdibi1jb250cm9sJzoge3R5cGU6IDR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGUoY3R4LCBkYXRhLCB2YXJzLCBleGNsdWRlRWx0KSB7XHJcblxyXG4gIC8vY29uc29sZS5sb2coJ3VwZGF0ZScsIHZhcnMpXHJcblxyXG4gIGlmICh0eXBlb2YgdmFycyA9PSAnc3RyaW5nJykge1xyXG4gICAgdmFycyA9IHZhcnMuc3BsaXQoJywnKVxyXG4gIH1cclxuXHJcbiAgdmFycy5mb3JFYWNoKGZ1bmN0aW9uKHZhcmlhYmxlKSB7XHJcbiAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJpYWJsZSlcclxuICAgIFxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgdXBkYXRlKGN0eCwgZGF0YSwgT2JqZWN0LmtleXModmFsdWUpLm1hcChpID0+IHZhcmlhYmxlICsgJy4nICsgaSksIGV4Y2x1ZGVFbHQpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoY3R4W3ZhcmlhYmxlXSkge1xyXG4gICAgICBjdHhbdmFyaWFibGVdLmZvckVhY2goZnVuY3Rpb24oYWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IHt0eXBlLCBmLCBlbHQsIG5hbWUsIHRlbXBsYXRlLCBpdGVyfSA9IGFjdGlvblxyXG4gICAgICAgIGlmIChlbHQgPT0gZXhjbHVkZUVsdCkge1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlID09IDEpIHtcclxuICAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIHZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSA9PSAyKSB7XHJcbiAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICB9ICAgXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMyAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICBlbHQuZW1wdHkoKVxyXG4gICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICB2YXIgaXRlbURhdGEgPSAkLmV4dGVuZCh7fSwgZGF0YSlcclxuICAgICAgICAgICAgICBpdGVtRGF0YVtpdGVyXSA9IGl0ZW1cclxuICAgICAgICAgICAgICB2YXIgJGl0ZW0gPSB0ZW1wbGF0ZS5jbG9uZSgpXHJcbiAgICAgICAgICAgICAgcHJvY2VzcygkaXRlbSwgaXRlbURhdGEpXHJcbiAgICAgICAgICAgICAgZWx0LmFwcGVuZCgkaXRlbSkgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc0V2ZW50cyhyb290LCBldmVudHMpIHtcclxuICByb290LmJuRmluZChgW2JuLWV2ZW50XWApLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBlbHQgPSAkKHRoaXMpXHJcbiAgICAgIGxldCBhdHRyVmFsdWUgPSBlbHQuYXR0cignYm4tZXZlbnQnKVxyXG4gICAgICBlbHQucmVtb3ZlQXR0cignYm4tZXZlbnQnKVxyXG4gICAgICBcclxuICAgICAgc3BsaXRBdHRyKGF0dHJWYWx1ZSwgZnVuY3Rpb24oZXZ0TmFtZSwgdmFsdWUpIHtcclxuICAgICAgICBsZXQgZm4gID0gZXZlbnRzW3ZhbHVlXVxyXG4gICAgICAgIGlmICh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJykgeyAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBbbmFtZSwgc2VsZWN0b3JdID0gZXZ0TmFtZS5zcGxpdCgnLicpXHJcblxyXG4gICAgICAgICAgaWYgKHNlbGVjdG9yICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbHQub24obmFtZSwgJy4nICsgc2VsZWN0b3IsIGZuKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVsdC5vbihuYW1lLCBmbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgIFxyXG4gICAgfSlcclxuICAgICBcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzcyhyb290LCBkYXRhLCBjcmVhdGVDb250cm9sKSB7XHJcblxyXG5cclxuICBsZXQgY3R4ID0ge31cclxuICBcclxuICBmb3IobGV0IGRpciBpbiBtYXApIHtcclxuICAgIFxyXG5cclxuICAgIHJvb3QuYm5GaW5kKGBbJHtkaXJ9XWApLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBlbHQgPSAkKHRoaXMpXHJcbiAgICAgIGxldCBhdHRyVmFsdWUgPSBlbHQuYXR0cihkaXIpXHJcbiAgICAgIGVsdC5yZW1vdmVBdHRyKGRpcilcclxuXHJcbiAgICAgIGxldCB7dHlwZSwgZn0gPSBtYXBbZGlyXVxyXG4gICAgICBcclxuICAgICAgaWYgKHR5cGUgPT0gMSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCBhdHRyVmFsdWUpXHJcbiAgICAgICAgICAvL2VsdC50ZXh0KGRhdGFbYXR0clZhbHVlXSlcclxuICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgdmFsdWUpXHJcbiAgICAgICAgfSBcclxuICAgICAgICBpZiAoZGlyID09ICdibi12YWwnKSB7XHJcbiAgICAgICAgICBsZXQgdXBkYXRlRXZ0ID0gZWx0LmF0dHIoJ2JuLXVwZGF0ZScpXHJcbiAgICAgICAgICBpZiAodXBkYXRlRXZ0KSB7XHJcbiAgICAgICAgICAgIGVsdC5yZW1vdmVBdHRyKCdibi11cGRhdGUnKVxyXG4gICAgICAgICAgICBlbHQub24odXBkYXRlRXZ0LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICByb290LnRyaWdnZXIoJ2RhdGE6dXBkYXRlJywgW2F0dHJWYWx1ZSwgZWx0LmdldFZhbHVlKCksIGVsdF0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eFthdHRyVmFsdWVdID0gY3R4W2F0dHJWYWx1ZV0gfHwgW11cclxuICAgICAgICBjdHhbYXR0clZhbHVlXS5wdXNoKHtmLCBlbHQsIHR5cGV9KSAgICAgICAgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlID09IDQgJiYgdHlwZW9mIGNyZWF0ZUNvbnRyb2wgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGNyZWF0ZUNvbnRyb2woYXR0clZhbHVlLCBlbHQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlID09IDIpIHtcclxuXHJcbiAgICAgICAgICBzcGxpdEF0dHIoYXR0clZhbHVlLCBmdW5jdGlvbihuYW1lLCB2YXJOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyTmFtZSlcclxuICAgICAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIG5hbWUsIHZhbHVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eFt2YXJOYW1lXSA9IGN0eFt2YXJOYW1lXSB8fCBbXVxyXG4gICAgICAgICAgICBjdHhbdmFyTmFtZV0ucHVzaCh7ZiwgZWx0LCB0eXBlLCBuYW1lfSkgIFxyXG4gICAgICAgICAgfSlcclxuICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgIGlmICh0eXBlID09IDMpIHtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSBlbHQuY2hpbGRyZW4oKS5yZW1vdmUoKS5jbG9uZSgpXHJcbiAgICAgICAgbGV0IFtpdGVyLCAsIHZhck5hbWVdID0gYXR0clZhbHVlLnNwbGl0KCcgJylcclxuICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eFt2YXJOYW1lXSA9IGN0eFt2YXJOYW1lXSB8fCBbXVxyXG4gICAgICAgIGN0eFt2YXJOYW1lXS5wdXNoKHtlbHQsIHR5cGUsIHRlbXBsYXRlLCBpdGVyfSkgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChkYXRhICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgIHZhciBpdGVtRGF0YSA9ICQuZXh0ZW5kKHt9LCBkYXRhKVxyXG4gICAgICAgICAgIGl0ZW1EYXRhW2l0ZXJdID0gaXRlbVxyXG4gICAgICAgICAgIHZhciAkaXRlbSA9IHRlbXBsYXRlLmNsb25lKClcclxuICAgICAgICAgICBwcm9jZXNzKCRpdGVtLCBpdGVtRGF0YSwgY3JlYXRlQ29udHJvbClcclxuICAgICAgICAgICBlbHQuYXBwZW5kKCRpdGVtKSAgICAgICAgICBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgIFxyXG4gIFxyXG4gIH1cclxuICBcclxuXHJcbiAgcmV0dXJuIGN0eFxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzQmluZGluZ3Mocm9vdCkge1xyXG5cclxuICAgIHZhciBkYXRhID0ge31cclxuXHJcbiAgICByb290LmJuRmluZCgnYm4tYmluZCcsIHRydWUsIGZ1bmN0aW9uKGVsdCwgdmFyTmFtZSkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdibi10ZXh0JywgdmFyTmFtZSlcclxuICAgICAgZGF0YVt2YXJOYW1lXSA9IGVsdFxyXG4gICAgfSlcclxuICAgIHJvb3QuYm5GaW5kKCdibi1pZmFjZScsIHRydWUsIGZ1bmN0aW9uKGVsdCwgdmFyTmFtZSkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdibi10ZXh0JywgdmFyTmFtZSlcclxuICAgICAgZGF0YVt2YXJOYW1lXSA9IGVsdC5pZmFjZSgpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGRhdGFcclxuICBcclxufVxyXG5cclxuJCQuYmluZGluZyA9IHtcclxuICBwcm9jZXNzLFxyXG4gIHVwZGF0ZSxcclxuICBwcm9jZXNzRXZlbnRzLFxyXG4gIHByb2Nlc3NCaW5kaW5nc1xyXG59XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcbmxldCBjb250cm9scyA9IHt9XHJcblxyXG5mdW5jdGlvbiBpc0RlcHNPayhkZXBzKSB7XHJcblx0cmV0dXJuIGRlcHMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xyXG5cclxuXHRcdHJldHVybiBwcmV2ICYmIChjdXIgIT0gdW5kZWZpbmVkKVxyXG5cdH0sIHRydWUpXHRcdFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb250cm9sKG5hbWUsIG9wdGlvbnMpIHtcclxuXHRpZiAoISQkLnV0aWwuY2hlY2tUeXBlKG9wdGlvbnMsIHtcclxuXHRcdCRkZXBzOiBbJ3N0cmluZyddLFxyXG5cdFx0aW5pdDogJ2Z1bmN0aW9uJ1xyXG5cdH0pKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKGBbQ29yZV0gcmVnaXN0ZXJDb250cm9sOiBiYWQgb3B0aW9uc2AsIG9wdGlvbnMpXHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cclxuXHR2YXIgZGVwcyA9IG9wdGlvbnMuZGVwcyB8fCBbXVxyXG5cclxuXHRjb25zb2xlLmxvZyhgW0NvcmVdIHJlZ2lzdGVyIGNvbnRyb2wgJyR7bmFtZX0nIHdpdGggZGVwc2AsIGRlcHMpXHJcblxyXG5cdGNvbnRyb2xzW25hbWVdID0ge2RlcHMsIG9wdGlvbnMsIHN0YXR1czogJ25vdGxvYWRlZCd9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvbnRyb2wobmFtZSkge1xyXG5cdHZhciByZXQgPSBjb250cm9sc1tuYW1lXVxyXG5cdGlmIChyZXQgJiYgcmV0LnN0YXR1cyA9PSAnbm90bG9hZGVkJykge1xyXG5cdFx0cmV0LmRlcHMgPSAkJC5zZXJ2aWNlLmdldFNlcnZpY2VzKHJldC5kZXBzKVxyXG5cdFx0cmV0LnN0YXR1cyA9IGlzRGVwc09rKHJldC5kZXBzKSA/ICdvaycgOiAna28nXHJcblx0fVxyXG5cdHJldHVybiByZXRcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ29udHJvbChjb250cm9sTmFtZSwgZWx0KSB7XHJcblx0ZWx0LmFkZENsYXNzKGNvbnRyb2xOYW1lLnJlcGxhY2UoJy4nLCAnLScpKVxyXG5cdGVsdC5hZGRDbGFzcygnQ3VzdG9tQ29udHJvbCcpLnVuaXF1ZUlkKClcdFxyXG5cdHZhciBjdHJsID0gZ2V0Q29udHJvbChjb250cm9sTmFtZSlcclxuXHRcdFxyXG5cdGlmIChjdHJsID09IHVuZGVmaW5lZCkge1xyXG5cdFx0dGhyb3coYFtDb3JlXSBjb250cm9sICcke2NvbnRyb2xOYW1lfScgaXMgbm90IHJlZ2lzdGVyZWRgKVxyXG5cdH1cclxuXHRcdC8vY29uc29sZS5sb2coJ2NyZWF0ZUNvbnRyb2wnLCBjb250cm9sTmFtZSwgY3RybClcclxuXHRpZiAoY3RybC5zdGF0dXMgPT09ICAnb2snKSB7XHJcblx0XHRcclxuXHRcdHZhciBpZmFjZSA9IHtcclxuXHRcdFx0cHJvcHM6IHt9LFxyXG5cdFx0XHRuYW1lOiBjb250cm9sTmFtZVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB7aW5pdCwgcHJvcHMsIHRlbXBsYXRlfSA9IGN0cmwub3B0aW9uc1xyXG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fVxyXG5cclxuXHRcdE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BOYW1lKSB7XHJcblx0XHRcdGlmYWNlLnByb3BzW3Byb3BOYW1lXSA9IGVsdC5kYXRhKHByb3BOYW1lKSB8fCBwcm9wc1twcm9wTmFtZV1cclxuXHRcdH0pXHJcblxyXG5cdFx0aWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHQkKHRlbXBsYXRlKS5hcHBlbmRUbyhlbHQpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRlbXBsYXRlIGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcblx0XHRcdHRlbXBsYXRlLmNoaWxkcmVuKCkuY2xvbmUoKS5hcHBlbmRUbyhlbHQpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBpbml0ID09ICdmdW5jdGlvbicpIHtcclxuXHJcblx0XHRcdHZhciBhcmdzID0gW2VsdF0uY29uY2F0KGN0cmwuZGVwcylcclxuXHRcdFx0aW5pdC5hcHBseShpZmFjZSwgYXJncylcclxuXHRcdFx0Y29uc29sZS5sb2coYFtDb3JlXSBpbnN0YW5jZSBjb250cm9sICcke2NvbnRyb2xOYW1lfScgd2l0aCBwcm9wc2AsIGlmYWNlLnByb3BzKVxyXG5cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oYFtDb3JlXSBjb250cm9sICcke2NvbnRyb2xOYW1lfScgbWlzc2luZyBpbml0IGZ1bmN0aW9uYClcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZWx0LmdldCgwKS5jdHJsID0gaWZhY2VcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGlmYWNlXHRcdFx0XHRcclxuXHR9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiQkLmNvbnRyb2wgPSB7XHJcblx0cmVnaXN0ZXJDb250cm9sLFxyXG5cdGNyZWF0ZUNvbnRyb2xcclxufVxyXG5cclxufSkoKTtcclxuIiwiJCQuZGlhbG9nQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgZGl2ID0gJCgnPGRpdj4nLCB7dGl0bGU6IG9wdGlvbnMudGl0bGUgfHwgJ0RpYWxvZyd9KVxyXG5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMudGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdCQob3B0aW9ucy50ZW1wbGF0ZSkuYXBwZW5kVG8oZGl2KVxyXG5cdH1cdFxyXG5cclxuXHR2YXIgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGRpdiwgb3B0aW9ucylcclxuXHJcblx0dmFyIGRsZ09wdGlvbnMgPSAkLmV4dGVuZCh7XHJcblx0XHRhdXRvT3BlbjogZmFsc2UsXHJcblx0XHRtb2RhbDogdHJ1ZSxcclxuXHRcdHdpZHRoOiAnYXV0bycsXHRcdFxyXG5cdH0sIG9wdGlvbnMpXHJcblxyXG5cdHZhciBwcml2YXRlID0ge31cclxuXHJcblx0Ly9jb25zb2xlLmxvZygnZGxnT3B0aW9ucycsIGRsZ09wdGlvbnMpXHJcblxyXG5cdGRpdi5kaWFsb2coZGxnT3B0aW9ucylcclxuXHJcblx0Y3RybC5zaG93ID0gZnVuY3Rpb24ob25BcHBseSkge1xyXG5cdFx0cHJpdmF0ZS5vbkFwcGx5ID0gb25BcHBseVxyXG5cdFx0ZGl2LmRpYWxvZygnb3BlbicpXHJcblx0fVxyXG5cclxuXHRjdHJsLmhpZGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdGRpdi5kaWFsb2coJ2Nsb3NlJylcclxuXHR9XHJcblxyXG5cdGN0cmwuYXBwbHkgPSBmdW5jdGlvbihyZXRWYWx1ZSkge1xyXG5cdFx0Y3RybC5oaWRlKClcclxuXHRcdGlmICh0eXBlb2YgcHJpdmF0ZS5vbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0cHJpdmF0ZS5vbkFwcGx5KHJldFZhbHVlKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y3RybC5zZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb25OYW1lLCB2YWx1ZSkge1xyXG5cdFx0ZGl2LmRpYWxvZygnb3B0aW9uJywgb3B0aW9uTmFtZSwgdmFsdWUpXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gY3RybFxyXG59O1xyXG4iLCIkJC5mb3JtRGlhbG9nQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgZGl2ID0gJCgnPGRpdj4nLCB7dGl0bGU6IG9wdGlvbnMudGl0bGUgfHwgJ0RpYWxvZyd9KVxyXG5cclxuXHR2YXIgcHJpdmF0ZSA9IHt9XHJcblxyXG5cdHZhciBmb3JtID0gJCgnPGZvcm0+JylcclxuXHRcdC5hcHBlbmRUbyhkaXYpXHJcblx0XHQub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGV2KSB7XHJcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcclxuXHRcdFx0ZGl2LmRpYWxvZygnY2xvc2UnKVxyXG5cdFx0XHRpZiAodHlwZW9mIHByaXZhdGUub25BcHBseSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0cHJpdmF0ZS5vbkFwcGx5KCQodGhpcykuZ2V0Rm9ybURhdGEoKSlcclxuXHRcdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXHJcblx0XHRcdH1cdFx0XHRcdFxyXG5cdFx0fSlcclxuXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnRlbXBsYXRlID09ICdzdHJpbmcnKSB7XHJcblx0XHQkKG9wdGlvbnMudGVtcGxhdGUpLmFwcGVuZFRvKGZvcm0pXHJcblx0fVx0XHJcblxyXG5cdGlmIChvcHRpb25zLnRlbXBsYXRlIGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcblx0XHRvcHRpb25zLnRlbXBsYXRlLmNoaWxkcmVuKCkuY2xvbmUoKS5hcHBlbmRUbyhmb3JtKVxyXG5cdH1cclxuXHJcblx0dmFyIHN1Ym1pdEJ0biA9ICQoJzxpbnB1dD4nLCB7dHlwZTogJ3N1Ym1pdCcsIGhpZGRlbjogdHJ1ZX0pLmFwcGVuZFRvKGZvcm0pXHJcblxyXG5cdHZhciBkbGdPcHRpb25zID0gJC5leHRlbmQoe1xyXG5cdFx0YXV0b09wZW46IGZhbHNlLFxyXG5cdFx0bW9kYWw6IHRydWUsXHJcblx0XHR3aWR0aDogJ2F1dG8nLFx0XHJcblx0XHRidXR0b25zOiB7XHJcblx0XHRcdCdDYW5jZWwnOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKHRoaXMpLmRpYWxvZygnY2xvc2UnKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnQXBwbHknOiBmdW5jdGlvbigpIHtcdFx0XHRcdFx0XHJcblx0XHRcdFx0c3VibWl0QnRuLmNsaWNrKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sIG9wdGlvbnMpXHJcblxyXG5cclxuXHRkaXYuZGlhbG9nKGRsZ09wdGlvbnMpXHJcblxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0c2hvdzogZnVuY3Rpb24ob25BcHBseSkge1xyXG5cdFx0XHRwcml2YXRlLm9uQXBwbHkgPSBvbkFwcGx5XHRcdFx0XHJcblx0XHRcdGRpdi5kaWFsb2coJ29wZW4nKVx0XHRcdFxyXG5cdFx0fSxcclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0Zm9ybS5zZXRGb3JtRGF0YShkYXRhKVxyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuJC5mbi5ibkZpbmQ9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICByZXR1cm4gdGhpcy5maW5kKHNlbGVjdG9yKS5hZGQodGhpcy5maWx0ZXIoc2VsZWN0b3IpKVxyXG59XHJcblxyXG4kLmZuLnNldENsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpc0FjdGl2ZSkge1xyXG4gICAgaWYgKGlzQWN0aXZlKSB7XHJcbiAgICAgIHRoaXMuYWRkQ2xhc3MoY2xhc3NOYW1lKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKVxyXG4gICAgfVxyXG59XHJcblxyXG4kLmZuLnNldFZpc2libGUgPSBmdW5jdGlvbihpc1Zpc2libGUpIHtcclxuICAgIGlmIChpc1Zpc2libGUpIHtcclxuICAgICAgdGhpcy5zaG93KClcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmhpZGUoKVxyXG4gICAgfVxyXG59XHJcblxyXG4kLmZuLmlmYWNlID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuZ2V0KDApLmN0cmxcclxufVxyXG5cclxuJC5mbi5zZXREYXRhID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG5cclxuICBjb25zdCBmdW5jTmFtZSA9ICdzZXQnICsgbmFtZS5zdWJzdHIoMCwxKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHIoMSlcclxuICAvL2NvbnNvbGUubG9nKCdmdW5jTmFtZScsIGZ1bmNOYW1lKVxyXG5cclxuICBpZiAoaWZhY2UgJiYgaWZhY2UucHJvcHNbbmFtZV0gJiYgdHlwZW9mIGlmYWNlW2Z1bmNOYW1lXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBpZmFjZVtmdW5jTmFtZV0odmFsdWUpXHJcbiAgfVxyXG4gIGVsc2UgaWYgKGlmYWNlICYmICQkLmlzVmlld0NvbnRyb2xsZXIoaWZhY2UuY3RybCkgJiYgaWZhY2UuY3RybC5tb2RlbFtuYW1lXSkge1xyXG4gICAgaWZhY2UuY3RybC5zZXREYXRhKG5hbWUsIHZhbHVlKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZGF0YShuYW1lLCB2YWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbiQuZm4uc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09ICdJTlBVVCcgJiYgdGhpcy5hdHRyKCd0eXBlJykgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgdGhpcy5wcm9wKCdjaGVja2VkJywgdmFsdWUpXHJcbiAgICByZXR1cm5cclxuICB9ICBcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG5cclxuICBpZiAoaWZhY2UgJiYgdHlwZW9mIGlmYWNlLnNldFZhbHVlID09ICdmdW5jdGlvbicpIHtcclxuICAgIGlmYWNlLnNldFZhbHVlKHZhbHVlKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMudmFsKHZhbHVlKVxyXG4gIH1cclxufVxyXG5cclxuJC5mbi5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGNvbnN0IHR5cGUgPSB0aGlzLmF0dHIoJ3R5cGUnKVxyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09ICdJTlBVVCcgJiYgdHlwZSA9PSAnY2hlY2tib3gnKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wKCdjaGVja2VkJylcclxuICB9ICAgIFxyXG4gIGNvbnN0IGlmYWNlID0gdGhpcy5pZmFjZSgpXHJcbiAgaWYgKGlmYWNlICYmIHR5cGVvZiBpZmFjZS5nZXRWYWx1ZSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICByZXR1cm4gaWZhY2UuZ2V0VmFsdWUoKVxyXG4gIH1cclxuICB2YXIgcmV0ID0gdGhpcy52YWwoKVxyXG5cclxuICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdyYW5nZScpIHtcclxuICAgIHJldCA9IHBhcnNlRmxvYXQocmV0KVxyXG4gIH1cclxuICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbiQuZm4uZ2V0Rm9ybURhdGEgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgcmV0ID0ge31cclxuICB0aGlzLmZpbmQoJ1tuYW1lXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZWx0ID0gJCh0aGlzKVxyXG4gICAgdmFyIG5hbWUgPSBlbHQuYXR0cignbmFtZScpXHJcbiAgICByZXRbbmFtZV0gPSBlbHQuZ2V0VmFsdWUoKVxyXG5cclxuICB9KVxyXG5cclxuICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbiQuZm4ucmVzZXRGb3JtID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHRoaXMuZ2V0KDApLnRhZ05hbWUgPT0gXCJGT1JNXCIpIHtcclxuICAgIHRoaXMuZ2V0KDApLnJlc2V0KClcclxuICB9ICAgXHJcbn1cclxuXHJcbiQuZm4uc2V0Rm9ybURhdGEgPSBmdW5jdGlvbihkYXRhKSB7XHJcblxyXG4gIC8vY29uc29sZS5sb2coJ3NldEZvcm1EYXRhJywgZGF0YSlcclxuICB0aGlzLnJlc2V0Rm9ybSgpXHJcblxyXG4gIGZvcih2YXIgbmFtZSBpbiBkYXRhKSB7XHJcbiAgICB2YXIgdmFsdWUgPSBkYXRhW25hbWVdXHJcbiAgICB2YXIgZWx0ID0gdGhpcy5maW5kKGBbbmFtZT0ke25hbWV9XWApXHJcbiAgICBpZiAoZWx0Lmxlbmd0aCkge1xyXG4gICAgICBlbHQuc2V0VmFsdWUodmFsdWUpICAgICAgIFxyXG4gICAgfVxyXG5cclxuICBcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIlxyXG4oZnVuY3Rpb24oKXtcclxuXHJcbmxldCBzZXJ2aWNlcyA9IHt9XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTZXJ2aWNlcyhkZXBzKSB7XHJcblx0Ly9jb25zb2xlLmxvZygnW0NvcmVdIGdldFNlcnZpY2VzJywgZGVwcylcclxuXHRyZXR1cm4gZGVwcy5tYXAoZnVuY3Rpb24oZGVwTmFtZSkge1xyXG5cdFx0dmFyIHNydiA9IHNlcnZpY2VzW2RlcE5hbWVdXHJcblx0XHRpZiAoc3J2KSB7XHJcblx0XHRcdGlmIChzcnYuc3RhdHVzID09ICdub3Rsb2FkZWQnKSB7XHJcblx0XHRcdFx0dmFyIGRlcHMyID0gZ2V0U2VydmljZXMoc3J2LmRlcHMpXHJcblx0XHRcdFx0dmFyIGNvbmZpZyA9IHNydi5jb25maWcgfHwge31cclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgW0NvcmVdIGluc3RhbmNlIHNlcnZpY2UgJyR7ZGVwTmFtZX0nIHdpdGggY29uZmlnYCwgY29uZmlnKVxyXG5cdFx0XHRcdHZhciBhcmdzID0gW2NvbmZpZ10uY29uY2F0KGRlcHMyKVxyXG5cdFx0XHRcdHNydi5vYmogPSBzcnYuZm4uYXBwbHkobnVsbCwgYXJncylcclxuXHRcdFx0XHRzcnYuc3RhdHVzID0gJ3JlYWR5J1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBzcnYub2JqXHRcdFx0XHRcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvL3Nydi5zdGF0dXMgPSAnbm90cmVnaXN0ZXJlZCdcclxuXHRcdFx0dGhyb3coYFtDb3JlXSBzZXJ2aWNlICcke2RlcE5hbWV9JyBpcyBub3QgcmVnaXN0ZXJlZGApXHJcblx0XHR9XHJcblxyXG5cdH0pXHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY29uZmlndXJlU2VydmljZShuYW1lLCBjb25maWcpIHtcclxuXHRjb25zb2xlLmxvZygnW0NvcmVdIGNvbmZpZ3VyZVNlcnZpY2UnLCBuYW1lLCBjb25maWcpXHJcblx0aWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnIHx8IHR5cGVvZiBjb25maWcgIT0gJ29iamVjdCcpIHtcclxuXHRcdGNvbnNvbGUud2FybignW0NvcmVdIGNvbmZpZ3VyZVNlcnZpY2UgY2FsbGVkIHdpdGggYmFkIGFyZ3VtZW50cycpXHJcblx0XHRyZXR1cm5cclxuXHR9IFx0XHJcblxyXG5cdHZhciBzcnYgPSBzZXJ2aWNlc1tuYW1lXVxyXG5cdGlmIChzcnYpIHtcclxuXHRcdHNydi5jb25maWcgPSBjb25maWdcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR0aHJvdyhgW2NvbmZpZ3VyZVNlcnZpY2VdIHNlcnZpY2UgJyR7bmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHR9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlclNlcnZpY2UobmFtZSwgYXJnMSwgYXJnMikge1xyXG5cdHZhciBkZXBzID0gW11cclxuXHR2YXIgZm4gPSBhcmcxXHJcblx0aWYgKEFycmF5LmlzQXJyYXkoYXJnMSkpIHtcclxuXHRcdGRlcHMgPSBhcmcxXHJcblx0XHRmbiA9IGFyZzJcclxuXHR9XHJcblx0aWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnIHx8IHR5cGVvZiBmbiA9PSAndW5kZWZpbmVkJyB8fCAhQXJyYXkuaXNBcnJheShkZXBzKSkge1xyXG5cdFx0dGhyb3coJ1tDb3JlXSByZWdpc3RlclNlcnZpY2UgY2FsbGVkIHdpdGggYmFkIGFyZ3VtZW50cycpXHJcblx0fSBcclxuXHRjb25zb2xlLmxvZyhgW0NvcmVdIHJlZ2lzdGVyIHNlcnZpY2UgJyR7bmFtZX0nIHdpdGggZGVwc2AsIGRlcHMpXHJcblxyXG5cdHNlcnZpY2VzW25hbWVdID0ge2RlcHMsIGZuLCBzdGF0dXM6ICdub3Rsb2FkZWQnfVxyXG59XHJcblxyXG4kJC5zZXJ2aWNlID0ge1xyXG5cdHJlZ2lzdGVyU2VydmljZSxcclxuXHRjb25maWd1cmVTZXJ2aWNlLFxyXG5cdGdldFNlcnZpY2VzXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcblxyXG5mdW5jdGlvbiByZWFkVGV4dEZpbGUoZmlsZU5hbWUsIG9uUmVhZCkge1xyXG5cdHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG5cclxuXHRmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHR5cGVvZiBvblJlYWQgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRvblJlYWQoZmlsZVJlYWRlci5yZXN1bHQpXHJcblx0XHR9XHJcblx0fVxyXG5cdGZpbGVSZWFkZXIucmVhZEFzVGV4dChmaWxlTmFtZSlcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlYWRGaWxlQXNEYXRhVVJMKGZpbGVOYW1lLCBvblJlYWQpIHtcclxuXHR2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuXHJcblx0ZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0eXBlb2Ygb25SZWFkID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0b25SZWFkKGZpbGVSZWFkZXIucmVzdWx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZU5hbWUpXHJcbn1cclxuXHJcblxyXG52YXIgaW5wdXRGaWxlID0gJCgnPGlucHV0PicsIHt0eXBlOiAnZmlsZSd9KS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcblx0dmFyIG9uQXBwbHkgPSAkKHRoaXMpLmRhdGEoJ29uQXBwbHknKVxyXG5cdHZhciBmaWxlTmFtZSA9IHRoaXMuZmlsZXNbMF1cclxuXHRpZiAodHlwZW9mIG9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0b25BcHBseShmaWxlTmFtZSlcclxuXHR9XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBvcGVuRmlsZURpYWxvZyhvbkFwcGx5KSB7XHJcblx0aW5wdXRGaWxlLmRhdGEoJ29uQXBwbHknLCBvbkFwcGx5KVxyXG5cdGlucHV0RmlsZS5jbGljaygpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzSW1hZ2UoZmlsZU5hbWUpIHtcclxuXHRyZXR1cm4gKC9cXC4oZ2lmfGpwZ3xqcGVnfHBuZykkL2kpLnRlc3QoZmlsZU5hbWUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRhdGFVUkx0b0Jsb2IoZGF0YVVSTCkge1xyXG4gIC8vIERlY29kZSB0aGUgZGF0YVVSTFxyXG4gIGNvbnN0IFsgLCBtaW1lVHlwZSwgZW5jb2RhZ2UsIGRhdGFdID0gZGF0YVVSTC5zcGxpdCgvWzosO10vKVxyXG4gIGlmIChlbmNvZGFnZSAhPSAnYmFzZTY0Jykge1xyXG4gIFx0cmV0dXJuXHJcbiAgfVxyXG5cclxuICAvL2NvbnNvbGUubG9nKCdtaW1lVHlwZScsIG1pbWVUeXBlKVxyXG4gIC8vY29uc29sZS5sb2coJ2VuY29kYWdlJywgZW5jb2RhZ2UpXHJcbiAgLy9jb25zb2xlLmxvZygnZGF0YScsIGRhdGEpXHJcblxyXG4gIHZhciBiaW5hcnkgPSBhdG9iKGRhdGEpXHJcbiAvLyBDcmVhdGUgOC1iaXQgdW5zaWduZWQgYXJyYXlcclxuICB2YXIgYXJyYXkgPSBbXVxyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIHtcclxuICBcdGFycmF5LnB1c2goYmluYXJ5LmNoYXJDb2RlQXQoaSkpXHJcbiAgfVxyXG5cclxuICAvLyBSZXR1cm4gb3VyIEJsb2Igb2JqZWN0XHJcblx0cmV0dXJuIG5ldyBCbG9iKFsgbmV3IFVpbnQ4QXJyYXkoYXJyYXkpIF0sIHttaW1lVHlwZX0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTdHlsZShzdHlsZUZpbGVQYXRoLCBjYWxsYmFjaykge1x0XHJcblx0Ly9jb25zb2xlLmxvZygnW0NvcmVdIGxvYWRTdHlsZScsIHN0eWxlRmlsZVBhdGgpXHJcblxyXG5cdCQoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY3NzT2sgPSAkKCdoZWFkJykuZmluZChgbGlua1tocmVmPVwiJHtzdHlsZUZpbGVQYXRofVwiXWApLmxlbmd0aFxyXG5cdFx0aWYgKGNzc09rICE9IDEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYGxvYWRpbmcgJyR7c3R5bGVGaWxlUGF0aH0nIHN0eWxlYClcclxuXHRcdFx0JCgnPGxpbms+Jywge2hyZWY6IHN0eWxlRmlsZVBhdGgsIHJlbDogJ3N0eWxlc2hlZXQnfSlcclxuXHRcdFx0Lm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCcke3N0eWxlRmlsZVBhdGh9JyBsb2FkZWRgKVxyXG5cdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmFwcGVuZFRvKCQoJ2hlYWQnKSlcclxuXHRcdH1cclxuXHR9KVxyXG59XHJcblxyXG5cclxuXHJcblx0XHJcbmZ1bmN0aW9uIGlzT2JqZWN0KGEpIHtcclxuXHRyZXR1cm4gKHR5cGVvZiBhID09ICdvYmplY3QnKSAmJiAhQXJyYXkuaXNBcnJheShhKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1R5cGUodmFsdWUsIHR5cGUsIGlzT3B0aW9uYWwpIHtcclxuXHQvL2NvbnNvbGUubG9nKCdjaGVja1R5cGUnLHZhbHVlLCB0eXBlLCBpc09wdGlvbmFsKVxyXG5cdGlmICh0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCcgJiYgaXNPcHRpb25hbCA9PT0gdHJ1ZSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgdHlwZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSB0eXBlXHJcblx0fVxyXG5cclxuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuXHRcdGlmICghQXJyYXkuaXNBcnJheSh0eXBlKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZSAvLyBubyBpdGVtIHR5cGUgY2hlY2tpbmdcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiB2YWx1ZSkge1xyXG5cdFx0XHR2YXIgcmV0ID0gZmFsc2VcclxuXHRcdFx0Zm9yKGxldCB0IG9mIHR5cGUpIHtcclxuXHRcdFx0XHRyZXQgfD0gY2hlY2tUeXBlKGksIHQpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFyZXQpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAoaXNPYmplY3QodHlwZSkpIHtcclxuXHRcdGlmICghaXNPYmplY3QodmFsdWUpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBmIGluIHR5cGUpIHtcclxuXHJcblx0XHRcdC8vY29uc29sZS5sb2coJ2YnLCBmLCAndmFsdWUnLCB2YWx1ZSlcclxuXHRcdFx0dmFyIG5ld1R5cGUgPSB0eXBlW2ZdXHJcblxyXG5cdFx0XHR2YXIgaXNPcHRpb25hbCA9IGZhbHNlXHJcblx0XHRcdGlmIChmLnN0YXJ0c1dpdGgoJyQnKSkge1xyXG5cdFx0XHRcdGYgPSBmLnN1YnN0cigxKVxyXG5cdFx0XHRcdGlzT3B0aW9uYWwgPSB0cnVlXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFjaGVja1R5cGUodmFsdWVbZl0sIG5ld1R5cGUsIGlzT3B0aW9uYWwpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlXHJcbn1cdFxyXG5cclxuXHJcblxyXG4kJC51dGlsID0ge1xyXG5cdHJlYWRUZXh0RmlsZSxcclxuXHRyZWFkRmlsZUFzRGF0YVVSTCxcclxuXHRvcGVuRmlsZURpYWxvZyxcclxuXHRpc0ltYWdlLFxyXG5cdGRhdGFVUkx0b0Jsb2IsXHJcblx0bG9hZFN0eWxlLFxyXG5cdGNoZWNrVHlwZVxyXG59XHJcblxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5jbGFzcyBWaWV3Q29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIG9wdGlvbnMpIHtcclxuICAgIFx0Ly9jb25zb2xlLmxvZygnVmlld0NvbnRyb2xsZXInLCBvcHRpb25zKVxyXG4gICAgXHRpZiAodHlwZW9mIGVsdCA9PSAnc3RyaW5nJykge1xyXG4gICAgXHRcdGVsdCA9ICQoZWx0KVxyXG4gICAgXHR9XHJcbiAgICAgICAgaWYgKGVsdC5oYXNDbGFzcygnQ3VzdG9tQ29udHJvbCcpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2RvblxcJ3QgdXNlIHZpZXdDb250cm9sbGVyIG9uIGNvbnRyb2wgdGFnJylcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIFx0b3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zKVxyXG4gICAgICAgIHRoaXMuZWx0ID0gZWx0XHJcblxyXG4gICAgICAgIGVsdC5vbignZGF0YTp1cGRhdGUnLCAoZXYsIG5hbWUsIHZhbHVlLCBleGNsdWRlRWx0KSA9PiB7XHJcbiAgICAgICAgXHQvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIGRhdGE6Y2hhbmdlJywgbmFtZSwgdmFsdWUpXHJcbiAgICAgICAgXHR0aGlzLnNldERhdGEobmFtZSwgdmFsdWUsIGV4Y2x1ZGVFbHQpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGhpcy5tb2RlbCA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zLmRhdGEpXHJcbiAgICAgICAgdGhpcy5ydWxlcyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zLnJ1bGVzKVxyXG4gICAgICAgIHRoaXMud2F0Y2hlcyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zLndhdGNoZXMpXHJcblxyXG4gICAgICAgIC8vIGdlbmVyYXRlIGF1dG9tYXRpYyBydWxlcyBmb3IgY29tcHV0ZWQgZGF0YSAoYWthIGZ1bmN0aW9uKVxyXG4gICAgICAgIGZvcih2YXIgayBpbiB0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgXHR2YXIgZGF0YSA9IHRoaXMubW9kZWxba11cclxuICAgICAgICBcdGlmICh0eXBlb2YgZGF0YSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgXHRcdHZhciBmdW5jVGV4dCA9IGRhdGEudG9TdHJpbmcoKVxyXG4gICAgICAgIFx0XHQvL2NvbnNvbGUubG9nKCdmdW5jVGV4dCcsIGZ1bmNUZXh0KVxyXG4gICAgICAgIFx0XHR2YXIgcnVsZXMgPSBbXVxyXG4gICAgICAgIFx0XHRmdW5jVGV4dC5yZXBsYWNlKC90aGlzLihbYS16QS1aMC05Xy1dezEsfSkvZywgZnVuY3Rpb24obWF0Y2gsIGNhcHR1cmVPbmUpIHtcclxuICAgICAgICBcdFx0XHQvL2NvbnNvbGUubG9nKCdjYXB0dXJlT25lJywgY2FwdHVyZU9uZSlcclxuICAgICAgICBcdFx0XHRydWxlcy5wdXNoKGNhcHR1cmVPbmUpXHJcbiAgICAgICAgXHRcdH0pXHJcbiAgICAgICAgXHRcdHRoaXMucnVsZXNba10gPSBydWxlcy50b1N0cmluZygpXHJcbiAgICAgICAgXHR9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdydWxlcycsIHRoaXMucnVsZXMpXHJcbiAgICAgICAgdGhpcy5jdHggPSAkJC5iaW5kaW5nLnByb2Nlc3MoZWx0LCB0aGlzLm1vZGVsLCAkJC5jb250cm9sLmNyZWF0ZUNvbnRyb2wpXHJcblxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuZXZlbnRzID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICQkLmJpbmRpbmcucHJvY2Vzc0V2ZW50cyhlbHQsIG9wdGlvbnMuZXZlbnRzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zY29wZSA9ICQkLmJpbmRpbmcucHJvY2Vzc0JpbmRpbmdzKGVsdClcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdzY29wZScsIHRoaXMuc2NvcGUpXHJcbiAgICAgICBcclxuXHJcbiAgICB9IFxyXG5cclxuICAgIHNldERhdGEoYXJnMSwgYXJnMiwgZXhjbHVkZUVsdCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gc2V0RGF0YScsIGFyZzEsIGFyZzIpXHJcbiAgICAgICAgdmFyIGRhdGEgPSBhcmcxXHJcbiAgICAgICAgaWYgKHR5cGVvZiBhcmcxID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgXHRkYXRhID0ge31cclxuICAgICAgICBcdGRhdGFbYXJnMV0gPSBhcmcyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gc2V0RGF0YScsIGRhdGEpXHJcbiAgICAgICAgJC5leHRlbmQodGhpcy5tb2RlbCwgZGF0YSlcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdtb2RlbCcsIHRoaXMubW9kZWwpXHJcbiAgICAgICAgdGhpcy51cGRhdGUoT2JqZWN0LmtleXMoZGF0YSksIGV4Y2x1ZGVFbHQpXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGZpZWxkc05hbWUsIGV4Y2x1ZGVFbHQpIHtcclxuICAgIFx0Ly9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSB1cGRhdGUnLCBmaWVsZHNOYW1lKVxyXG4gICAgXHRpZiAodHlwZW9mIGZpZWxkc05hbWUgPT0gJ3N0cmluZycpIHtcclxuICAgIFx0XHRmaWVsZHNOYW1lID0gZmllbGRzTmFtZS5zcGxpdCgnLCcpXHJcbiAgICBcdH1cclxuXHJcblxyXG4gICAgXHRpZiAoQXJyYXkuaXNBcnJheShmaWVsZHNOYW1lKSkge1xyXG4gICAgXHRcdHZhciBmaWVsZHNTZXQgPSB7fVxyXG4gICAgXHRcdGZpZWxkc05hbWUuZm9yRWFjaCgoZmllbGQpID0+IHtcclxuXHJcbiAgICBcdFx0XHR2YXIgd2F0Y2ggPSB0aGlzLndhdGNoZXNbZmllbGRdXHJcbiAgICBcdFx0XHRpZiAodHlwZW9mIHdhdGNoID09ICdmdW5jdGlvbicpIHtcclxuICAgIFx0XHRcdFx0d2F0Y2guY2FsbChudWxsLCB0aGlzLm1vZGVsW2ZpZWxkXSlcclxuICAgIFx0XHRcdH1cclxuICAgIFx0XHRcdGZpZWxkc1NldFtmaWVsZF0gPSAxXHJcblxyXG4gICAgXHRcdFx0Zm9yKHZhciBydWxlIGluIHRoaXMucnVsZXMpIHtcclxuICAgIFx0XHRcdFx0aWYgKHRoaXMucnVsZXNbcnVsZV0uc3BsaXQoJywnKS5pbmRleE9mKGZpZWxkKSAhPSAtMSkge1xyXG4gICAgXHRcdFx0XHRcdGZpZWxkc1NldFtydWxlXSA9IDFcclxuICAgIFx0XHRcdFx0fVxyXG4gICAgXHRcdFx0fVxyXG4gICAgXHRcdH0pXHJcblxyXG5cclxuICAgIFx0XHQkJC5iaW5kaW5nLnVwZGF0ZSh0aGlzLmN0eCwgdGhpcy5tb2RlbCwgT2JqZWN0LmtleXMoZmllbGRzU2V0KSwgZXhjbHVkZUVsdClcclxuICAgIFx0fVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuJCQudmlld0NvbnRyb2xsZXIgPSBmdW5jdGlvbihlbHQsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBuZXcgVmlld0NvbnRyb2xsZXIoZWx0LCBvcHRpb25zKVxyXG59XHJcblxyXG4kJC5pc1ZpZXdDb250cm9sbGVyID0gZnVuY3Rpb24obykge1xyXG4gICAgcmV0dXJuIG8gaW5zdGFuY2VvZiBWaWV3Q29udHJvbGxlclxyXG59XHJcblxyXG59KSgpO1xyXG4iLCJcbiQkLnNlcnZpY2UucmVnaXN0ZXJTZXJ2aWNlKCdicmFpbmpzLmh0dHAnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRnZXQodXJsKSB7XG5cdFx0XHRyZXR1cm4gJC5nZXRKU09OKHVybClcblx0XHR9LFxuXG5cblx0XHRwb3N0KHVybCwgZGF0YSkge1xuXHRcdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHR1cmwgOiB1cmwsXG5cdFx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHRcdGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpXG5cdFx0XHR9KVxuXHRcdH0sXG5cblx0XHRwdXQodXJsLCBkYXRhKSB7XG5cdFx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdFx0bWV0aG9kOiAnUFVUJyxcblx0XHRcdFx0dXJsIDogdXJsLFxuXHRcdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0XHRkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxuXHRcdFx0fSlcblx0XHR9LFx0XHRcdFxuXG5cdFx0ZGVsZXRlKHVybCkge1xuXHRcdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogJ0RFTEVURScsXG5cdFx0XHRcdHVybCA6IHVybCxcblx0XHRcdH0pXHRcdFx0XHRcblx0XHR9LFxuXG5cdFx0cG9zdEZvcm1EYXRhKHVybCwgZmQpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0ICB1cmw6IHVybCxcblx0XHRcdCAgdHlwZTogXCJQT1NUXCIsXG5cdFx0XHQgIGRhdGE6IGZkLFxuXHRcdFx0ICBwcm9jZXNzRGF0YTogZmFsc2UsICAvLyBpbmRpcXVlIMOgIGpRdWVyeSBkZSBuZSBwYXMgdHJhaXRlciBsZXMgZG9ubsOpZXNcblx0XHRcdCAgY29udGVudFR5cGU6IGZhbHNlICAgLy8gaW5kaXF1ZSDDoCBqUXVlcnkgZGUgbmUgcGFzIGNvbmZpZ3VyZXIgbGUgY29udGVudFR5cGVcblx0XHRcdH0pXHRcdFx0XHRcblx0XHR9XG5cblx0XHRcblx0fVxufSk7XG5cblxuXG5cblxuXG4iXX0=
