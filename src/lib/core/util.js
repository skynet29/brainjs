(function () {

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
			for (let i of value) {
				var ret = false
				for (let t of type) {
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
			for (let f in type) {

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

	function toSourceString(obj, recursion) {
		var strout = "";

		recursion = recursion || 0;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				strout += recursion ? "    " + prop + ": " : "var " + prop + " = ";
				switch (typeof obj[prop]) {
					case "string":
					case "number":
					case "boolean":
					case "undefined":
						strout += JSON.stringify(obj[prop]);
						break;

					case "function":
						// won't work in older browsers
						strout += obj[prop].toString();
						break;

					case "object":
						if (!obj[prop])
							strout += JSON.stringify(obj[prop]);
						else if (obj[prop] instanceof RegExp)
							strout += obj[prop].toString();
						else if (obj[prop] instanceof Date)
							strout += "new Date(" + JSON.stringify(obj[prop]) + ")";
						else if (obj[prop] instanceof Array)
							strout += "Array.prototype.slice.call({\n "
								+ toSourceString(obj[prop], recursion + 1)
								+ "    length: " + obj[prop].length
								+ "\n })";
						else
							strout += "{\n "
								+ toSourceString(obj[prop], recursion + 1).replace(/\,\s*$/, '')
								+ "\n }";
						break;
				}

				strout += recursion ? ",\n " : ";\n ";
			}
		}
		return strout;
	}

	function evaluate(strInput, str) {
		return (new Function(str + 'return ' + strInput))();
	}


	function safeEval(varName, data) {

		return evaluate(varName, toSourceString(data))

	}





	function arrayBufferToString(buffer) {
		return String.fromCharCode.apply(null, new Uint16Array(buffer));
	}


	function objToArray(obj, keyName) {
		const ret = []
		for (let key in obj) {
			const data = $.extend({}, obj[key])
			data[keyName] = key
			ret.push(data)
		}
		return ret
	}

	function objToArray2(obj) {
		const ret = []
		for (let key in obj) {
			ret.push({name: key, value: obj[key]})
		}
		return ret
	}

	function isMobileDevice() {
		return window.matchMedia("(max-width: 767px)").matches;
	}

	function isTouchDevice() {
		return 'ontouchstart' in window
	}

	function knuthShuffle(length) {
		//console.log('knuthShuffle', length)
		let arr = []
		for (let k = 0; k < length; k++) {
			arr.push(k)
		}

		var rand, temp, i;

		for (i = arr.length - 1; i > 0; i -= 1) {
			rand = Math.floor((i + 1) * Math.random());//get random between zero and i (inclusive)
			temp = arr[rand];//swap i and the zero-indexed number
			arr[rand] = arr[i];
			arr[i] = temp;
		}
		return arr;
	}

	function concatTypedArray(a, b) {
		if (a == null) {
			return b
		}
		const c = new a.constructor(a.length + b.length)
		c.set(a)
		c.set(b, a.length)
		return c
	}

	function wait(delayMs) {
		return new Promise((resolve) => {
			setTimeout(resolve, delayMs)
		})
	}

	function mergeArray(a, b) {
		return [...new Set([...a, ...b])] 
	}
	
	function getEnumName(enumVal) {
		const ret = {}
		Object.entries(enumVal).forEach(([key, val]) => { ret[val] = key })
		return ret
	}	

	$$.util = {
		checkType,
		safeEval,
		arrayBufferToString,
		toSourceString,
		evaluate,
		objToArray,
		objToArray2,
		isMobileDevice,
		isTouchDevice,
		knuthShuffle,
		concatTypedArray,
		wait,
		mergeArray,
		getEnumName
	}


})();
