# only.js: Write everything in javascript
only.js allows HTML and CSS to be written inline in Javascript code using JSON representation.

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
only.setHtml([
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

or, put css style inline with javascript
```javascript
only.setHtml({
  p: "Hello World",
  css: {
    color: "red",
    display: "inline-block"
  }
})
```

###Inline javascript
This allows you to put any code you want into your HTML representation directly,
just like a templating engine but in Javascript:
```javascript
only.setHtml([
    {p: String(new Date())}
]);
```
Will be displayed as:
  <p>Sat Jul 25 2015 15:40:38 GMT-0400 (Eastern Daylight Time)</p>

###Keep all code for one component together
This HTML+javascript+CSS, spread between three files:
```HTML
<body>
  <!-- ... -->
  <button id="button1" class="button"></button>
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
```CSS
/* ... */
.button {
	border-style: solid;
	border-width: 5px;
}
/* ... */
```
can become just one thing in one file:
```javascript
//create button
var button = only.html(
  {button: "ima button",
		css: {
			borderStyle: "solid",
			borderWidth: "5px"
		}
	}
);

//add listener
button.addEventListener("click", function(e){
  console.log("button clicked!");
})

//add to page
only.setHtml([
  button
])
```

###Reuse Elements Easily
To reuse an element, all you need to do is save it in a var:
```javascript
//create reusable error message
var errorMsg = {
	div: [
		{p: "there has been an error"},
		{img: "",
			src: "error.png"}
	],
	style: "border-width:10;border-style:solid;"
};

//use it:
only.setHtml([
	//...
	errorMsg,
	//... more stuff
	errorMsg
]);

```


###Another example
Simple user interaction:

```javascript
var input = only.html({input: ""});
var submit = only.html({button: "Submit Name"})
var response = only.html({p: ""});

//no need for an id on the button
submit.onclick = function(){
	var name = input.value;
	response.innerHTML = "Hello " + name, " how are you today?";
}

only.setHtml([
	{p: "Please enter your name"},
	input,
	submit,
	response
]);
```
