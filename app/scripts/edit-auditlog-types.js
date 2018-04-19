// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-auditlog-types.js
//==================================================================================================
function AuditLogTypesEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		// labelWidth: 180,
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		showToolbar: defaultValue(params.showToolbar, false),
		url: ("?code={0}").format(params.code),
		postBack: "app/auditlog-types",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
			data.Columns
				.setprops("code", {label:"Code", key:true, maxLength:3, upperCase:true, required:true, readonly:sender.mode === "edit"})
				.setprops("description", {label:"Description", key:true, required:true})
				.setprops("log_type", {label:"Log Type", required:true})
				.setprops("is_active", {label:"Status"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Audit Log Type", function(editor) {
						editor.AddEdit("code");
						editor.AddEdit("description");
						editor.AddListBox("log_type", {
							key: "id",
							value: "value",
							data: [
								{id: "I", value: "Insert"},
								{id: "D", value: "Delete"},
								{id: "U", value: "Update"},
								{id: "A", value: "Any"}
							]
						});
					});
					editor.AddGroup("Option", function(editor) {
						editor.AddRadioButton("is_active", {
							key: "id",
							value: "value",
							data: [
								{id: "1", value: "Active"},
								{id: "0", value: "Inactive"}
							]
						});
					});
				});
			});
		}
	});
}; 
