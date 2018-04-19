// MainPage.prototype.navigatorTheme = "dark";

// MainPage.prototype.DefaultPainter = function() {
	// return new DesktopPainter5(this);
// };

MainPage.prototype.AfterPaint = function() {
	MainPage.prototype.parent.prototype.AfterPaint.call(this);

	desktop.dbCountries = desktop.LoadCacheData(desktop.customData.countries, "countries", "code");
	// desktop.dbCurrencies = desktop.LoadCacheData(desktop.customData.currencies, "currencies", "code");
	
	desktop.dbService = new Dataset(desktop.customData.data)
	desktop.dbService.Columns
		.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
		.setprops("service_no", {label:"Reference No.", readonly:true})
		.setprops("service_date", {label:"Date", type:"date", required:true})
		.setprops("admission_first_call", {label:"Admission First Call", type:"date", format:"datetime", required:true})
		.setprops("patient_name", {label:"Insured's Name", readonly:true})
		.setprops("policy_no", {label:"Policy No.", readonly:true})
		.setprops("client_name", {label:"Client's Name", readonly:true})
		.setprops("claim_currency_code", {label:"Currency"})
		.setprops("claim_currency_rate_date", {label:"Date", type:"date", required:true})
		.setprops("claim_currency_to_base", {label:("To Base Currrency (<b>{0}</b>)").format(desktop.dbService.get("client_currency_code")), numeric:true, readonly:true})
		.setprops("claim_currency_to_client", {label:("To Client Currrency (<b>{0}</b>)").format(desktop.dbService.get("base_currency_code")), numeric:true, readonly:true})
		.setprops("claim_currency_to_eligibility", {label:("To Eligibility Currrency (<b>{0}</b>)").format(desktop.dbService.get("eligibility_currency_code")), numeric:true, readonly:true})
		.setprops("discount_type", {label:"Discount Type", numeric:true, type:"money", format:"00"})
		.setprops("discount_percent", {label:"Percent %", numeric:true, type:"money", format:"00"})
		.setprops("discount_amount", {label:"Amount", numeric:true})
		
	if(desktop.customData.service_id) {
		desktop.dbService.Columns
			.setprops("create_user", {label:"User", readonly:true})
			.setprops("create_date", {label:"Created on", type:"date", format:"datetime", readonly:true, 
				getText: function(column, value) {
					return ("{0} by {1}").format(column.formatDateTime("dd-MMM-yyyy"), column.dataset.get("create_user"));
				}})
			.setprops("update_user", {label:"User", readonly:true})
			.setprops("update_date", {label:"Last updated on", type:"date", format:"datetime", readonly:true,
				getText: function(column, value) {
					return ("{0} by {1}").format(column.formatDateTime("dd-MMM-yyyy"), column.dataset.get("update_user"));
				}})
	};

	desktop.dbServiceSubType = new Dataset(desktop.customData.sub_type_data)
	desktop.dbServiceSubType.Columns
		.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
		.setprops("service_name", {label:"Type", readonly:true})
		
	InitializeData(desktop.dbService, desktop.dbServiceSubType);
};
