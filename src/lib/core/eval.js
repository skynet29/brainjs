(function() {

function getObjectValue(data, t) {
  //console.log('getObjectValue', data, t)
  t = t.split('.')
  const v = t.shift()
  const val = data[v]
  //console.log('val', val)
  if (t.length == 0 || val == undefined || val == null) {
    return val
  }
  return getObjectValue(val, t.join('.'))

}

function getValue(data, t) {
  //console.log('getValue', data, t)
  t = t.trim()
  const v = parseFloat(t)
  if (!isNaN(v)) {
    return v
  }

  if (t == 'true') {
    return true
  }

  if (t == 'false') {
    return false
  }

  if (t.startsWith("'") && t.endsWith("'")) {
  	return t.substr(1, t.length-2)
  }

  let not = false
  if (t.startsWith('!')) {
    t = t.substr(1)
    not = true
  }
  let ret
  const f = data[t]  
  if (typeof f == 'function') {
    ret = f.call(data)
  }
  else {
    ret = getObjectValue(data, t)
  }
  return (not) ? !ret : ret

}


function evalSimple(data, s) {
	//console.log('evalSimple', s)
	let d = s.lastIndexOf('[')
	      //console.log('d', d, s[d+1])
	      //var data = {}
	let idx = 1;
	while (d != -1) {
		const f = s.indexOf(']', d)
		const tab = []
		s.substring(d+1, f).split(',').forEach((i) => {
			tab.push(getValue(data, i.trim()))
		})
		//console.log('ev', ev)
		const vName = '$$' + idx++
		data[vName] = tab      
		//console.log('data', data)
		s = s.substring(0, d) + vName + s.substring(f+1)
		//console.log('s', s)
		d= s.lastIndexOf('[')
	}  

	const ret = {}
	s.split(',').forEach((i) => {
		const t = i.split(':')
		const name = t[0].trim()
		const value = (t.length == 1) ? name : t[1].trim()
		ret[name] = getValue(data, value)    
	})
	return ret
}


function evaluate(data, t) {
	t = t.replace(/\n/g, '').trim()
	//console.log('evaluate', t)
	data = $.extend(true, {}, data)
	//console.log('data', data)
	if (t.startsWith('{') && t.endsWith('}')) {
		let s = t.substr(1, t.length-2)

		//console.log('t', t)
		let d = s.lastIndexOf('{')
		//console.log('d', d, s[d+1])
		//var data = {}
		let idx = 1;
		while (d != -1) {
			const f = s.indexOf('}', d)
			const ev = evalSimple(data, s.substring(d+1, f))
			//console.log('ev', ev)
			const vName = '$' + idx++
			data[vName] = ev
			//console.log('data', data)
			s = s.substring(0, d) + vName + s.substring(f+1)
			//console.log('s', s)
			d = s.lastIndexOf('{')
		}
	  //console.log('ret', s)
	  return evalSimple(data, s)		
	}
  
	return getValue(data, t)
}



$$.eval = {
	evaluate
}


})();
