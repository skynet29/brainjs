(function () {

	let controls = {}

	function isDepsOk(deps) {
		return deps.reduce(function (prev, cur) {

			return prev && (cur != undefined)
		}, true)
	}


	function registerControl(name, options) {
		if (!$$.util.checkType(options, {
			$deps: ['string'],
			init: 'function'
		})) {
			console.error(`[control] registerControl: bad options`, options)
			return
		}


		var deps = options.deps || []

		//console.log(`[control] register control '${name}' with deps`, deps)

		controls[name] = { deps, options, status: 'notloaded' }
	}

	function resolveControl(name) {
		var ret = controls[name]
		if (ret && ret.status == 'notloaded') {
			ret.resolvedDeps = $$.service.resolveServices(ret.deps)
			ret.status = isDepsOk(ret.resolvedDeps) ? 'ok' : 'ko'
		}
		return ret
	}

	function requestWakeLock(iface) {
		if (navigator.wakeLock && navigator.wakeLock.request) {
			navigator.wakeLock.request('screen').then((lock) => {
				console.log('take wakeLock')
				iface.wakeLock = lock
				lock.addEventListener('release', () => {
					console.log('Wake Lock was released')
				})
			})
				.catch((e) => {
					console.error('WakeLock', e)
				})

		}

	}

	function createControl(controlName, elt) {
		//console.log('createControl', controlName, elt.data())
		var ctrl = resolveControl(controlName)

		if (ctrl == undefined) {
			throw (`[control] control '${controlName}' is not registered`)
		}
		//console.log('createControl', controlName, ctrl)
		if (ctrl.status === 'ok') {

			elt.addClass(controlName.replace('.', '-'))
			elt.addClass('CustomControl').uniqueId()


			let { init, props, template } = ctrl.options
			//props = props || {}
			var iface = {
				props: $.extend({}, props, elt.data()),
				name: controlName
			}

			/*
			Object.keys(props).forEach(function(propName) {
				const prop = elt.data(propName)
				iface.props[propName] = (prop != undefined) ? prop : props[propName]
			})
			*/

			if (typeof template == 'string') {
				$(template).appendTo(elt)
			}

			if (template instanceof jQuery) {
				template.children().clone().appendTo(elt)
			}

			elt.get(0).ctrl = iface

			if (typeof init == 'function') {

				var args = [elt].concat(ctrl.resolvedDeps)
				//console.log(`[control] instance control '${controlName}' with props`, iface.props)
				init.apply(iface, args)

			}
			else {
				console.warn(`[control] control '${controlName}' missing init function`)
			}




			return iface
		}
	}

	function getControls() {
		return Object.keys(controls)
	}

	function getControlInfo(ctrlName) {
		const ctrl = controls[ctrlName]
		if (ctrl != undefined) {
			const ret = {
				deps: ctrl.deps
			}
			if (ctrl.options.$iface) {
				ret.iface = ctrl.options.$iface
					.split('\n')
					.map((i) => i.trim())
					.filter((i) => i != '')
			}
			if (ctrl.options.$events) {
				ret.events = ctrl.options.$events.split(';')
			}
			if (ctrl.options.props) {
				ret.props = ctrl.options.props
			}
			return ret
		}
		else {
			throw 'Unknown control'
		}
	}


	$$.control = {
		registerControl,
		createControl,
		getControls,
		getControlInfo
	}

})();
