// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-flag-types.js
//==================================================================================================
function FlagTypesEdit(params){
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
		postBack: "app/flag-types",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
			data.Columns
				.setprops("code", {label:"Code", key:true, maxLength:4, upperCase:true, required:true, readonly:sender.mode === "edit"})
				.setprops("service_description", {label:"Flag Type", required:true})
				.setprops("display_name", {label:"Display Name"})
				.setprops("is_active", {label:"Status"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Flag Type", function(editor) {
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

function EditFlagSubTypes(params) {
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		containerPadding: defaultValue(params.containerPadding, 0),
		showToolbar: defaultValue(params.showToolbar, false),
		url:("?flag_code={0}&code={1}").format(params.flagSubType, params.code),
		postBack: "app/flag-sub-types",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("code", {label:"Sub Code", maxLength:3, upperCase:true, key: true, required:true, readonly:sender.mode === "edit"})
					.setprops("flag_sub_type", {label:"Flag Sub Type", required:true})
					.setprops("is_active", {label:"Status"})
				
				if(params.initEdit) {
					params.initEdit(data);
				};
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Flag Sub Type", function(editor) {
						editor.AddEdit("code");
						editor.AddEdit("flag_sub_type");
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
