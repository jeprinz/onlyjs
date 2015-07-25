var only = function(){
	var content = jQuery("#content");
	var callbacks = {};//XXX make callbacks get deleted when element is deleted, or not global

	function parseHtmlObj(obj) {
		if (obj instanceof Object) {
			var keys = [];
			var attrList = [];

			var elements = Object.keys(obj);
			name = elements[0];

			for (var i = 1; i < elements.length; ++i) {
				var el = elements[i];
				attrList.push(el + "=" + JSON.stringify(obj[el]));
			}
			var attr = " " + attrList.join(" ");

			var value = obj[name];
			return parseNameandValue(name, value, attr);
		} else {
			return JSON.stringify(obj);
		}
	}

	function parseNameandValue(name, value, attr) {
		var valStr;
		if (value instanceof Array) {
			valStr = parseHtmlList(value);
		} else if (value instanceof Function) {
			var hash = "" + Object.keys(callbacks).length;
			var dataId = 'data-only-id="' + hash + '"';
			attr += ' ' + dataId;
			callbacks[dataId] = value;
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

	function parseHtmlList(list) {
		var strList = [];
		for ( var i in list) {
			var el = list[i];
			strList.push(parseHtmlObj(el));
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
	
	return {
		makeHtml: function(html) {
			var html = parseHtmlList(html);
			document.body.innerHTML = html;
			for (var id in callbacks){
				callbacks[id](getByDataId(id));
			}
		},

		makeCss: function(name, css){
			var sheet = document.createElement('style');
			sheet.innerHTML = genCss(name, css);
			console.log(genCss(name, css));
			document.body.appendChild(sheet);
		}
	}
}();
