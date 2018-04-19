function GetNotes(params){
	var container = params.container;
	HtmlEdit({
		container: container,
		textName: params.requestParams.text_name,
		sourcePath: "engine",
		init: function(editor) {
			// editor.Refresh();
			desktop.Ajax(this, ("/engine/get/{0}/{1}").format("edit", "get-text"), {text_name: editor.textName, source_path: editor.sourcePath}, 
				function(result) {
					editor.htmlContent = result.data[0].notes_html;
					editor.htmlContainer.html(editor.htmlContent);
				})
		}
	});
	// desktop.Ajax(this, ("/engine/get/{0}/{1}").format("edit", "get-text"), 
		// {text_name: params.requestParams.text_name}, 
		// function(result) {
			// HtmlEdit({
				// container: container,
				// textName: params.requestParams.text_name,
				// htmlContent: result.data[0].notes_html,
				// init: function(editor) {
					// console.log("init");
				// }
			// });
		// }
	// );
}
	
	// desktop.svg.each(function(i, name) {
		// var c = CreateElement("div", container).addClass("icon");
		// if(desktop.svg.isClone(name)) {
			// c.attr("clone", "1");
			// desktop.SetHint(c, function(dialog, container) {
				// container.html(name);
				// container.append("<div class='clone'>"+desktop.svg.getClone(name)+"<div>");
			// }, "top");
		// } else {
			// c.attr("clone", "0");
			// desktop.SetHint(c, name, "top");
		// };
		
		// desktop.svg.draw(c, name);
	// });
};
