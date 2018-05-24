// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: service-init-gop.js
//==================================================================================================
function InitializeGop(dbService) {
	dbService.Columns
		.setprops("service_date", {label:"Date", type:"date", required:true})
		.setprops("provider_id", {label:"Hospital's Name", required:true,
			getText: function(column, value) {
				return column.dataset.get("provider_name")
			}
		})
		.setprops("doctor_id", {label:"Physician's Name", required:false,
			getText: function(column, value) {
				return column.dataset.get("doctor_name")
			}
		})
		.setprops("hospital_medical_record", {label:"Medical Record #"})
		.setprops("provider_contact_person", {label:"Attention To"})
		.setprops("provider_fax_no", {label:"Fax No."})
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
		.setprops("misc_expense", {label:"Hospital Expenses", numeric:true, type:"money", format:"00"})
		.setprops("room_expense", {label:"Room & Board (per day)", numeric:true, type:"money", format:"00"})
		.setprops("length_of_stay", {label:"Length of Stay", numeric:true, readonly:true})
		.setprops("link_service_no", {label:"Received Invoice", readonly:true});

	desktop.dbEstimates = new Dataset(desktop.customData.estimates);
	desktop.dbCalculationDates = new Dataset(desktop.customData.calculation_dates);
};
