// ****************************************************************************************************
// File name: edit-claim-details.js
// Last modified on
// 
// ****************************************************************************************************
function GopSubTypeEdit(params){
	return new JPageControl({
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
								.setprops("service_no", {label:"Service No.", readonly:true})
								.setprops("sub_type_name", {label:"Type", required:true, readonly:true})
								.setprops("gop_type", {label:"Description", required:true})

								.setprops("provider_name")
								.setprops("provider_id", {label:"Hospital", required:true,
									getText: function(column, value) {
										return column.dataset.get("provider_name");
									}})

								.setprops("doctor_name")
								.setprops("doctor_id", {label:"Physician", required:true,
									getText: function(column, value) {
										return column.dataset.get("doctor_name");
									}})
								.setprops("doctor_contact", {label:"Attention To"})
								.setprops("doctor_fax_no", {label:"Fax No."})

								.setprops("start_date", {label:"Admission Date", type:"date", required:true})
								.setprops("end_date", {label:"Discharge Date", type:"date", required:true})
								.setprops("length_of_stay", {label:"Length of Stay", numeric:true, readonly:true})

								.setprops("claim_currency_code", {label:"Currency", required:true})
								.setprops("misc_expense", {label:"Hospital Expenses", numeric:true, type:"money", format:"00"})
								.setprops("room_expense", {label:"Room & Board (per day)", numeric:true, type:"money", format:"00"})
								
								.setprops("waiting_period", {label:"Waiting Period", readonly:true})
						},
						initEditor: function(editor) {
							editor.AddGroup("Guarantee of Payment", function(editor) {
								editor.AddEdit("sub_type_name");
								editor.AddListBox("gop_type", {
									key: "id",
									value: "value",
									data: [
										{id:"ONE DAY CARE", value:"ONE DAY CARE"},
										{id:"PHYSIOTHERAPY", value:"PHYSIOTHERAPY"},
										{id:"RAWAT INAP", value:"RAWAT INAP"},
										{id:"RAWAT JALAN", value:"RAWAT JALAN"}
									]
								});
							});
								
							editor.AddGroup("Hospital and Physician", function(editor) {
								editor.AddEdit("provider_id");
								editor.AddEdit("doctor_id");
								editor.AddEdit("doctor_contact");
								editor.AddEdit("doctor_fax_no");
							});
								
							editor.AddGroup("Admission", function(editor) {
								editor.AddEdit("start_date");
								editor.AddEdit("end_date");
								editor.AddEdit("length_of_stay");
							});
								
							editor.AddGroup("Guarantee Amount", function(editor) {
								editor.AddEdit("claim_currency_code");
								editor.AddEdit("misc_expense");
								editor.AddEdit("room_expense");
							});
								
							editor.AddGroup("Notifications", function(editor) {
								editor.AddEdit("waiting_period");
							});
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
