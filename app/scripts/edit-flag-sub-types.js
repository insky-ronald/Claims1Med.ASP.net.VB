// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-flag-sub-types.js
//==================================================================================================
function FlagSubTypesEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		// labelWidth: 180,
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: params.showToolbar,
		url: params.url,
		postBack: "app/flag-sub-types",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
			data.Columns
				.setprops("code", {label:"Flag Sub Code", key:true, required:true})
				.setprops("flag_code", {label:"Flag Type", required:true,
					getText: function(column, value) {
						return column.dataset.get("flag_type");
					},
					onChange: function(column) {
						column.dataset.set("flag_type", column.lookupDataset.Methods.call("lookupValue"));
					}	
				})
				.setprops("flag_sub_type", {label:"Flag Sub Type", required:true})
				.setprops("is_active", {label:"Status"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Flag Type", function(editor) {
						editor.AddLookup("flag_code", {width:400, height:300, disableEdit:true, init:FlagTypesLookup});
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
