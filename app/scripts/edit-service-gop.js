// ****************************************************************************************************
// File name: edit-service-gop.js
// Last modified on
// 
// ****************************************************************************************************
function ServiceEdit(viewParams) {
	return new JFormEditor({
		id: viewParams.id,
		dataset: viewParams.dataset,
		mode: viewParams.dataset.get("id") ? "edit": "new",
		container: viewParams.container,
		containerPadding: 10,
		pageControlTheme: "main",
		fillContainer: false,
		showToolbar: false,
		labelWidth: 140,
		url: "?id=" + viewParams.dataset.get("id"),
		postBack: "app/claim",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit({caption:"General", icon:{name:"view-list", color:"forestgreen"}}, 
					function(editor, tab) {
						editor.group.OnDatasetChanged.add(function(group, columnName) {
							if(columnName == "discount_type" || columnName === undefined) {
								var discountType= parseInt(group.dataset.get("discount_type"));
								editor.SetVisible("discount_percent", discountType == 1);
								editor.SetVisible("discount_amount", false);
								// editor.SetRequired("first_symptom_date", !isAccident);
							};
						});
						
						editor.AddGroup("Reference Numbers and Date", function(editor) {
							editor.AddEdit({ID: "id"});
							editor.AddEdit({ID: "service_no"});
							editor.AddEdit({ID: "service_date"});
							editor.AddEdit({ID: "admission_first_call"});
						});
						editor.AddGroup("Insured", function(editor) {
							editor.AddEdit({ID: "patient_name"});
							editor.AddEdit({ID: "policy_no"});
							editor.AddEdit({ID: "client_name"});
						});
						editor.AddGroup("Exchange Rates", function(editor) {
							editor.AddEdit({ID: "claim_currency_code"});
							editor.AddEdit({ID: "claim_currency_rate_date"});
							editor.AddEdit({ID: "claim_currency_to_base"});
							editor.AddEdit({ID: "claim_currency_to_client"});
							editor.AddEdit({ID: "claim_currency_to_eligibility"});
						});
						
						editor.AddGroup("Discount", function(editor) {
							editor.AddRadioButton("discount_type", {
								key: "id",
								value: "value",
								data: [
									{id:0, value:"None"},
									{id:1, value:"Invoice header by %"},
									{id:3, value:"Invoice line by %"},
									{id:4, value:"Invoice line by amount"}
								]
							});
							
							editor.AddEdit({ID: "discount_percent"});//, {visible: desktop.dbService.get("discount_type") == 1});
							editor.AddEdit({ID: "discount_amount"});//, {visible: false});
						});
						
						if(desktop.customData.service_id) {
							editor.AddGroup("Update Log", function(editor) {
								editor.AddEdit({ID: "create_date"});
								editor.AddEdit({ID: "update_date"});								
							});
						};
					}
				);
			});
		}
	});
};

function CalculationDatesEdit(viewParams) {
	return new JFormEditor({
		id: viewParams.id,
		dataset: viewParams.dataset,
		mode: viewParams.dataset.get("id") ? "edit": "new",
		container: viewParams.container,
		containerPadding: 10,
		pageControlTheme: "main",
		fillContainer: false,
		showToolbar: true,
		scrollable:true,
		labelWidth: 190,
		url: "?id=" + viewParams.dataset.get("id"),
		postBack: "app/claim",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
					.setprops("admission_first_call", {label:"Admission First Call", type:"date", format:"datetime"})
					.setprops("admission_document_received", {label:"Document Received", type:"date", format:"datetime"})
					.setprops("admission_sending_document", {label:"Sending Document", type:"date", format:"datetime"})
					.setprops("admission_document_received2", {label:"Document Received-2", type:"date", format:"datetime"})
					.setprops("admission_document_received3", {label:"Document Received-2 (optional)", type:"date", format:"datetime"})
					.setprops("admission_initial_gop", {label:"Initial GOP/Rejection", type:"date", format:"datetime"})
					.setprops("admission_tat_first_call", {label:"TAT First Call", readonly:true})
					.setprops("admission_tat_complete_document", {label:"TAT Complete Document", readonly:true})
					.setprops("discharge_first_call", {label:"First Call", type:"date", format:"datetime"})
					.setprops("discharge_document_received", {label:"Document Received", type:"date", format:"datetime"})
					.setprops("discharge_sending_document", {label:"Sending Document", type:"date", format:"datetime"})
					.setprops("discharge_document_received2", {label:"Document Received-2", type:"date", format:"datetime"})
					.setprops("discharge_document_received3", {label:"Document Received-3 (optional)", type:"date", format:"datetime"})
					.setprops("discharge_final_gop", {label:"Final GOP", type:"date", format:"datetime"})
					.setprops("discharge_tat_first_call", {label:"TAT First Call", readonly:true})
					.setprops("discharge_tat_complete_document", {label:"TAT Complete Document", readonly:true})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit({caption:"Admission", icon:{name:"view-list", color:"forestgreen"}, noFucus:true}, 
					function(editor, tab) {
						editor.AddGroup("Admission Calculation", function(editor) {
							editor.AddEdit("admission_first_call");
							editor.AddEdit("admission_document_received");
							editor.AddEdit("admission_sending_document");
							editor.AddEdit("admission_document_received2");
							editor.AddEdit("admission_document_received3");
							editor.AddEdit("admission_initial_gop");
							editor.AddEdit("admission_tat_first_call");
							editor.AddEdit("admission_tat_complete_document");
						});
						
						editor.AddGroup("Discharge Calculation", function(editor) {
							editor.AddEdit("discharge_first_call");
							editor.AddEdit("discharge_document_received");
							editor.AddEdit("discharge_sending_document");
							editor.AddEdit("discharge_document_received2");
							editor.AddEdit("discharge_document_received3");
							editor.AddEdit("discharge_final_gop");
							editor.AddEdit("discharge_tat_first_call");
							editor.AddEdit("discharge_tat_complete_document");
						});
					}
				);
				// editor.NewGroupEdit({caption:"Discharge", icon:{name:"view-list", color:"forestgreen"}}, 
					// function(editor, tab) {
						// editor.AddGroup("Admission Calculation", function(editor) {
							// editor.AddEdit("admission_first_call");
							// editor.AddEdit("admission_document_received");
							// editor.AddEdit("admission_sending_document");
							// editor.AddEdit("admission_document_received2");
							// editor.AddEdit("admission_document_received3");
							// editor.AddEdit("admission_initial_gop");
							// editor.AddEdit("admission_tat_first_call");
							// editor.AddEdit("admission_tat_complete_document");
						// });
						
						// editor.AddGroup("Discharge Calculation", function(editor) {
							// editor.AddEdit("discharge_first_call");
							// editor.AddEdit("discharge_document_received");
							// editor.AddEdit("discharge_sending_document");
							// editor.AddEdit("discharge_document_received2");
							// editor.AddEdit("discharge_document_received3");
							// editor.AddEdit("discharge_final_gop");
							// editor.AddEdit("discharge_tat_first_call");
							// editor.AddEdit("discharge_tat_complete_document");
						// });
					// }
				// );
			});
		}
	});
};

function EstimatesEdit(viewParams) {
	return new JFormEditor({
		id: viewParams.id,
		dataset: viewParams.dataset,
		mode: viewParams.dataset.get("id") ? "edit": "new",
		container: viewParams.container,
		containerPadding: 10,
		pageControlTheme: "main",
		fillContainer: false,
		showToolbar: true,
		scrollable:true,
		// labelWidth: 100,
		url: "?id=" + viewParams.dataset.get("id"),
		postBack: "app/claim",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
					.setprops("average_cost", {label:"Average Cost", numeric:true, type:"money", format:"00"})
					.setprops("average_los", {label:"Average LOS", numeric:true, type:"money", format:"00"})
					.setprops("estimated_cost", {label:"Estimated Cost", numeric:true, type:"money", format:"00"})
					.setprops("estimated_los", {label:"Estimated LOS", numeric:true, type:"money", format:"00"})
					.setprops("estimated_provider_cost", {label:"Estimated Cost", numeric:true, type:"money", format:"00"})
					.setprops("estimated_provider_los", {label:"Estimated LOS", numeric:true, type:"money", format:"00"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit({caption:"Admission", icon:{name:"view-list", color:"forestgreen"}, noFucus:true}, 
					function(editor, tab) {
						editor.AddGroup("Average Cost and LOS", function(editor) {
							editor.AddEdit("average_cost");
							editor.AddEdit("average_los");
						});
						editor.AddGroup("Estimated Cost and LOS", function(editor) {
							editor.AddEdit("estimated_cost");
							editor.AddEdit("estimated_cost");
						});
						editor.AddGroup("Estimated Cost and LOS from Hospital (optional)", function(editor) {
							editor.AddEdit("estimated_provider_cost");
							editor.AddEdit("estimated_provider_los");
						});
					}
				);
			});
		}
	});
};
