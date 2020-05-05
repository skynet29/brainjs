
(function(){

let services = {}




function resolveServices(deps) {
	//console.log('[Core] getServices', deps)
	return deps.map(function(depName) {
		var srv = services[depName]
		if (srv) {
			if (srv.status == 'notloaded') {
				var deps2 = resolveServices(srv.deps)
				var config = srv.config || {}
				//console.log(`[service] instance service '${depName}' with config`, config)
				var args = [config].concat(deps2)
				srv.obj = srv.options.init.apply(null, args)
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
	//console.log('[Core] configureService', name, config)
	if (typeof name != 'string') {
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

function registerService(name, options) {
	if (!$$.util.checkType(options, {
		$deps: ['string'],
		init: 'function'
	})) {
		console.error(`[service] registerService '${name}': bad options`, options)
		return
	}


	var deps = options.deps || []

	//console.log(`[service] register service '${name}' with deps`, deps)

	services[name] = {deps, options, status: 'notloaded'}
}

function getServices() {
	return Object.keys(services)
}

function getServiceInfo(srvName) {
	const ctrl = services[srvName]
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
		return ret
	}
	else {
		throw 'Unknown service'
	}
}


$$.service = {
	registerService,
	configureService,
	resolveServices,
	getServices,
	getServiceInfo
}

})();
