var content = jQuery("#content")

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
	} else {
		valStr = value;
	}
	return "<" + name + attr + ">" + valStr + "</" + name + ">";
}

function parseHtmlList(list) {
	var strList = [];
	for ( var i in list) {
		var el = list[i];
		strList.push(parseHtmlObj(el));
	}
	return strList.join("");
}

function jsOnly(html, css) {
	var html = parseHtmlList(html);
	console.log(html);
	$(document.body).html(html);
}

function makeCss(name, css){
	var sheet = document.createElement('style');
	sheet.innerHTML = genCss(name, css);
	document.body.appendChild(sheet);
}

function genCss(name, css){
	cssText = [];
	cssText.push(name);
	cssText.push('{');
	for (var el in css){
		cssText.push(el+":");
		cssText.push(css[el]);
	}
	cssText.push('}');
	return cssText.join('');
}
