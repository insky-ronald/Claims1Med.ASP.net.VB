// ****************************************************************************************************
// File name: edit-address.js
// Last modified on
// 
// ****************************************************************************************************
function AddressEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 0),
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		showToolbar: defaultValue(params.showToolbar, false),
		url: params.url,
		postBack: "addresses",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true})
					.setprops("name_id", {label: "name id", numeric:true})
					.setprops("street", {label:"Street", required:true})
					.setprops("city", {label:"City", required:true})
					.setprops("province", {label:"Province"})
					.setprops("zip_code", {label:"Zip Code"})
					.setprops("country", {label:"Country"})
					.setprops("country_code", {label:"Country", 
						getText: function(column, value) {
							return column.dataset.get("country");
						},
						onChange: function(column) {
							column.dataset.set("country", column.lookupDataset.Methods.call("lookupValue"));
						}
					})
					.setprops("address_type_name", {label:"Type"})
					.setprops("address_type", {label:"Type", required:true, 
						getText: function(column, value) {
							return column.dataset.get("address_type_name");
						},
						onChange: function(column) {
							column.dataset.set("address_type_name", column.lookupDataset.Methods.call("lookupValue"));
						}
					})
					.setprops("phone_no1", {label:"Phone No. 1"})
					.setprops("phone_no2", {label:"Phone No. 2"})
					.setprops("fax_no1", {label:"Fax No. 1"})
					.setprops("fax_no2", {label:"Fax No. 2"})
					.setprops("email", {label:"Email"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Address", function(editor) {
						editor.AddLookup("address_type", {width:400, height:250, disableEdit:true, init:AddressTypesLookup});
						editor.AddEdit("street");
						editor.AddEdit("city");
						editor.AddEdit("province");
						editor.AddEdit("zip_code");
						editor.AddLookup("country_code", {width:400, height:300, disableEdit:true, init:CountriesLookup});
					});
					
					editor.AddGroup("Contact Numbers", function(editor) {
						editor.AddEdit("phone_no1");
						editor.AddEdit("phone_no2");
						editor.AddEdit("fax_no1");
						editor.AddEdit("fax_no2");
						editor.AddEdit("email");
					});
					
					// editor.AddGroup("Lookup", function(editor) {
						// editor.AddLookup("plan_currency", {width: 400,height: 300,init: CurrenciesView});
						// editor.AddLookup("underwriting_currency", {width: 400, height: 300,init: CurrenciesView});
						// editor.AddContainer("underwriting_currency", {width: 400, height: 300,init: function(params) {
							
						// }});
					// });
			});
		}
	});
}; 
