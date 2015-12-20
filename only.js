var only = function(){

	//used to temporarily mark elements that need to have functions
	//run on them after HTML is generated
	var dataIdName = "data-onlyjs-id";

	function parseError(msg){
		throw new TypeError("only.js parse error: " + msg);
	}

	function warn(msg){
		console.log("only.js WARNING: " + msg);
	}

	//takes an HTML tag name, value, and attribute list and returns HTMLElement
	function parseNameandValue(name, value, attrList, callbacks, css) {
		if (typeof name !== "string"){
			parseError("expected string for HTML tag name, but given " + name + (typeof name));
		}
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
		} else if (value.constructor === Object){
			el.appendChild(parseHtmlJson(value));
		} else if (value instanceof HTMLElement) {
			el.appendChild(value);
		} else {
			el.innerHTML = value;
		}
		for (var i in attrList){
			var attr = attrList[i];
			el.setAttributeNode(attr);
		}
		if (css){
			setElementCss(el, css);
		}
		return el;
	}


	//takes HTML Json representation and returns HTMLElement
	function parseHtmlJson(obj, callbacks) {
		var htmlObj;
		if (obj instanceof Object) {
			var keys = [];
			var attrList = [];
			var css = null;
			var elements = Object.keys(obj);
			name = elements[0];

			for (var i = 1; i < elements.length; ++i) {
				var el = elements[i];
				if (el === "code"){
					if (obj[el] instanceof Function && obj[el].length === 1){
						var dataId = setupCallback(obj[el], callbacks);
						attrList.push(dataId);
					} else {
						warn("code attribute must be a function of one argument");
					}
				} else if (el === "css"){
					css = obj[el];
				} else {
					var attrObj = document.createAttribute(el);
					attrObj.value = obj[el];
					attrList.push(attrObj);
				}
			}
			var value = obj[name];
			htmlObj = parseNameandValue(name, value, attrList, callbacks, css);
		} else if (typeof obj === "string"){
			htmlObj = JSON.stringify(obj);
		} else {
			parseError(String(obj) + " is not a valid HTML object: must be either a JSON HTML representation or an HTMLElement");
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
		var element = base.querySelector('[' + dataIdName + '="' + dataId + '"]');
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
	function makeHtmlElement(html){
		callbacks = {};
		var result = parseHtmlJson(html, callbacks);

		//make result not display, then add it to body so that jQuery selector
		//callbacks on it will work
		var oldDisplay = result.style.display;
		result.style.display = "none";
		document.body.appendChild(result);

		for (var id in callbacks){
			var element = getByDataId(result, id);
			callbacks[id](element);
			element.removeAttribute(dataIdName);
		}

		//remove result from body, then restore its display attribute
		document.body.removeChild(result);
		result.style.display = oldDisplay;

		return result;
	}

	//takes HTMLElement and JSON representation CSS and sets the CSS on the HTMLElement
	function setElementCss(el, css){
		for (var property in css){
			if (!(property in el.style)){
				warn('"' + property + '" is not a valid css property');
			}
			el.style[property] = css[property];
		}
	}

	function setHtml(html){
		var html = makeHtmlElement({body: html});
		document.body = html;
	}
	
	function htmlFromStr(str){//make async
	    var div = document.createElement("div");
	    div.innerHTML = str;
	    return div.firstChild;
	}
	
	//CSS

	//takes name of CSS class or id and a JSON representation of the CSS
	//and returns CSS as a string
	function genCss(name, css){
		cssText = [];
		cssText.push(camelToDash(name));
		cssText.push('{');
		for (var el in css){
			cssText.push(el+":");
			cssText.push(css[el]+";");
		}
		cssText.push('}');
		return cssText.join('');
	}


	function makeCss(name, css){
		var sheet = document.createElement('style');
		sheet.innerHTML = genCss(name, css);
		document.body.appendChild(sheet);
	}
	
	//takes camelcase name and returns lower case with dashes name
	function camelToDash(name){
		newNameList = [];
		for (var i = 0; i < name.length; ++i){
			var letter = name[i];
			if (letter === letter.toLowerCase()){
				newNameList.push(letter);
			} else {
				newNameList.push('-');
				newNameList.push(letter.toLowerCase());
			}
		}
		return newNameList.join("");
	}
	
	//Utility functions
	
	function merge(){
		var ret = {};
		for (var i = 0; i < arguments.length; ++i){
			var arg = arguments[i];
			for (var el in arg){
				ret[el] = arg[el];
			}
		}
		return ret;
	}

	function addEvent(obj, type, fn) {
	        if (obj.addEventListener)
	                obj.addEventListener(type, fn, false);
	        else if (obj.attachEvent)
	                obj.attachEvent('on' + type, function() { return fn.apply(obj, [window.event]); });
		else
			throw new Error("add event didn't work for element " + obj);
	}
	
	return {
		html: makeHtmlElement,
		setHtml: setHtml,
		htmlFromStr: htmlFromStr,
		makeCss: makeCss,
		merge: merge,
		addEvent: addEvent
	}
}();
