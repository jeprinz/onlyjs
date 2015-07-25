# onlyjs
Allows HTML and CSS to be generated from a JSON representation.

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
This allows you to put any code you want into your HTML representation directly:
```javascript
makeHtml([
    {p: String(new Date())}
]);
```
Will be displayed as:
  <p>Sat Jul 25 2015 15:40:38 GMT-0400 (Eastern Daylight Time)</p>
