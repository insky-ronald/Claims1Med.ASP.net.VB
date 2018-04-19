// ****************************************************************************************************
// File name: edit-claim-details.js
// Last modified on
// 
// ****************************************************************************************************
function GopDetailsEdit(params){	
	new JPageControl({
		owner: this,
		container: params.container,
		Painter: {
			theme: "data-entry",
			autoHeight: false
		},
		init: function(pg) {			
			pg.NewTab("Guarantee of Payment", {
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
					new SimpleEditor({
						id: "edit_claim",
						dataset: params.dataset,
						container: tab.content,
						initData: function(editor, data) {
							var refreshControls = function(dataset) {
								dataset.editor.SetVisible("discount_percent", dataset.raw("discount_type") == "1");
							};
							
							data.Events.OnChanged.add(refreshControls);
							data.Events.OnCancel.add(refreshControls);
							
							data.Columns
								.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
								.setprops("claim_no", {label:"Claim No.", readonly:true})
								.setprops("service_no", {label:"Service No.", readonly:true})
								.setprops("service_date", {label:"Date", type:"date", required:false, readonly:false})
								
								.setprops("patient_name", {label:"Insured's Name", readonly:true})
								.setprops("policy_no", {label:"Policy No.", readonly:true})
								.setprops("client_name", {label:"Client's Name Type", readonly:true})
								.setprops("admission_first_call", {label:"First Call", type:"date", format:"datetime"})
								.setprops("admission_document_received", {label:"Document Received", type:"date", format:"datetime"})
								.setprops("admission_sending_document", {label:"Sending Document", type:"date", format:"datetime"})
								.setprops("admission_document_received2", {label:"Document Received-2", type:"date", format:"datetime"})
								.setprops("admission_document_received3", {label:"Document Received-3 (opt)", type:"date", format:"datetime"})
								.setprops("admission_initial_gop", {label:"Initial GOP / Rejection", type:"date", format:"datetime"})
								.setprops("admission_tat_first_call", {label:"TAT First Call", readonly:true})
								.setprops("admission_tat_complete_document", {label:"TAT Complete Document", readonly:true})
								// .setprops("invoice_entry_date", {label:"Entry Date", type:"date", readonly:true, 
									// getText: function(column, value) {
										// return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("invoice_entry_user"));
									// }})
								
								.setprops("create_user", {label:"User", readonly:true})
								.setprops("create_date", {label:"Date Created", type:"date", format:"datetime", readonly:true, 
									getText: function(column, value) {
										// return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("create_user"));
										// return ("{0} by {1}").format(column.formatDateTime("d MMMM yyyy"), column.dataset.get("create_user"));
										// return ("{0} by {1}").format(column.formatDateTime("MMMM d, yyyy hh:mm:ss tt"), column.dataset.get("create_user"));
										// return ("{0} by {1}").format(column.formatDateTime2("MMMM d, yyyy hh:mm:ss tt"), column.dataset.get("create_user"));
										return ("{0} by {1}").format(column.formatDateTime2("dd/MM/yyyy hh:mm:ss tt"), column.dataset.get("create_user"));
										// return ("{0} by {1}").format(column.formatDateTime2("dd MMM yyyy hh:mm:ss tt"), column.dataset.get("create_user"));
									}})
								.setprops("update_user", {label:"User", readonly:true})
								.setprops("update_date", {label:"Last Modified", type:"date", format:"datetime", readonly:true,
									getText: function(column, value) {
										return ("{0} by {1}").format(column.formatDateTime2("dd/MM/yyyy hh:mm:ss tt"), column.dataset.get("create_user"));
										// return column.formatDateTime2("dd MMM yyyy").toUpperCase();
									}})
								
								.setprops("claim_currency_code", {label:"Currency", required:true})
								.setprops("claim_currency_rate_date", {label:"Rate Date", type:"date", required:true})
								.setprops("claim_currency_to_base", {label:"Rate to Base Currency", numeric:true, required:true, readonly:true})
								.setprops("claim_currency_to_client", {label:"Rate to Client Currency", numeric:true, required:true, readonly:true})
								.setprops("claim_currency_to_eligibility", {label:"Rate to Eliigibility Currency", numeric:true, required:true, readonly:true})
								
								.setprops("discount_type", {label:"Type",
									onChange: function(column) {
										// column.dataset.editor.SetVisible("discount_percent", column.raw() == "1");
										// console.log({dataset:column.dataset})
									}})
								.setprops("discount_percent", {label:"Discount Rate (%)", numeric:true, type:"money", format:"00"})
						},
						initEditor: function(editor) {
							editor.Dataset.editor = editor;
							// console.log(editor)
							editor.AddGroup("General", function(editor) {
								editor.AddEdit("service_no");
								editor.AddEdit("service_date");
							});
							
							editor.AddGroup("Insured", function(editor) {
								editor.AddEdit("patient_name");
								editor.AddEdit("policy_no");
								editor.AddEdit("client_name");
							});
								
							editor.AddGroup("Admission Calculation", function(editor) {
								editor.AddEdit("admission_first_call");
								editor.AddEdit("admission_document_received");
								editor.AddEdit("admission_sending_document");
								editor.AddEdit("admission_document_received2");
								editor.AddEdit("admission_document_received3");
								editor.AddEdit("admission_initial_gop");
								editor.AddEdit("admission_tat_first_call");
								editor.AddEdit("admission_tat_complete_document");
								// editor.AddEdit("");
							});
								
							editor.AddGroup("Discharge Calculation", function(editor) {
							});
							
							editor.AddGroup("Discount", function(editor) {
								editor.AddListBox("discount_type", {
									key: "id",
									value: "value",
									data: [
										{id:"0", value:"No Discount"},
										{id:"1", value:"Invoice Header by Percentage"},
										{id:"3", value:"Invoice Line by Percentage"},
										{id:"4", value:"Invoice Line by Amount"}
									]
								});
								editor.AddEdit("discount_percent");
							});
							
							editor.AddGroup("Exchange Rates", function(editor) {
								editor.AddEdit("claim_currency_rate_date");
								editor.AddEdit("claim_currency_to_base");
								editor.AddEdit("claim_currency_to_client");
								editor.AddEdit("claim_currency_to_eligibility");
							});
							
							editor.AddGroup("Audit Fields", function(editor) {
								editor.AddEdit("create_date");
								editor.AddEdit("update_date");
							});			
						}
					});
				}
			});

			pg.NewTab("Status", {
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
				}
			});

			pg.NewTab("Actions", {
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
				}
			});
		}
	});
};
