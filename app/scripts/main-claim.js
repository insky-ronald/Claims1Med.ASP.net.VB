// MainPage.prototype.navigatorTheme = "dark";

// MainPage.prototype.DefaultPainter = function() {
	// return new DesktopPainter5(this);
// }

MainPage.prototype.AfterPaint = function() {
	MainPage.prototype.parent.prototype.AfterPaint.call(this);
		
	desktop.dbCountries = desktop.LoadCacheData(desktop.customData.countries, "countries", "code");
	// desktop.dbCurrencies = desktop.LoadCacheData(desktop.customData.currencies, "currencies", "code");
	
	desktop.dbMedicalNotes = new Dataset(desktop.customData.medical_notes);
	
	desktop.dbMember = new Dataset(desktop.customData.member);
	desktop.dbMember.readonly = true;
	desktop.dbMember.Columns
		.setprops("member_id", {label:"ID", numeric:true, key: true})
		.setprops("client_id", {label:"ID", numeric:true})
		.setprops("policy_id", {label:"ID", numeric:true})
		.setprops("certificate_no", {label:"Certificate No."})
		.setprops("main_member", {label:"Main Member"})
		.setprops("member_name", {label:"Member's Name"})
		.setprops("dob", {label:"Date of Birth", type:"date"})
		.setprops("sex", {label:"Sex"})
		.setprops("age", {label:"Age", numeric:true})
		.setprops("is_vip", {label:"VIP", numeric:true})
		.setprops("is_blacklist", {label:"Blacklisted", numeric:true})

		.setprops("policy_no", {label:"Policy No."})
		.setprops("policy_holder", {label:"Policy Holder"})
		.setprops("client_name", {label:"Client's Name"})
		.setprops("product_name", {label:"Product"})
		.setprops("policy_issue_date", {label:"Issue/Purchase Date", type:"date"})
		.setprops("policy_start_date", {label:"Effective Date", type:"date"})
		.setprops("policy_end_date", {label:"Expiry Date", type:"date"})

		.setprops("plan_code", {label:"Plan"})
		.setprops("sub_product", {label:"Sub-Product"})
		// .setprops("policy_status", {label:"Status"})
		// .setprops("country", {label:"Country"})
		// .setprops("start_date", {label:"Start Date", type:"date",
			// onChange: function(column) {
				// self.dbData.set("new_travel_start_date", column.raw());
				// self.dbData.set("new_travel_end_date", column.dataset.columnByName("end_date").raw());
			// })
		// .setprops("end_date", {label:"End Date", type:"date",
			// onChange: function(column) {
				// self.dbData.set("new_travel_start_date", column.dataset.columnByName("start_date").raw());
				// self.dbData.set("new_travel_end_date", column.raw());
			// })
		// .setprops("icd_version", {numeric:true})

	desktop.dbClaim = new Dataset(desktop.customData.data);
	desktop.dbClaim.Columns
		.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
		.setprops("claim_no", {label:"Claim No.", readonly:true})
		.setprops("claim_type", {label:"Claim Type", readonly:true})
		.setprops("case_owner", {label:"Claim Owner", required:true})
		// .setprops("case_owner", {label:"Claim Owner", required:true, upperCase:false, lookupDataset: desktop.dbUsers,
			// getText: function(column, value) {
				// return column.lookupDataset.lookup(value, "name");
			// }
		// )
		.setprops("status", {label:"Status", readonly:true})
		.setprops("notification_date", {label:"Date Notified", type:"date", required:true})

		.setprops("sub_product", {label:"Sub-Product", readonly:true})
		.setprops("hcm_reference", {label:"Assistance Ref. No."})		
		.setprops("reference_no1", {label:desktop.dbMember.get("claim_reference1")})
		.setprops("reference_no2", {label:desktop.dbMember.get("claim_reference2")})
		.setprops("reference_no3", {label:desktop.dbMember.get("claim_reference3")})
		
		.setprops("status", {label:"Status"})
		.setprops("expired", {label:"Expired"})
		.setprops("plan_name", {label:"Type", required:true})
		
		.setprops("country_of_incident", {label:"Country of Incident", required:true, lookupDataset: desktop.dbCountries,
			getText: function(column, value) {
				return column.lookupDataset.lookup(value, "country");
			}
		})

		.setprops("is_accident", {label:"Accident"})
		.setprops("accident_date", {label:"Date of Accident", type:"date", required:desktop.dbClaim.raw("is_accident")})
		.setprops("accident_code", {label:"Accident Type", required:desktop.dbClaim.raw("is_accident")})
		
		.setprops("is_prexisting", {label:"Pre-Existing"})
		.setprops("first_symptom_date", {label:"First Symptom", type:"date", required:!desktop.dbClaim.raw("is_accident")})
		.setprops("first_consultation_date", {label:"First Consultation", type:"date", required:!desktop.dbClaim.raw("is_accident")})
		
		if(desktop.customData.claim_id) {
			desktop.dbClaim.Columns
				.setprops("create_user", {label:"User", readonly:true})
				.setprops("create_date", {label:"Creation", type:"date", format:"datetime", readonly:true})
				.setprops("update_user", {label:"User", readonly:true})
				.setprops("update_date", {label:"Last Update", type:"date", format:"datetime", readonly:true});
		};
	
	if(desktop.customData.newRecord) desktop.dbClaim.edit();
	desktop.dbClaim.Events.OnCancel.add(function(dataset) {
		if(desktop.customData.newRecord) window.close();
	});
	
	var self = this;
	this.Events.OnPaintCustomHeader.add(function(desktop, container) {
		self.notificationContainer = CreateElement("div", container, "", "notifications");
		self.claimInfoContainer = CreateElementEx("div", container, "", "information");
	
		var statusColor, statusCode = desktop.dbClaim.get("status_code");
		
		if(statusCode === "O") 
			statusColor = "#1AB394"
		else if(statusCode === "D") 
			statusColor = "#ED5565"
		else if(statusCode === "N") 
			statusColor = "#F8AC59"
		else
			statusColor = "black";
		
		desktop.AddNotification({
			icon: "history",
			color: statusColor,
			description: desktop.dbClaim.get("status")
		});
		
		if(desktop.dbMember.get("is_vip")) 
			desktop.AddNotification({
				icon: "user",
				color: "royalblue",
				description: "Member is VIP-"
			});

		if(desktop.dbMember.get("is_blacklisted")) 
			desktop.AddNotification({
				icon: "user",
				color: "firebrick",
				description: "Member is blacklisted"
			});
			
		desktop.AddClaimInfo({
			caption: "Member",
			description: desktop.dbMember.get("member_name")
		});
		
		desktop.AddClaimInfo({
			caption: "Plan",
			description: desktop.dbMember.get("plan_code")
		});
		
		desktop.AddClaimInfo({
			caption: "Product",
			description: desktop.dbMember.get("product_name")
		});
		
		desktop.AddClaimInfo({
			caption: "Client",
			description: desktop.dbMember.get("client_name")
		});
	});
};

MainPage.prototype.AddClaimInfo = function(params) {
	CreateElementEx("span", this.claimInfoContainer, function(info) {
		// info.css("border-color", params.color);
		CreateElementEx("span", info, function(caption) {
			// icon.css("background", params.color);
			// desktop.svg.draw(icon, params.icon, 20);
			caption.html(params.caption)
		}, "claim-info-caption");
		
		CreateElementEx("span", info, function(description) {
			description.html(params.description)
			// description.css("color", params.color)
		}, "claim-info-description");
		
	}, "claim-info");
};

MainPage.prototype.AddNotification = function(params) {
	CreateElementEx("span", this.notificationContainer, function(info) {
		info.css("border-color", params.color);
		CreateElementEx("span", info, function(icon) {
			icon.css("background", params.color);
			desktop.svg.draw(icon, params.icon, 20);
		}, "nofification-info-icon");
		
		CreateElementEx("span", info, function(description) {
			description.html(params.description)
			description.css("color", params.color)
		}, "nofification-info-label");
		
	}, "nofification-info");
};
