// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-doctor-address.js
//==================================================================================================
function DoctorAddressEdit(params){
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
		postBack: "app/doctor-address",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
			data.Columns
				.setprops("code", {label:"Code", key:true, required:true})
				.setprops("iso_code", {label:"ISO Code", required:true})
				.setprops("country", {label:"Country Name", required:true})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("Country", function(editor, tab) {
					editor.AddGroup("Country", function(editor) {
						editor.AddEdit({ID: "code"});
						editor.AddEdit({ID: "iso_code"});
						editor.AddEdit({ID: "country"});
					});
				});
			});
		}
	});
}; 
