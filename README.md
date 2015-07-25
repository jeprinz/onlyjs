# only.js: Write everything in javascript
only.js allows HTML and CSS to be generated from a JSON representation, which allows for easy to understand code.

###HTML
For example, this HTML:
```HTML
  <div>
    <p>Food:</p>
    <ul class="cake">
      <li>Milk</li>
      <li>Spinach</li>
      <li>Tacos</li>
      <li>Peas</li>
    </ul>
  </div>
```
can become this javascript:
```javascript
only.makeHtml([
  {div: [
    {ul: [
        {li: "Milk"},
        {li: "Spinach"},
        {li: "Tacos"},
        {li: "Peas"}
      ],
      class: "cake"
    }]//ul
  }//div
]);
```

###CSS
This CSS:
```CSS
.cake {
  color: red;
  display: inline-block;
}
```
becomes this javascript:
```javascript
only.makeCss(".cake",{
  color: "red",
  display: "inline-block"
});
```

###Inline javascript
This allows you to put any code you want into your HTML representation directly:
```javascript
makeHtml([
    {p: String(new Date())}
]);
```
Will be displayed as:
  <p>Sat Jul 25 2015 15:40:38 GMT-0400 (Eastern Daylight Time)</p>
  
only.js also allows you to associate javascript with an HTML element without the need for an id.

###Keep all code for one component together
This HTML+javascript, spread between two files:
```HTML
<body>
  <!-- ... -->
  <button id="button1"></button>
  <!-- ... -->
</body>
```
```javascript
//...
$(".button1").click(
	alert("I just got clicked!");
)
//...
```
can become just one thing in one file:
```javascript
only.makeHtml([
    //...
	{button: "ima button",
		code: function(me){//this function gets run with me as the button element
			$(me).click(function(){
				alert("I just got clicked!");
			});
		}
	}
	//...
]);
```
