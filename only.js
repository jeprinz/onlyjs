var only = function(){

	//used to temporarily mark elements that need to have functions
	//run on them after HTML is generated
	var dataIdName = "date-onlyjs-id";
	
	function parseError(msg){
		throw new TypeError("only.js parse error: " + msg);
	}

	function warn(msg){
		console.log("only.js WARNING: " + msg);
	}
	
	//takes an HTML tag name, value, and sttribute list and returns HTMLElement
	function parseNameandValue(name, value, attrList, callbacks) {
		if (!isValidHtmlTag(name)){
			warn('"' + name + '" is not a valid HTML tag');
		}
		var el = document.createElement(name);
		if (value instanceof Array) {
			var htmlList = parseHtmlList(value, callbacks);
			for (var i in htmlList){
				var htmlObj = htmlList[i];
				el.appendChild(htmlObj);
			}
		} else if (value instanceof Function) {
			attrList.push(setupCallback(value, callbacks));
		} else {
			el.innerHTML = value;
		}
		for (var i in attrList){
			var attr = attrList[i];
			el.setAttributeNode(attr);
		}
		return el;
	}

	
	//takes HTML Json representation and returns HTMLElement
	function parseHtmlJson(obj, callbacks) {
		var htmlObj;
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
				      var attrObj = document.createAttribute(el);
				      attrObj.value = obj[el];
				      attrList.push(attrObj);
				}
			}
			var value = obj[name];
			htmlObj = parseNameandValue(name, value, attrList, callbacks);
		} else {
			htmlObj = JSON.stringify(obj);
		}
		return htmlObj;
	}

	function isValidHtmlTag(tag){
		return !(document.createElement(tag) instanceof HTMLUnknownElement);
	}
	
	//adds a function to be run later to the callbacks object, along with the element id it should run on
	function setupCallback(func, callbacks){
		var hash = "" + Object.keys(callbacks).length;
		callbacks[hash] = func;
		var dataAttr = document.createAttribute(dataIdName);
		dataAttr.value = hash;
		return dataAttr;
	}
	
	//returns a list of HTML elements inside base that have dataIdName=dataId attribute
	function getByDataId(base, dataId){
		var element = base.querySelectorAll('[' + dataIdName + '="' + dataId + '"]');
		return element;
	}
	
	//parses a list of HTMLElement and HTML json representations and
	//returns list of HTMLElement as result
	function parseHtmlList(list, callbacks) {
		if (!(list instanceof Array)){
			parseError("expected Array, but was given: " + String(list));
		}
		
		return list.map(function(element){
			if(element instanceof HTMLElement){
				return element;
			} else {
				return parseHtmlJson(element, callbacks);
			}
		});
	}
	
	//creates HTMLElement object from JSON representation
	function makeHtmlElement(name, html){
		if (!isValidHtmlTag(name)){
			warn('"' + name + '" is not a valid HTML tag');
		}
		if (!callbacks)
			var callbacks = {};
		var htmlList = parseHtmlList(html, callbacks);
		var result = document.createElement(name);
		for (var i in htmlList){
			var htmlObj = htmlList[i];
			result.appendChild(htmlObj);
		}

		//make result not display, then add it to body so that jQuery selector
		//callbacks on it will work
		var oldDisplay = result.style.display;
		result.style.display = "none";
		document.body.appendChild(result);

		for (var id in callbacks){
			var element = getByDataId(result, id);
			callbacks[id](element);
			element[0].removeAttribute(dataIdName);
		}
		
		//remove result from body, then restore its display attribute
		document.body.removeChild(result);
		result.style.display = oldDisplay;

		return result;
	}
	
	//CSS
	
	//takes name of CSS class or id and a JSON representation of the CSS
	//and returns CSS as a string
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
		html: makeHtmlElement,
		makeHtml: function(html) {
			var html = makeHtmlElement("body", html);
			document.body = html;
			for (var id in callbacks){
				var element = getByDataId(html, id);
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
