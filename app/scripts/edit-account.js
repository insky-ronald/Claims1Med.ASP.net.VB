// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-masterpolicy.js
//==================================================================================================
function AccountEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 10),
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: params.showToolbar,
		url: params.url,
		postBack: "accounts",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true})
					.setprops("seq_no", {label:"Position", numeric:true})
					// .setprops("type", {label:"Type", numeric:true, required:true})
					.setprops("type", {label:"Type", numeric:true})
					.setprops("code", {label:"Code", required:true})
					.setprops("description", {label:"Description", required:true})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Account", function(editor) {
						editor.AddText("code");
						editor.AddText("description");
					});
						
					editor.AddGroup("Option", function(editor) {
						editor.AddNumeric("seq_no");
						editor.AddRadioButton("type", {
							key: "id",
							value: "value",
							data: [
								{id:0, value:"Type 0"},
								{id:1, value:"Type 1"},
								{id:3, value:"Type 3"}
							]
						});
					});
				});
			});
		}
	});
}; 
