// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-doctor.js
//==================================================================================================
function HospitalEdit(params){
	return new FormEditor({
		// id: params.id,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 0),
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		showToolbar: defaultValue(params.showToolbar, false),
		postBack: "app/hospitals",
		url: ("?id={0}").format(params.id),
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
					.setprops("code", {label:"SunCode", required:false})
					.setprops("spin_id", {label:"SPIN ID", required:false})
					.setprops("status_code", {label:"Active"})
					.setprops("blacklisted", {label:"Blacklisted"})
					.setprops("name", {label:"Name", required:true})
					.setprops("full_name", {label:"Full Name"})
					.setprops("specialisation_code", {label:"Specialisation", required:true, lookupDataset: desktop.dbDoctorSpecialisation,
						getText: function(column, value) {
							return column.lookupDataset.lookup(value, "specialisation");
						}
					})
					.setprops("home_country_code", {label:"Country", lookupDataset: desktop.dbCountries,
						getText: function(column, value) {
							return column.lookupDataset.lookup(value, "country");
						}
					})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {

				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Hospital Details", function(editor) {
						editor.AddEdit("name");
						// editor.AddEdit("full_name");
						// editor.AddLookup("specialisation_code", {width:400, height:310, disableEdit:true, init:DoctorSpecialisationLookup});
						editor.AddLookup("home_country_code", {width:400, height:310, disableEdit:true, init:CountriesLookup});
					});
						
					editor.AddGroup("Reference Numbers", function(editor) {
						editor.AddEdit("id");
						editor.AddEdit("code");
						editor.AddEdit("spin_id");
					});
					
					editor.AddGroup("Status", function(editor) {
						editor.AddRadioButton("status_code", {key: "id", value: "value", data: [{id: "A", value: "Yes"}, {id: "X", value: "No"}]})
						editor.AddRadioButton("blacklisted", {key: "id", value: "value", data: [{id: 1, value: "Yes"}, {id: 0, value: "No"}]})
					});
					
					// editor.AddGroup("Doctors Personal Data", function(editor) {
					// });
				});								
			});
		}
	});
}; 
