(function() {

const modules = {}	

function registerModule(name, arg1, arg2) {
	var deps = []
	var fn = arg1
	if (Array.isArray(arg1)) {
		deps = arg1
		fn = arg2
	}

	console.log(`[module] register module '${name}' with deps`, deps)

	modules[name] = {deps, fn, status: 'notloaded'}
}

function getModule(name) {
	//console.log(`[Core] getObject ${domain}:${name}`)
	var mod = modules[name]
	if (mod) {

		if (mod.status == 'notloaded') {
			var deps = $$.service.getServices(mod.deps)
			console.log(`[module] instance module '${name}'`)
			mod.obj = mod.fn.apply(null, deps)
			mod.status = 'ready'
		}
		return mod.obj
	}
	else {
		//srv.status = 'notregistered'
		console.error(`[module] module '${name}' is not registered`)
	}
}

$$.module = {
	getModule,
	registerModule
}

})();
