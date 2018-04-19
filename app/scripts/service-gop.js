//****************************************************************************************************
// File name: service-gop.js
// Last modified on
// 
//****************************************************************************************************
function GopView(params) {
	return new ServiceGop(params);
};

//**************************************************************************************************
// ServiceGop
//**************************************************************************************************
Class.Inherits(ServiceGop, ClaimService);
function ServiceGop(params) {
	ServiceGop.prototype.parent.call(this, params);
};

ServiceGop.prototype.classID = "ServiceGop";
ServiceGop.prototype.type = "gop";
ServiceGop.prototype.name = "GOP";
ServiceGop.prototype.fullName = "Guarantee of Payment";

ServiceGop.prototype.initStatusToolbar = function(toolbar) {
	this.updateStatusLookup({
		toolbar:toolbar,
		id: "pending",
		icon: "service-status",
		color: "#27AE60",
		// color: "#315B8F",
		// color: "#0754D0",
		hint: "Update Pending Status",
	});
	
	this.updateStatusLookup({
		toolbar:toolbar,
		id: "cancel",
		icon: "alert-circle-outline",
		color: "firebrick",
		hint: "Cancel/Decline Guarantee",
	});
	
	this.updateStatusLookup({
		toolbar:toolbar,
		id: "await",
		icon: "check-circle-outline",
		color: "#3388BB",
		hint: "Invoice Awaited",
	});
};

ServiceGop.prototype.initialize = function(params) {
	ServiceGop.prototype.parent.prototype.initialize.call(this, params);
	// console.log(params)
	this.Events.OnInitToolbar.add(function(view, toolbar) {
		// toolbar.NewItem({
			// id: "cancelx",
			// icon: "db-cancel",
			// iconColor: "#8DCF6E",
			// hint: "Cancel edit",
			// dataBind: view.dataset,
			// dataEvent: function(dataset, button) {
				// button.show(dataset.editing);
			// },
			// click: function(item) {
				// item.dataBind.cancel();
			// }
		// });
	});
	
	//**************************************************************************************************
	// Main Data
	//**************************************************************************************************
	this.Events.OnInitMainData.add(function(self, editor) {
		var data = editor.Dataset;
		
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
	});
	
	this.Events.OnInitMainEdit.add(function(self, editor) {
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
	});
	
	//**************************************************************************************************
	// Sub Data
	//**************************************************************************************************
	this.Events.OnInitSubData.add(function(self, editor) {
		// var data = editor.Dataset;
		editor.Dataset.Columns
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

			.setprops("claim_currency_code", {label:"Currency", required:true, upperCase:true, maxLength:3})
			// .setprops("claim_currency_code", {label:"Currency", required:true, upperCase:true, maxLength:3,
			// .setprops("claim_currency_code", {label:"Currency", required:true, // maxLength:3,
				// getText: function(column, value) {
					// console.log(column)
					// return column.dataset.get("provider_name");
					// if(value) {
						// return ("{0} ({1})").format(value, desktop.dbCurrencies.lookup(value, "currency"))
					// } else
						// return "";
				// }})
			.setprops("misc_expense", {label:"Hospital Expenses", numeric:true, type:"money", format:"00"})
			.setprops("room_expense", {label:"Room & Board (per day)", numeric:true, type:"money", format:"00"})
			
			.setprops("waiting_period", {label:"Waiting Period", readonly:true})
	});
	
	this.Events.OnInitSubEdit.add(function(self, editor) {
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
			// editor.AddEdit("claim_currency_code");
			editor.AddLookup("claim_currency_code", {width:400, height:300, disableEdit:false, init:CurrenciesLookup});
			editor.AddEdit("misc_expense");
			editor.AddEdit("room_expense");
		});
			
		editor.AddGroup("Notifications", function(editor) {
			editor.AddEdit("waiting_period");
		});
	});
	
	this.Events.OnInitSubTabs.add(function(self, pg) {
		// pg.NewTab("Diagnosis", {
			// OnCreate: function(tab) {
			// }
		// });
		
		// pg.NewTab("Medical Procedures", {
			// OnCreate: function(tab) {
			// }
		// });
		
		// pg.NewTab("Add Plan", {
			// OnCreate: function(tab) {
			// }
		// });
	});
};

