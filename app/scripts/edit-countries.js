// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-countries.js
//==================================================================================================
function CountriesEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		labelWidth: 125,
		containerPadding: defaultValue(params.containerPadding, 0),
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		showToolbar: defaultValue(params.showToolbar, false),
		postBack: "app/countries",
		url: ("?code={0}").format(params.code),
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				console.log({sender:sender, data:data})
				data.Columns
					.setprops("code", {label:"ISO Code - 3 Digits", key:true, maxLength:3, upperCase:true, required:true, readonly:sender.mode === "edit"})
					.setprops("iso_code", {label:"ISO Code - 2 Digits", maxLength:2, upperCase:true, required:true, readonly:sender.mode === "edit"})
					.setprops("country", {label:"Country Name", required:true})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
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
