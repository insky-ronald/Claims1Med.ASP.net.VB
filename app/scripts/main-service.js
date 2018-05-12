MainPage.prototype.AfterPaint = function() {
	MainPage.prototype.parent.prototype.AfterPaint.call(this);

	desktop.dbCountries = desktop.LoadCacheData(desktop.customData.countries, "countries", "code");
	desktop.dbCurrencies = desktop.LoadCacheData(desktop.customData.currencies, "currencies", "code");
	
	desktop.status = desktop.customData.data[0].status_code;
	desktop.subStatus = desktop.customData.data[0].sub_status_code;
	desktop.serviceType = desktop.customData.data[0].service_type;
	desktop.serviceSubType = desktop.customData.data[0].service_sub_type;
	
	// GOP-related options
	if (desktop.serviceType == "GOP") {
		desktop.canEdit = desktop.status == "N" || desktop.status == "P";
		desktop.posted = desktop.status == "S";
		desktop.inpatient = desktop.serviceSubType == "GM01" || desktop.serviceSubType == "GM02";
		desktop.sentToOutbox = desktop.status == "S" && desktop.subStatus == "S01";
		desktop.superceded = desktop.status == "S" && desktop.subStatus == "S02";
		desktop.awaitingInvoice = desktop.status == "S" && desktop.subStatus == "S08";
		desktop.invoiceReceived = desktop.status == "S" && desktop.subStatus == "S03";
	} else if (desktop.serviceType == "INV") {
		desktop.canEdit = desktop.status == "N" || desktop.status == "P";
		desktop.posted = desktop.status == "S";
		desktop.inpatient = desktop.serviceSubType == "M003" || desktop.serviceSubType == "M004" || desktop.serviceSubType == "M005" || desktop.serviceSubType == "M006";
	}
	
	desktop.dbService = new Dataset(desktop.customData.data);
	desktop.dbService.readonly = !desktop.canEdit;
	desktop.dbService.Columns
		.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
		.setprops("claim_no", {label:"Claim No.", readonly:true})
		.setprops("service_no", {label:"Reference No.", readonly:true})
		.setprops("patient_name", {label:"Insured's Name", readonly:true})
		.setprops("policy_no", {label:"Policy No.", readonly:true})
		.setprops("plan_code", {label:"Plan", readonly:true})
		.setprops("client_name", {label:"Client's Name", readonly:true})
		.setprops("claim_currency_code", {label:"Currency", required:true, lookupDataset: desktop.dbCurrencies,
			getText: function(column, value) {
				return ("{0} ({1})").format(column.lookupDataset.lookup(value, "currency"), value);
			},
			onChange: function(column) {
				column.dataset.Events.OnGetExchangeRates.trigger();
			}
		})
		.setprops("claim_currency_rate_date", {label:"Date", type:"date", required:false,
			onChange: function(column) {
				column.dataset.Events.OnGetExchangeRates.trigger();
			}
		})
		.setprops("claim_currency_to_base", {label:("To Base Currrency (<b>{0}</b>)").format(desktop.dbService.get("base_currency_code")), numeric:true, readonly:true})
		.setprops("claim_currency_to_client", {label:("To Client Currrency (<b>{0}</b>)").format(desktop.dbService.get("client_currency_code")), numeric:true, readonly:true})
		.setprops("claim_currency_to_eligibility", {label:("To Eligibility Currrency (<b>{0}</b>)").format(desktop.dbService.get("eligibility_currency_code")), numeric:true, readonly:true})
		.setprops("discount_type", {label:"Discount Type", numeric:true, type:"money", format:"00"})
		.setprops("discount_percent", {label:"Percent %", numeric:true, type:"money", format:"00"})
		.setprops("discount_amount", {label:"Amount", numeric:true});

	if (desktop.serviceType == "GOP") {
		desktop.dbService.Columns
			.setprops("admission_first_call", {label:"Admission First Call", type:"date", format:"datetime", required:false})
	} else if (desktop.serviceType == "INV") {
	}
		
	if(desktop.customData.newRecord) {
		desktop.dbService.edit()
	};

	desktop.dbService.Events.OnCancel.add(function(dataset) {
		if(desktop.customData.newRecord) {
			window.close()
		}
	});
	
	desktop.dbService.Events.OnGetExchangeRates = new EventHandler(desktop.dbService);
	desktop.dbService.Events.OnGetExchangeRates.add(function(dataset) {
		var currencies = [];
		var claimCurrency = dataset.raw("claim_currency_code");
		
		currencies.push(("{0}={1}").format(claimCurrency, dataset.get("client_currency_code"));
		currencies.push(("{0}={1}").format(claimCurrency, dataset.get("base_currency_code"));
		currencies.push(("{0}={1}").format(claimCurrency, dataset.get("eligibility_currency_code"));
		
		desktop.Ajax(
			self, 
			"/app/api/command/currency-rate-set",
			{
				currencies: currencies.join(","),
				date: dataset.formatDateTime2("claim_currency_rate_date", "yyyy-MM-dd")
			}, 
			function(result) {
				dataset.set("claim_currency_to_base", result.rates[0]);
				dataset.set("claim_currency_to_client", result.rates[1]);
				dataset.set("claim_currency_to_eligibility", result.rates[2]);
			}
		)
	});
	
	// if(desktop.customData.service_id) {
		desktop.dbService.Columns
			.setprops("create_user", {label:"User", readonly:true})
			.setprops("create_date", {label:"Creation", type:"date", format:"datetime", readonly:true})
			.setprops("update_user", {label:"User", readonly:true})
			.setprops("update_date", {label:"Last Update", type:"date", format:"datetime", readonly:true});
	// };

	if (desktop.serviceType == "GOP") {
		InitializeGop(desktop.dbService);
	} else if (desktop.serviceType == "INV") {
		InitializeInvoice(desktop.dbService);
	}
};
