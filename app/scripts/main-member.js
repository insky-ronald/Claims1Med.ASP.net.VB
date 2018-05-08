MainPage.prototype.AfterPaint = function() {
	MainPage.prototype.parent.prototype.AfterPaint.call(this);

	desktop.dbCountries = desktop.LoadCacheData(desktop.customData.countries, "countries", "code");
	desktop.dbRelationships = desktop.LoadCacheData(desktop.customData.relationships, "relationships", "code");
	
	desktop.dbProduct = new Dataset(desktop.customData.product);
	desktop.dbProduct.Columns
		.setprops("code", {label:"Code", key: true})
		.setprops("product_name", {label:"Product"})
		.setprops("member_reference_name1", {label:"Reference No. 1"})
		.setprops("member_reference_name2", {label:"Reference No. 2"})
		.setprops("member_reference_name3", {label:"Reference No. 3"})

	desktop.dbMedicalNotes = new Dataset(desktop.customData.medical_notes);
	desktop.dbMedicalNotes.Columns.setprops("id", {numeric:true, key: true});
		
	desktop.dbMember = new Dataset(desktop.customData.data);
	desktop.dbMember.Columns
		.setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("certificate_no", {label:"Certificate No.", required:true})
		.setprops("main_member", {label:"Main Member", readonly:true, required:true})
		.setprops("first_name", {label:"First Name", required:true})
		.setprops("middle_name", {label:"Middle Member"})
		.setprops("last_name", {label:"Last Member", required:true})
		.setprops("name", {label:"Full Name", readonly:true})
		.setprops("dob", {label:"Date of Birth", type:"date"})
		.setprops("gender", {label:"Gender"})
		.setprops("reference_no1", {label:desktop.dbProduct.get("member_reference_name1")})
		.setprops("reference_no2", {label:desktop.dbProduct.get("member_reference_name2")})
		.setprops("reference_no3", {label:desktop.dbProduct.get("member_reference_name3")})
		.setprops("relationship_code", {label:"Relationship", readonly:true, required:true, lookupDataset: desktop.dbRelationships,
			getText: function(column, value) {
				if (value == "XX") {
					return "SELF"
				} else {
					return column.lookupDataset.lookup(value, "relationship");
				}
			}
		})
		.setprops("home_country_code", {label:"Home Country", required:false, lookupDataset: desktop.dbCountries,
			getText: function(column, value) {
				return column.lookupDataset.lookup(value, "country");
			}
		})
		.setprops("plan_code", {label:"Plan", required:true, readonly:!desktop.customData.newRecord})
		.setprops("inception_date", {label:"Inception Date", type:"date", readonly:!desktop.customData.newRecord})
		.setprops("start_date", {label:"Start Date", type:"date", required:true, readonly:!desktop.customData.newRecord})
		.setprops("end_date", {label:"End Date", type:"date", required:true, readonly:!desktop.customData.newRecord})
		.setprops("policy_no", {label:"Policy No.", readonly:true})
		.setprops("policy_holder", {label:"Policy Holder", readonly:true})
		.setprops("product_name", {label:"Product", readonly:true})
		.setprops("policy_issue_date", {label:"Issue/Purchase Date", type:"date", readonly:true})
		.setprops("policy_start_date", {label:"Effective Date", type:"date", readonly:true})
		.setprops("policy_end_date", {label:"Expiry Date", type:"date", readonly:true})
		.setprops("product_code", {label:"Code", readonly:true})
		.setprops("product_name", {label:"Product", readonly:true})
		.setprops("client_name", {label:"Client", readonly:true})
		
	if(desktop.customData.newRecord) {
		desktop.dbMember.edit()
	};

	desktop.dbMember.Events.OnCancel.add(function(dataset) {
		if(desktop.customData.newRecord) {
			window.close()
		}
	});

	var self = this;
	this.Events.OnPaintCustomHeader.add(function(desktop, container) {
	});
};
