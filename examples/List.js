$(document).ready(function(){
	function listHolder(){

		var borderWidth = 10 + "px";

		//CSS
		var holderCss = {
			display: "inline-block",
			borderSpacing: "0px",
			borderStyle: "solid",
			borderWidth: borderWidth
		};
		var dividerCss = {
			backgroundColor: 'black',
			height: "100%",
			width: borderWidth
		};
		//HTML
		var holder = only.html({
			tr: []
		});
		var html = only.html({
			table: holder,
			css: holderCss
		});
		function divider(){
			return only.html({
				td: "",
				css: dividerCss
			});
		}

		//logic
		var isEmpty = true;
		function addElement(el){
			if (!isEmpty){
				holder.appendChild(divider());
			} else {
				isEmpty = false;
			}
			var newChild = (only.html({
				td: [
				     el,
				     ]
			}));
			holder.appendChild(newChild);
		}

		return {
			html: html,
			addElement: addElement
		};
	}
	var lh = listHolder();
	lh.addElement(only.html({p: 'hi, yo@'}));
	lh.addElement(only.html({
		div: [
		      {p: "1"},
		      {p: "2"},
		      {p: "3"}
		      ]
	}))
	lh.addElement(only.html({p: 'bye'}));
	
	var lh2 = listHolder();
	for (var i = 0; i < 10; ++i){
		lh2.addElement(only.html({p: 'asdfl;kjqweproiu'}));
	}
	
	only.setHtml([
	              lh.html,
	              lh2.html
	              ]);
});