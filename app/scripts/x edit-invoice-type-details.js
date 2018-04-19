// ****************************************************************************************************
// File name: edit-claim-details.js
// Last modified on
// 
// ****************************************************************************************************
function InvoiceSubTypeEdit(params){
	// console.log(params)
	new JPageControl({
		owner: this,
		container: params.container,
		Painter: {
			theme: "data-entry",
			autoHeight: false
		},
		init: function(pg) {			
			pg.NewTab("General", {
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
					new SimpleEditor({
						id: "edit_claim",
						dataset: params.dataset,
						container: tab.content,
						initData: function(editor, data) {
							data.Columns
								.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
								.setprops("claim_no", {label:"Claim No.", readonly:true})
								.setprops("service_no", {label:"Service No.", readonly:true})
								// .setprops("case_owner", {label:"Claim Owner", required:true})
								// .setprops("status", {label:"Status", readonly:true})
								// .setprops("notification_date", {label:"Date Notified", type:"date", required:true})

								// .setprops("sub_product", {label:"Sub-Product", readonly:true})
								// .setprops("hcm_reference", {label:"Assistance Ref."})
								// .setprops("reference_no1", {label:"Reference 1"})
								// .setprops("reference_no2", {label:"Reference 2"})
								// .setprops("reference_no3", {label:"Reference 3"})
								
								// .setprops("create_user", {label:"User", readonly:true})
								// .setprops("create_date", {label:"Creation Date", type:"date", format:"datetime", readonly:true, 
									// getText: function(column, value) {
										// return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("create_user"));
									// }})
								// .setprops("update_user", {label:"User", readonly:true})
								// .setprops("update_date", {label:"Update Date", type:"date", format:"datetime", readonly:true,
									// getText: function(column, value) {
										// return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("update_user"));
									// }})
								
								// .setprops("status", {label:"Status"})
								// .setprops("expired", {label:"Expired"})
								// .setprops("plan_name", {label:"Type", required:true})
								
								// .setprops("country_of_incident", {label:"Country of Incident", required:true})

								// .setprops("is_prexisting", {label:"Pre-Existing"})
								// .setprops("is_accident", {label:"Accident"})
								// .setprops("first_symptom_date", {label:"First Symptom", type:"date", required:true})
								// .setprops("first_consultation_date", {label:"First Consultation", type:"date", required:true})
						},
						initEditor: function(editor) {
							editor.AddGroup("Invoice Detail", function(editor) {
								editor.AddEdit("service_no");
								// editor.AddEdit("claim_no");
								// editor.AddEdit("claim_type");
								// editor.AddEdit("case_owner");
								// editor.AddEdit("status");
								// editor.AddEdit("notification_date");
							});
								
							// editor.AddGroup("Other Information", function(editor) {
								// editor.AddEdit("hcm_reference");
								// editor.AddEdit("reference_no1");
							// });
								
							// editor.AddGroup("Location", function(editor) {
								// editor.AddEdit("country_of_incident");
							// });
								
							// editor.AddGroup("Medical Condition", function(editor) {
								// editor.AddRadioButton("is_prexisting", {
									// key: "id",
									// value: "value",
									// data: [
										// {id:true, value:"Yes"},
										// {id:false, value:"No"}
									// ]
								// });
								// editor.AddRadioButton("is_accident", {
									// key: "id",
									// value: "value",
									// data: [
										// {id:true, value:"Yes"},
										// {id:false, value:"No"}
									// ]
								// });
							// });
								
							// editor.AddGroup("Medical History Dates", function(editor) {
								// editor.AddEdit("first_symptom_date");
								// editor.AddEdit("first_consultation_date");
							// });
							
							// editor.AddGroup("Update Info", function(editor) {
								// editor.AddEdit("create_date");
								// editor.AddEdit("update_date");
							// });							
						}
					});
				}
			});
			pg.NewTab("Diagnosis", {
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
				}
			});
			pg.NewTab("Medical Procedures", {
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
				}
			});
			pg.NewTab("Add Plan", {
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
				}
			});
		}
	});
};
