// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-currencies.js
//==================================================================================================
function CurrenciesEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		showToolbar: defaultValue(params.showToolbar, false),
		postBack: "app/currencies",
		url: ("?code={0}").format(params.code),
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("code", {label:"Currency Code", key:true, maxLength:3, upperCase:true, required:true, readonly:sender.mode === "edit"})
					.setprops("currency", {label:"Currency Name", required:true})
					.setprops("is_active", {label:"Status"})
					.setprops("no_roundoff", {label:"No Decimal"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Currency", function(editor) {
						editor.AddEdit({ID:"code"});
						editor.AddEdit({ID:"currency"});
						editor.AddRadioButton("is_active", {
							key: "id",
							value: "value",
							data: [
								{id: "1", value: "Active"},
								{id: "0", value: "Inactive"}
							]
						});
					});
					editor.AddGroup("Whole Number Only", function(editor) {
						editor.AddRadioButton("no_roundoff", {
							key: "id",
							value: "value",
							data: [
								{id: "1", value: "Yes"},
								{id: "0", value: "No"}
							]
						});
					}); 
				});
			});
		}
	});
}; 
