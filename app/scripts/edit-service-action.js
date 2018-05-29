// ****************************************************************************************************
// Last modified on
// 07-MAR-2017
// ****************************************************************************************************
//==================================================================================================
// File name: edit-service-action.js
//==================================================================================================
function ServiceActionEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: params.showToolbar,
		url: params.url,
		postBack: "service-actions",
		// postBack: "sys-users",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Events.OnEdit.add(function(data) {
					console.log("OnEdit");
				});
				data.Events.OnCancel.add(function(data) {
					console.log("OnCancel");
				});
				data.Events.OnChanged.add(function(data) {
					console.log("OnChanged");
				});
			data.Columns
				.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
				.setprops("code", {label:"Code", required:true})
				.setprops("action_name", {label:"Action", required:true})
				.setprops("description", {label:"Description", required:false})
				.setprops("position", {label:"Position", numeric:true, readonly:false})
				.setprops("action_type_id", {label:"Type", numeric:true, readonly:false})
				.setprops("status_code_id", {label:"Status", numeric:true, readonly:false})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Action", function(editor) {
						editor.AddEdit({ID: "id"});
						editor.AddEdit({ID: "code"});
						editor.AddEdit({ID: "action_name"});
						editor.AddMemo({ID: "description"});
					});
									
					editor.AddGroup("Options", function(editor) {
						editor.AddEdit({ID: "position"});
						editor.AddRadioButton("action_type_id", {
							key: "id",
							value: "value",
							data: [
								{id:0, value:"Main Page"},
								{id:10, value:"Sub Page"}
							]
						});
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
				
				// AccountsLookupView, refer to "engine/view-rights-lookup.js"
				editor.NewSubSelectionView("Rights Assignment", 300, "rights", RightsLookupView);
				
				// editor.NewContainer("Roles", function(container, tab) {
					// container.css("height", 100)
					// console.log(editor)
					// console.log(tab)
				// });
			});
		}
	});
}; 
