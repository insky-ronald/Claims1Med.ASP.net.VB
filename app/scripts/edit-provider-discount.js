// ****************************************************************************************************
// File name: edit-address.js
// Last modified on
// 
// ****************************************************************************************************
function ProviderDiscountEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 0),
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: defaultValue(params.showToolbar, true),
		postBack: "provider-discount",
		url: "?id=" + params.id,
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("name_id", {label:"ID", numeric:true, key: true})
					.setprops("discount_type_id", {label:"Type", numeric:true, required:true})
					.setprops("discount_amount", {label:"Amount", numeric:true})
					.setprops("discount_percent", {label:"Percentage", numeric:true})
					.setprops("notes", {label:"Notes"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Discount", function(editor) {
						editor.AddEdit("discount_type_id");
						editor.AddEdit("discount_amount");
						editor.AddEdit("discount_percent");
					});					
				});
				
				editor.NewGroupEdit("Notes", function(editor, tab) {
				});
			});
		}
	});
}; 
