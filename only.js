var only = function(){

	var dataIdName = "date-onlyjs-id";

	function parseHtmlObj(obj, callbacks) {
		if (obj instanceof Object) {
			var keys = [];
			var attrList = [];

			var elements = Object.keys(obj);
			name = elements[0];

			for (var i = 1; i < elements.length; ++i) {
				var el = elements[i];
				if (el === "code"){
					var dataId = setupCallback(obj[el], callbacks);
					attrList.push(dataId);
				} else {
					attrList.push(el + "=" + JSON.stringify(obj[el]));
				}
			}
			var attr = " " + attrList.join(" ");

			var value = obj[name];
			return parseNameandValue(name, value, attr, callbacks);
		} else {
			return JSON.stringify(obj);
		}
	}

	function isValidHtmlTag(tag){
		return !(document.createElement(tag) instanceof HTMLUnknownElement);
	}
	
	function setupCallback(func, callbacks){
		var hash = "" + Object.keys(callbacks).length;
		var dataId = dataIdName + '="' + hash + '"';
		callbacks[dataId] = func;
		return dataId;
	}
	
	function parseNameandValue(name, value, attr, callbacks) {
		if (!isValidHtmlTag(name)){
			warn('"' + name + '" is not a valid HTML tag');
		}
		var valStr;
		if (value instanceof Array) {
			valStr = parseHtmlList(value, callbacks);
		} else if (value instanceof Function) {
					attr += ' ' + setupCallback(value, callbacks);
			valStr = "";
		}else {
			valStr = value;
		}
		return "<" + name + attr + ">" + valStr + "</" + name + ">";
	}

	function getByDataId(dataId){
		var element = document.querySelectorAll('[' + dataId + ']')
		return element;
	}

	function parseHtmlList(list, callbacks) {
		if (!(list instanceof Array)){
			parseError("expected Array, but was given: " + String(list));
		}
		var strList = [];
		for ( var i in list) {
			var el = list[i];
			strList.push(parseHtmlObj(el, callbacks));
		}
		return strList.join("");
	}

	function genCss(name, css){
		cssText = [];
		cssText.push(name);
		cssText.push('{');
		for (var el in css){
			cssText.push(el+":");
			cssText.push(css[el]+";");
		}
		cssText.push('}');
		return cssText.join('');
	}

	function parseError(msg){
		throw new TypeError("only.js parse error: " + msg);
	}

	function warn(msg){
		console.log("only.js WARNING: " + msg);
	}
	
	return {
		makeHtml: function(html) {
			var callbacks = {};
			var html = parseHtmlList(html, callbacks);
			document.body.innerHTML = html;
			for (var id in callbacks){
				var element = getByDataId(id);
				callbacks[id](element);
				element[0].removeAttribute(dataIdName);
			}
		},

		makeCss: function(name, css){
			var sheet = document.createElement('style');
			sheet.innerHTML = genCss(name, css);
			document.body.appendChild(sheet);
		}
	}
}();
