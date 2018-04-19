// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-clinic.js
//==================================================================================================
function ClinicEdit(params){
	new JPageControl({
		owner: this,
		container: params.container,
		Painter: {
			theme: "data-entry",
			autoHeight: false
		},
		init: function(pg) {
			pg.NewTab("Clinic Details", {
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
					
					new SimpleEditor({
						id: "edit_clinic",
						dataset: params.dataset,
						container: tab.content,
						initData: function(editor, data) {
							data.Columns
								.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
								.setprops("code", {label:"Code", required:false})
								.setprops("status_code", {label:"Status"})
								.setprops("name", {label:"Clinic Name", required:true})
								.setprops("home_country_code", {label:"Country", required:false, upperCase:false, lookupDataset: desktop.dbCountries,
									getText: function(column, value) {
										return column.lookupDataset.lookup(value, "country");
									}
								})
								
								.setprops("discount_type_id", {label:"Discount Type"})
								.setprops("discount_amount", {label:"Discount Amount", numeric:true})
								.setprops("discount_percent", {label:"Discount Rate %", numeric:true})
								.setprops("notes", {label:"Notes"})
						},
						initEditor: function(editor) {
							editor.AddGroup("General", function(editor) {
								editor.AddEdit("code");
								editor.AddRadioButton("status_code", {key: "id", value: "value", data: [{id: "A", value: "Active"}, {id: "X", value: "Inactive"}]})
							});
							
							editor.AddGroup("Clinics Data", function(editor) {
								editor.AddEdit("name");
								editor.AddLookup("home_country_code", {width:400, height:310, disableEdit:true, init:CountriesLookup});
							});
							
							editor.AddGroup("Discount Type", function(editor) {
								editor.AddListBox("discount_type_id", {
									key: "id",
									value: "value",
									data: [
										{id:"1", value:"No Discount"},
										{id:"2", value:"Invoice Header by Percentage"},
										{id:"3", value:"Invoice Line by Percentage"},
										{id:"4", value:"Invoice Line by Amount"},
									]
								});
							});
							
							editor.AddGroup("Discount Amount", function(editor) {
								editor.AddEdit("discount_amount");
							});
							
							editor.AddGroup("Percent Discount", function(editor) {
								editor.AddEdit("discount_percent");
							});
							
							editor.AddGroup("Provider Discount Information", function(editor) {
								editor.AddMemo("notes");
							});
						}
					});
				}
			}); 
			
			/* pg.NewTab("Discount", { 
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A");
					DiscountsView({
						container: tab.content
					});
				}
			});  */
		}
	});
};