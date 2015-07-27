$(document).ready(function(){
	function listHolder(){
		var borderCss = {
			borderStyle: "solid",
			borderWidth: "10px"
		}
		var holderCss = only.merge(borderCss, {
			height: "200px",
			width: "200px"
			});
		var html = only.html({
			div: [],
			css: holderCss 
		});
		return {
			html: html,
			addElement: function(el){
				var newChild = (only.html({
					div: [
						el,
					],
					css: borderCss
				}));
				html.appendChild(newChild);
			}
		};
	}
	var lh = listHolder();
	lh.addElement(only.html({p: 'hi'}));
	lh.addElement(only.html({p: 'bye'}));
	only.setHtml([
	              lh.html
	              ]);
});