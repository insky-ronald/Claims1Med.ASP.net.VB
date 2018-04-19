// ****************************************************************************************************
// File name: edit-address.js
// Last modified on
// 
// ****************************************************************************************************
function BanksEdit(params){
	// console.log(params)
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 10),
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: params.showToolbar,
		url: params.url,
		postBack: "banks",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true})
					.setprops("name_id", {label: "name id", numeric: true})
					.setprops("bank_name", {label:"Bank Name", required: true})
					.setprops("sort_code", {label:"Sort Code"})
					.setprops("swift_code", {label:"Swift Code"})
					.setprops("bank_address1", {label:"Address 1"})
					.setprops("bank_address2", {label:"Address 2"})
					.setprops("bank_address3", {label:"Address 3"})
					.setprops("bank_country_code", {label:"Country", 
						getText: function(column, value) {
							return column.dataset.get("bank_country");
						},
						onChange: function(column) {
							column.dataset.set("bank_country", column.lookupDataset.Methods.call("lookupValue"));
						}
					})
					.setprops("beneficiary_name", {label:"Beneficiary Name", required: true})
					.setprops("beneficiary_bank_account", {label:"Bank Account", required: true})
					.setprops("beneficiary_address1", {label:"Address 1"})
					.setprops("beneficiary_address2", {label:"Address 2"})
					.setprops("beneficiary_address3", {label:"Address 3"})
					.setprops("beneficiary_country_code", {label:"Country", 
						getText: function(column, value) {
							return column.dataset.get("beneficiary_country");
						},
						onChange: function(column) {
							column.dataset.set("beneficiary_country", column.lookupDataset.Methods.call("lookupValue"));
						}
					})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Bank Details", function(editor) {
						editor.AddEdit("bank_name");
						editor.AddEdit("sort_code");
						editor.AddEdit("swift_code");
						editor.AddEdit("bank_address1");
						editor.AddEdit("bank_address2");
						editor.AddEdit("bank_address3");
						editor.AddLookup("bank_country_code", {width:400, height:310, disableEdit:true, init:CountriesISOLookup});
					});
					
					editor.AddGroup("Beneficiary Details", function(editor) {
						editor.AddEdit("beneficiary_name");
						editor.AddEdit("beneficiary_bank_account");
						editor.AddEdit("beneficiary_address1");
						editor.AddEdit("beneficiary_address2");
						editor.AddEdit("beneficiary_address3");
						editor.AddLookup("beneficiary_country_code", {width:400, height:310, disableEdit:true, init:CountriesISOLookup});
					});
			});
		}
	});
}; 
