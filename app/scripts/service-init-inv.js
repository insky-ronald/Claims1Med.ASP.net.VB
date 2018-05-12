// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: service-init-inv.js
//==================================================================================================
function InitializeInvoice(dbService) {
	dbService.Columns
		.setprops("provider_id", {label:"Hospital's Name", required:true, //lookupDataset: desktop.dbCountries,
			getText: function(column, value) {
				return column.dataset.get("provider_name")
			}
		})
		.setprops("doctor_id", {label:"Physician's Name", required:false, //lookupDataset: desktop.dbCountries,
			getText: function(column, value) {
				return column.dataset.get("doctor_name")
			}
		})
		// .setprops("hospital_medical_record", {label:"Medical Record #"})
		// .setprops("provider_contact_person", {label:"Attention To"})
		// .setprops("provider_fax_no", {label:"Fax No."})
		.setprops("start_date", {label:"Admission Date", type:"date", required:true,
			onChange: function(column) {
				column.dataset.set("claim_currency_rate_date", column.raw())
			}
		})
		.setprops("end_date", {label:"Discharge Date", type:"date",
			onChange: function(column) {
				var start = column.dataset.asDate("start_date");
				var end = column.dataset.asDate("end_date");
				
				if (end) {
					var diff = Math.floor(Math.abs((start.getTime() - end.getTime())/(24*60*60*1000)));
				
					column.dataset.set("length_of_stay", diff+1);
				} else {
					column.dataset.set("length_of_stay", 0);
				}
			}
		})
		.setprops("payment_mode", {label:"Payment Type", required:true})
		.setprops("invoice_no", {label:"Invoice No.", required:true,
			onChange: function(column) {
				var value = column.raw().trim();
				if (value == "") {
					column.dataset.set("invoice_date", null);
					column.dataset.set("invoice_received_date", null);
					column.dataset.set("invoice_entry_date", null);
					column.dataset.set("invoice_entry_user", "");
					column.dataset.set("invoice_entry_user_name", "");
				} else {
					
					// console.log(Object.prototype.toString.call(valueDate.now()))
					column.dataset.set("invoice_date", null);
					column.dataset.set("invoice_received_date", null);
					// column.dataset.setDateTime("invoice_entry_date", Date.now());
					column.dataset.setDateTime("invoice_entry_date", new Date());
					column.dataset.set("invoice_entry_user", desktop.userName);
					column.dataset.set("invoice_entry_user_name", desktop.userFullName);
				}
				// column.dataset.set("claim_currency_rate_date", column.raw())
			}
		})
		.setprops("invoice_date", {label:"Invoice Date", type:"date", required:desktop.dbService.raw("invoice_no") !== "none"})
		.setprops("invoice_received_date", {label:"Invoice Received Date", type:"date", required:true})
		.setprops("invoice_entry_date", {label:"Input Date", type:"date", format:"datetime", readonly:true})
		.setprops("invoice_entry_user", {label:"By", readonly:true})
		.setprops("invoice_entry_user_name", {label:"By", readonly:true})
		.setprops("room_type", {label:"Room Type"})
		.setprops("medical_type", {label:"Medical Type"})
		.setprops("accident_date", {label:"Accident Date", type:"date", readonly:true})
		.setprops("treatment_country_code", {label:"Country of Treatment", lookupDataset: desktop.dbCountries,
			getText: function(column, value) {
				return ("{0} ({1})").format(column.lookupDataset.lookup(value, "country"), value);
			// },
			// onChange: function(column) {
				// column.dataset.Events.OnGetExchangeRates.trigger();
			}
		})
		.setprops("link_service_no", {label:"Source GOP", readonly:true});
		// .setprops("misc_expense", {label:"Hospital Expenses", numeric:true, type:"money", format:"00"})
		// .setprops("room_expense", {label:"Room & Board (per day)", numeric:true, type:"money", format:"00"})
		// .setprops("length_of_stay", {label:"Length of Stay", numeric:true, readonly:true});
};
