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
  	t = t.substr(1, t.length-2)
  	if (t.startsWith('\\u')) {
  		return String.fromCharCode(parseInt(t.substr(2), 16))
  	}
  	return t
  }

  let not = false
  if (t.startsWith('!')) {
    t = t.substr(1)
    not = true
  }
  let ret
  const f = data[t]  
  if (typeof f == 'function') {
    ret = f.call(data, data.$scope)
  }
  else {
    ret = getObjectValue(data, t)
  }
  return (not) ? !ret : ret

}


function replace(s, firstChar, lastChar, callback) {
	//console.log('replace', firstChar, lastChar, s)
	let d = s.lastIndexOf(firstChar)
	while (d != -1) {
		const f = s.indexOf(lastChar, d)
		if (f == -1) {
			throw 'syntax error while evaluating' + s
		}
		const ret = callback(s.substring(d+1, f))
		s = s.substring(0, d) + ret + s.substring(f+1)
		d = s.lastIndexOf(firstChar)
	} 
	return s 
}

function evalSimple(data, s) {
	//console.log('evalSimple', s, data)
	let idx = 1
	s = replace(s, '[', ']', function(expr) {
		const tab = []
		expr.split(',').forEach((i) => {
			tab.push(getValue(data, i))
		})
		const vName = '$$' + idx++
		data[vName] = tab      
		return vName
	}) 

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

		let idx = 1

		s = replace(s, '{', '}', function(expr) {
			const ev = evalSimple(data, expr)
			//console.log('ev', ev)
			const vName = '$' + idx++
			data[vName] = ev
			return vName
		}) 		

		return evalSimple(data, s)		
	}
  
	return getValue(data, t)
}



$$.eval = {
	evaluate
}


})();
