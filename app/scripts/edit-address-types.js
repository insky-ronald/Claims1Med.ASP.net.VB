// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-address-types.js
//==================================================================================================
function AddressTypesEdit(params){
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
		postBack: "app/address-types",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
			data.Columns
				.setprops("code", {label:"Code", key:true, required:true})
				.setprops("address_type", {label:"Address Type", required:true})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Address Type", function(editor) {
						editor.AddEdit({ID: "code"});
						editor.AddEdit({ID: "address_type"});
					});
				});
			});
		}
	});
}; 
