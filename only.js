module.exports = (function(){

    //Does the browser have the iterator feature?
    var iterators = Symbol && Symbol.iterator;
    function isIterable(obj){
      return (iterators && obj[Symbol.iterator]) || obj instanceof Array
    }

    function parseError(msg){
      throw new TypeError("only.js parse error: " + msg);
    }

    function warn(msg){
      console.warn("onlyjs WARNING: " + msg);
    }

    //takes an HTML tag name, value, and attribute list and returns HTMLElement
    function parseNameandValue(name, value, attrList, css) {
      if (typeof name !== "string"){
        parseError("expected string for HTML tag name, but given " + name + (typeof name));
      }
      var el = document.createElement(name);
      if (isUnknownElement(el)){
        warn('"' + name + '" is not a valid HTML tag');
      }

      if (value.constructor === Object){
        el.appendChild(parseHtmlJson(value));
      } else if (value instanceof HTMLElement) {
        el.appendChild(value);
      } else if(typeof value === "string") {
        el.innerHTML = value;
      } else if (isIterable(value)) {
        var htmlList = parseHtmlList(value);
        for (var i in htmlList){
          var htmlObj = htmlList[i];
          el.appendChild(htmlObj);
        }
      }

      for (var i in attrList){
        var attr = attrList[i];
        el.setAttribute(attr.name, attr.val);
      }
      if (css){
        setElementCss(el, css);
      }
      return el;
    }


    //takes HTML Json representation and returns HTMLElement
    function parseHtmlJson(obj) {
      if (obj instanceof Array){//TODO why is this here
        parseError("Expected HTMLElement or object, but recieved " + obj);
      }
      var htmlObj;
      if (obj instanceof Object) {
        var attrList = [];
        var css = null;
        var elements = Object.keys(obj);
        name = elements[0];

        for (var i = 1; i < elements.length; ++i) {
          var el = elements[i];
          if (el === "css"){
            css = obj[el];
          } else {
            var attr = {name: el, val: obj[el]}
            attrList.push(attr);
          }
        }
        var value = obj[name];
        htmlObj = parseNameandValue(name, value, attrList, css);
      } else if (typeof obj === "string"){
        htmlObj = document.createTextNode(obj);
      } else {
        parseError(String(obj) + " is not a valid HTML object: must be either a JSON HTML representation or an HTMLElement");
      }
      return htmlObj;
    }

    function isUnknownElement(el){
      return el instanceof HTMLUnknownElement;
    }

    //returns a list of HTML elements inside base that have dataIdName=dataId attribute
    function getByDataId(base, dataId){
      var element = base.querySelector('[' + dataIdName + '="' + dataId + '"]');
      return element;
    }

    //parses a list of HTMLElement and HTML json representations and
    //returns list of HTMLElement as result
    function parseHtmlList(list) {
      if (!(isIterable(list))){
        parseError("expected Array, but was given: " + String(list));
      }

      return list.map(function(element){
        if(element instanceof Node){
          return element;
        } else {
          return parseHtmlJson(element);
        }
      });
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
      var html = parseHtmlJson({body: html});
      document.body = html;
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

    return {
      html: parseHtmlJson,
      setHtml: setHtml,
      makeCss: makeCss,
      merge: merge
    }
  })();
