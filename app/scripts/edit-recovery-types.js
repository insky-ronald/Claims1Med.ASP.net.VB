// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-recovery-types.js
//==================================================================================================
function RecoveryTypesEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		// labelWidth: 150,
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		showToolbar: defaultValue(params.showToolbar, false),
		url: ("?code={0}").format(params.code),
		postBack: "app/recovery-types",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
			data.Columns
				.setprops("code", {label:"Code", key:true, maxLength:4, upperCase:true, required:true, readonly:sender.mode === "edit"})
				.setprops("service_description", {label:"Recovery Type", required:true})
				.setprops("display_name", {label:"Display Name"})
				.setprops("is_active", {label:"Status"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Recovery Type", function(editor) {
						editor.AddEdit({ID:"code"});
						editor.AddEdit({ID:"service_description"});
						editor.AddEdit({ID:"display_name"});
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
