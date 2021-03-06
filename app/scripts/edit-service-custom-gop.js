// ****************************************************************************************************
// File name: edit-service-custom-gop.js
// Last modified on
// 
// ****************************************************************************************************
function GopCustomEdit(viewParams) {
	return new JFormEditor({
		id: viewParams.id,
		dataset: viewParams.dataset,
		mode: viewParams.dataset.get("id") ? "edit": "new",
		container: viewParams.container,
		containerPadding: 10,
		pageControlTheme: "main",
		fillContainer: false,
		showToolbar: false,
		labelWidth: 120,
		url: "?id=" + viewParams.dataset.get("id"),
		postBack: "app/service-gop",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
			});
			
			editor.Events.OnPostSuccess2.add(function(editor, returnData) {
				if (returnData.mode == "new" && returnData.result.id) {
					location.href = __service(returnData.result.id, "gop", true);
				}
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit({caption:"Guarantee of Payment", icon:{name:"view-list", color:"forestgreen"}}, 
					function(editor, tab) {
						// editor.group.OnDatasetChanged.add(function(group, columnName) {
							// if(columnName == "discount_type" || columnName === undefined) {
								// var discountType= parseInt(group.dataset.get("discount_type"));
								// editor.SetVisible("discount_percent", discountType == 1);
								// editor.SetVisible("discount_amount", false);
							// };
						// });
						
						editor.AddGroup("Hospital and Physician", function(editor) {
							editor.AddDropDown("provider_id", {width:600, height:350, disableEdit:true, init:ProvidersLookup, 
								lookup: function(grid) {
									grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
										dataParams.set("id", viewParams.dataset.raw("provider_id"));
										dataParams.set("client_id", viewParams.dataset.get("client_id"));
										
										dataParams.Events.OnResetSearch.add(function(dataset) {
											dataset.set("id", viewParams.dataset.raw("provider_id"));
											dataset.set("client_id", viewParams.dataset.get("client_id"));
										});
									});
									
									grid.Events.OnSelectLookup.add(function(grid, key) {
										viewParams.dataset.set("provider_name", grid.dataset.lookup(key, "name"));
									});
								}
							});
							
							editor.AddDropDown("doctor_id", {width:600, height:350, disableEdit:true, init:HospitalDoctorsLookup, 
								lookup: function(grid) {
									grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
										dataParams.set("id", viewParams.dataset.raw("doctor_id"));
										dataParams.set("hospital_id", viewParams.dataset.raw("provider_id"));
										
										dataParams.Events.OnResetSearch.add(function(dataset) {
											dataset.set("id", viewParams.dataset.raw("doctor_id"));
											dataset.set("hospital_id", viewParams.dataset.raw("provider_id"));
										});
									});
									
									grid.Events.OnSelectLookup.add(function(grid, key) {
										viewParams.dataset.set("doctor_name", grid.dataset.lookup(key, "name"));
									});
								}
							});
							
							editor.AddDropDown("provider_contact_person", {width:400, height:300, disableEdit:false, init:GopContactsLookup, 
								lookup: function(grid) {
									grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
										dataParams.set("provider_id", viewParams.dataset.raw("provider_id"));
										dataParams.set("doctor_id", viewParams.dataset.raw("doctor_id"));
										
										// dataParams.Events.OnResetSearch.add(function(dataset) {
											// dataset.set("id", viewParams.dataset.raw("doctor_id"));
											// dataset.set("hospital_id", viewParams.dataset.raw("provider_id"));
										// });
									});
									
									grid.Events.OnSelectLookup.add(function(grid, key) {
										viewParams.dataset.set("provider_contact_person", grid.dataset.lookup(key, "name"));
										viewParams.dataset.set("provider_fax_no", grid.dataset.lookup(key, "fax"));
									});
								}
							});
							
							// editor.AddEdit({ID: "provider_contact_person"});
							editor.AddEdit({ID: "provider_fax_no"});
							editor.AddEdit({ID: "hospital_medical_record"});
						});
						
						if (desktop.inpatient) {
							editor.AddGroup("Admission", function(editor) {
								editor.AddEdit({ID: "start_date"});
								editor.AddEdit({ID: "end_date"});
								editor.AddEdit({ID: "length_of_stay"});
							});
						} else {
							editor.AddGroup("Treatment", function(editor) {
								editor.AddEdit({ID: "start_date", Caption:"Treatment Date"});
								// editor.AddEdit({ID: "end_date"});
								// editor.AddEdit({ID: "length_of_stay"});
							});
						}
						
						editor.AddGroup("Guarantee Amount", function(editor) {
							editor.AddLookup("claim_currency_code", {width:400, height:300, disableEdit:true, init:CurrenciesLookup});
							if (desktop.inpatient) {
								editor.AddEdit({ID: "misc_expense"});
								editor.AddEdit({ID: "room_expense"});
							} else {
								editor.AddEdit({ID: "misc_expense", Caption: "Expenses"});
								// editor.AddEdit({ID: "room_expense"});
							}
						});
					}
				);
			});
		}
	});
};
