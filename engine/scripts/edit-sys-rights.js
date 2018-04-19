// ****************************************************************************************************
// Last modified on
// 07-MAR-2017
// ****************************************************************************************************
//==================================================================================================
// File name: edit-sys-rights.js
//==================================================================================================
function RoleEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		// labelWidth: 125,
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: params.showToolbar,
		url: params.url,
		postBack: "engine/sys-rights",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
					.setprops("position", {label:"Position", numeric:true})
					.setprops("status_code_id", {label:"Status", numeric:true})
					.setprops("code", {label:"Code"})
					.setprops("rights", {label:"Rights"})
					.setprops("description", {label:"Description"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("Role", function(editor, tab) {
					editor.AddGroup("Role", function(editor) {
						editor.AddEdit({ID: "id"});
						editor.AddEdit({ID: "code"});
						editor.AddEdit({ID: "rights"});
						editor.AddMemo({ID: "description"});
					});
					
					editor.AddGroup("Options", function(editor) {
						editor.AddEdit({ID: "position"});
						editor.AddRadioButton("status_code_id", {
							key: "id",
							value: "value",
							data: [
								{id:10, value:"Active"},
								{id:0, value:"Inactive"}
							]
						});
					});
				});
			});
		}
	});
}; 
