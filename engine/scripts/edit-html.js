// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-note.js
//==================================================================================================
function HtmlEdit(params){
	return new HtmlEditor({
		id: params.id,
		textID: params.textID,
		textName: params.textName,
		sourcePath: params.sourcePath,
		// dialog: params.dialog,
		container: params.container,
		htmlContent: params.htmlContent,
		containerPadding: defaultValue(params.containerPadding, 10),
		containerPadding: defaultValue(params.containerPadding, 10),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: params.showToolbar,
		// url: params.url,
		// postBack: params.postBack,
		init: function(editor) {
			editor.Events.OnSave.add(function(editor) {
				// console.log(editor.Content());
				// alerts("save")
				// editor.toolbar.SetVisible("open", !editor.editing);
			});
			
			if(params.init) {
				params.init(editor);
			};
			// editor.Events.OnUpdateButtons.add(function(editor) {
				// editor.toolbar.SetVisible("open", !editor.editing);
			// });
			
			// editor.Events.OnInitToolbar.add(function(sender, toolbar) {
				// toolbar.NewItem({
					// id: "open",
					// icon: "folder-outline",
					// iconColor: "#F5B104",
					// hint: "Open",
					// click: function(item) {
						// window.open("http://applications.insky-inc.com/home/note/" + params.textID)
					// }
				// });
			// });
			
			// editor.Events.OnInitContent.add(function(sender, container) {
				// var noteContainer = CreateElement("div", container)
					// .attr("x-sec", "note-container")
					// .attr("id", "mce-content");
					
				// noteContainer.html(sender.dataset.get("notes_html"))
				// container.attr("contenteditable", "true");
				
				// tinymce.init({ selector:'div[id="mce-content"]' });
				// tinymce.init({menubar:false, selector:'div[x-sec="note-container"]' });
				// tinymce.init({menubar:false, statusbar:false, selector:'div[x-sec="note-container"]' });
			// });
		}
	});
}; 
