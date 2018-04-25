// ****************************************************************************************************
// Last modified on
//
// ****************************************************************************************************
//==================================================================================================
// File name: edit-doctor.js
//==================================================================================================
function DoctorEdit(params){
	new JPageControl({
		owner: this,
		container: params.container,
		Painter: {
			theme: "data-entry",
			autoHeight: false
		},
		init: function(pg) {
			pg.NewTab("Doctor Details", {
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");

					new SimpleEditor({
						id: "edit_doctor",
						dataset: params.dataset,
						container: tab.content,
						initData: function(editor, data) {
							data.Columns
								.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
								// .setprops("name_type", {label:"Name Type"})
								.setprops("code", {label:"Code", required:false})
								.setprops("status_code", {label:"Status"})
								.setprops("name", {label:"Doctor Name", required:true})
								.setprops("specialisation_code", {label:"Specialisation", required:true, upperCase:false, lookupDataset: desktop.dbDoctorSpecialisation,
									getText: function(column, value) {
										return column.lookupDataset.lookup(value, "specialisation");
									}
								})
								.setprops("country_code", {label:"Country", required:false, upperCase:false, lookupDataset: desktop.dbCountries,
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

							editor.AddGroup("Doctors Personal Data", function(editor) {
								editor.AddEdit("name");
								editor.AddLookup("specialisation_code", {width:400, height:310, disableEdit:true, init:DoctorSpecialisationLookup});
								editor.AddLookup("country_code", {width:400, height:310, disableEdit:true, init:CountriesLookup});
							});

							editor.AddGroup("Discount Type", function(editor) {
								editor.AddListBox("discount_type_id", {
									key: "id",
									value: "value",
									data: [
										{id:"1", value:"No Discount"},
										{id:"2", value:"Invoice Header by Percentage"},
										{id:"3", value:"Invoice Line by Percentage"},
										{id:"4", value:"Invoice Line by Amount"}
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

function DoctorEdit2(params){
	return new FormEditor({
		// id: params.id,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 0),
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		showToolbar: defaultValue(params.showToolbar, false),
		postBack: "app/doctors",
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
					.setprops("specialisation_code", {label:"Specialisation", required:true,
						getText: function(column, value) {
							return column.dataset.get("specialisation");
						},
						onChange: function(column) {
							column.dataset.set("specialisation", column.lookupDataset.Methods.call("lookupValue"));
						}
					})
					.setprops("country_code", {label:"Country", 
						getText: function(column, value) {
							return column.dataset.get("country");
						},
						onChange: function(column) {
							column.dataset.set("country", column.lookupDataset.Methods.call("lookupValue"));
						}
					})
					.setprops("discount_type_id", {label:"Type"})
					.setprops("discount_amount", {label:"Amount", numeric:true})
					.setprops("discount_percent", {label:"Percantage", numeric:true})
					.setprops("notes", {label:"Notes"})

			});

			editor.Events.OnInitEditor.add(function(sender, editor) {

				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Doctor Details", function(editor) {
						editor.AddEdit("name");
						editor.AddEdit("full_name");
						editor.AddLookup("specialisation_code", {width:400, height:310, disableEdit:true, init:DoctorSpecialisationLookup});
						editor.AddLookup("country_code", {width:400, height:310, disableEdit:true, init:CountriesLookup});
					});

					editor.AddGroup("Reference Numbers", function(editor) {
						editor.AddEdit("id");
						editor.AddEdit("code");
						editor.AddEdit("spin_id");
					});

					editor.AddGroup("Status", function(editor) {
						editor.AddRadioButton("status_code", {key: "id", value: "value", data: [{id: "A", value: "Yes"}, {id: "X", value: "No"}]});
						editor.AddRadioButton("blacklisted", {key: "id", value: "value", data: [{id: 1, value: "Yes"}, {id: 0, value: "No"}]});
					});
				});

				editor.NewGroupEdit("Discount", function(editor, tab) {
					editor.AddGroup("Discount", function(editor) {
							editor.AddListBox("discount_type_id", {
								key: "id",
								value: "value",
								data: [
									{id:"0", value:"No Discount"},
									{id:"1", value:"Invoice Header by Percentage"},
									{id:"3", value:"Invoice Line by Percentage"},
									{id:"4", value:"Invoice Line by Amount"}
								]
							});
							editor.AddEdit("discount_amount");
							editor.AddEdit("discount_percent");
							editor.AddMemo("notes");
					});
				});
			});
		}
	});
};
