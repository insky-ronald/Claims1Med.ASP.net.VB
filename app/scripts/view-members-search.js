// ****************************************************************************************************
// Last modified on
// 6-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-claims-enquiry.js
//==================================================================================================
function MembersSearchView(viewParams) {
	return new jMemberSearch({container:viewParams.container});
};

Class.Inherits(jMemberSearch, jCustomSavedQueryView);
function jMemberSearch(params) {
    jMemberSearch.prototype.parent.call(this, params);
};

jMemberSearch.prototype.classID = "jMemberSearch";
jMemberSearch.prototype.viewCss = "members report";
jMemberSearch.prototype.viewUrl = "app/members-search";
jMemberSearch.prototype.searchWidth = 600;
jMemberSearch.prototype.exportName = "Members";
jMemberSearch.prototype.exportSource = "DBApp.GetMembersEnquiry";
jMemberSearch.prototype.popuMenuTitle = "Members";

jMemberSearch.prototype.initialize = function(params) {
	jMemberSearch.prototype.parent.prototype.initialize.call(this, params);
};

jMemberSearch.prototype.OnInitGrid = function(grid) {
	jMemberSearch.prototype.parent.prototype.OnInitGrid.call(this, grid);
	grid.options.showSummary = false;
	grid.options.editNewPage = true;
	grid.options.showBand = false;
};

jMemberSearch.prototype.OnInitDataRequest = function(dataset) {
	jMemberSearch.prototype.parent.prototype.OnInitDataRequest.call(this, dataset);

	dataset
		.addColumn("page", 1, {numeric:true})
		.addColumn("pagesize", 50, {numeric:true})
		.addColumn("sort", "full_name")
		.addColumn("order", "asc")
		.addColumn("name", "")
		// .addColumn("member_no", "")
		// .addColumn("claim_types", "*")
		// .addColumn("service_types", "*")
		// .addColumn("status_codes", "")
		// .addColumn("sub_status_codes", "")
		// .addColumn("entry_start_date", null)
		// .addColumn("entry_end_date", null)
		.addColumn("client_ids", "")
		.addColumn("policy_ids", "");

	dataset.Events.OnResetSearch.add(function(dataset, grid) {
		// dataset.set("claim_no", "");
		// dataset.set("member_no", "");
		// dataset.set("claim_types", "*");
		// dataset.set("service_types", "*");
		// dataset.set("status_codes", "");
		// dataset.set("sub_status_codes", "");
		dataset.set("name", "");
		dataset.set("client_ids", "");
		dataset.set("policy_ids", "");
	})
};

jMemberSearch.prototype.OnInitSearchData = function(dataset) {
	jMemberSearch.prototype.parent.prototype.OnInitSearchData.call(this, dataset);
	dataset.Columns
		.setprops("name", {label:"Name"})
		.setprops("certificate_no", {label:"Certificate No."})
		// .setprops("claim_types", {label: "Claim Type"})
		// .setprops("service_types", {label: "Service Type"})
		// .setprops("status_codes", {label: "Status"})
		// .setprops("sub_status_codes", {label: "Sub-Status"})
		// .setprops("entry_start_date", {label: "From", type:"date"})
		// .setprops("entry_end_date", {label: "To", type:"date"})
};

jMemberSearch.prototype.OnInitSearchEditor = function(editor) {
	jMemberSearch.prototype.parent.prototype.OnInitSearchEditor.call(this, editor);

	editor.NewGroupEdit({caption:"Member"}, function(editor, tab) {
		tab.container.css("border", "1px silver");
		tab.container.css("border-style", "solid solid none solid");

		editor.AddGroup("", function(editor) {
			editor.AddText("name");
			editor.AddText("certificate_no");
		});

		// editor.AddGroup("Claim and Service Types", function(editor) {
			// editor.AddRadioButton("claim_types", {
				// key: "id",
				// value: "value",
				// data: [
					// {id:"*", value:"All"},
					// {id:"MED", value:"Medical"},
					// {id:"TRV", value:"Travel"}
				// ]
			// });
			// editor.AddRadioButton("service_types", {
				// key: "id",
				// value: "value",
				// data: [
					// {id:"*", value:"All"},
					// {id:"INV", value:"Invoice"},
					// {id:"GOP", value:"Guarantee of Payment"},
					// {id:"NOC", value:"Notification of Claim"}
				// ]
			// });
		// });

		// editor.AddGroup("Entry Date", function(editor) {
			// editor.AddEdit({ID: "entry_start_date"});
			// editor.AddEdit({ID: "entry_end_date"});
		// });

		// editor.AddGroup("Status <a>(separate codes with comma, ie E,P in Status or P01,E01,A04 in Sub-Status)</a>", function(editor) {
			// editor.AddEdit({ID: "status_codes"});
			// editor.AddEdit({ID: "sub_status_codes"});
		// });
	});

	// editor.NewSubSelectionView("Clients", 300, "client_ids", ClientsLookupView);
	// editor.NewSubSelectionView("Master Policies", 300, "policy_ids", MasterPoliciesLookupView);
};

jMemberSearch.prototype.OnInitData = function(dataset) {
	jMemberSearch.prototype.parent.prototype.OnInitData.call(this, dataset);

	dataset.Columns
		.setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("certificate_no", {label:"Certificate No.", required:true})
		.setprops("alpha_id", {label:"Client Certificate No."})
		.setprops("relationship_code", {label:"Relation"})
		.setprops("product_name", {label:"Product"})
		.setprops("full_name", {label:"Member's Name"})
		.setprops("start_date", {label:"Effective Date Date", type:"date", required:true})
		.setprops("end_date", {label:"Expiry Date", type:"date", required:true})
		.setprops("sex", {label:"Sex"})
		.setprops("client_name", {label:"Client"})
		.setprops("plan_name", {label:"Plan Name"})
		.setprops("policy_no", {label:"Policy No.", required:true})
		.setprops("policy_holder", {label:"Policy Holder", required:true})
		.setprops("dob", {label:"DOB", type:"date"})
};

jMemberSearch.prototype.OnInitSummaryData = function(dataset) {
	jMemberSearch.prototype.parent.prototype.OnInitSummaryData.call(this, dataset);
};

jMemberSearch.prototype.OnInitRow = function(row) {
	jMemberSearch.prototype.parent.prototype.OnInitRow.call(this, row);

	// if(this.grid.dataset.get("ServiceStatusCode") == "D") {
		// row.attr("service-status", "decline")
	// } else if(this.grid.dataset.get("ServiceStatusCode") == "P" || this.grid.dataset.get("ServiceStatusCode") == "N") {
		// row.attr("service-status", "pending")
	// } else if(this.grid.dataset.get("ServiceStatusCode") == "E") {
		// row.attr("service-status", "approved")
	// } else {
		// row.attr("service-status", "")
	// };
};

jMemberSearch.prototype.OnInitMethods = function(grid) {
	jMemberSearch.prototype.parent.prototype.OnInitMethods.call(this, grid);

	grid.methods.add("getLinkUrl", function(grid, params) {
		if(params.column.linkField === "id") {
			return __member(params.id, true)
		} else if(params.column.linkField === "client_id") {
			return __client(params.id, true)
		} else if(params.column.linkField === "product_code") {
			return __product(params.id, true)
		// else if(params.column.linkField === "ClaimID")
			// return __claim(params.id, true)
		// else if(params.column.linkField === "ServiceID") {
			// var module = grid.dataset.lookup(params.id, "ModuleID");
			// if(module === "INV")
				// return __invoice(params.id, true)
			// else if(module === "GOP")
				// return __gop(params.id, true)
		} else {
			return ""
		}
	});

	grid.methods.add("editPageUrl", function(grid, id) {
		return __member(id, true);
		// var module = grid.dataset.lookup(id, "ModuleID");
		// if(module === "INV")
			// return __invoice(id, true)
		// else if(module === "GOP")
			// return __gop(id, true)
	})
};

jMemberSearch.prototype.OnPopupMenuCommands = function(menu) {
	jMemberSearch.prototype.parent.prototype.OnPopupMenuCommands.call(this, menu);
};

jMemberSearch.prototype.OnPopupMenu = function(menu) {
	jMemberSearch.prototype.parent.prototype.OnPopupMenu.call(this, menu);
};

jMemberSearch.prototype.OnDrawCustomHeader = function(container) {
	jMemberSearch.prototype.parent.prototype.OnDrawCustomHeader.call(this, container);

	this.addFilterDisplay({name:"name", caption:"Member's Name", operator:"starts with"});
	this.addFilterDisplay({name:"certificate_no", caption:"Certificate No.", operator:"starts with"});
	// this.addFilterDisplay({name:"client_ids", caption:"Client ID", operator:"is"});
	// this.addFilterDisplay({name:"policy_ids", caption:"Master Policy ID", operator:"is"});
	// if(this.grid.dataParams.get("claim_types") !== "*")
		// this.addFilterDisplay({name:"claim_types", caption:"Claim Type", operator:"is"});
	// if(this.grid.dataParams.get("service_types") !== "*")
		// this.addFilterDisplay({name:"service_types", caption:"Service Type", operator:"is"});

	// this.addFilterDisplay({name:"entry_start_date", caption:"Entry Date", operator:">="});
	// this.addFilterDisplay({name:"entry_end_date", caption:"Entry Date", operator:"<="});
	// this.addFilterDisplay({name:"status_codes", caption:"Status Code", operator:"is"});
	// this.addFilterDisplay({name:"sub_status_codes", caption:"Sub-Status Code", operator:"is"});
};

jMemberSearch.prototype.OnInitColumns = function(grid) {
	jMemberSearch.prototype.parent.prototype.OnInitColumns.call(this, grid);

	grid.NewColumn({fname: "certificate_no", width: 150, allowSort: true});
	// grid.NewColumn({fname: "alpha_id", width: 150, allowSort: true});
	grid.NewColumn({fname: "policy_no", width: 150, allowSort: true});
	grid.NewColumn({fname: "full_name", width: 250, allowSort: true, linkField:"id"});
	grid.NewColumn({fname: "plan_name", width: 200, allowSort: true});
	grid.NewColumn({fname: "relationship_code", width: 100, allowSort: true});
	grid.NewColumn({fname: "dob", width: 100, allowSort: false});
	grid.NewColumn({fname: "sex", width: 75, allowSort: false});
	grid.NewColumn({fname: "start_date", width: 125, allowSort: false});
	grid.NewColumn({fname: "end_date", width: 125, allowSort: false});
	grid.NewColumn({fname: "policy_holder", width: 250, allowSort: true});
	grid.NewColumn({fname: "client_name", width: 250, allowSort: true, linkField:"client_id"});
	grid.NewColumn({fname: "product_name", width: 250, allowSort: true, linkField:"product_code"});
};

jMemberSearch.prototype.OnInitToolbar = function(toolbar) {
	jMemberSearch.prototype.parent.prototype.OnInitToolbar.call(this, toolbar);
	
	toolbar.NewDropDownViewItem({
		id: "new-member",
		icon: "new",
		color: "#1CA8DD",
		title: "New Member",
		height: 200,
		width: 800,
		subTitle: "Choose the plan to assign the new member",
		view: PlansLookup,
		// viewParams: {module:"INV", mode:1},
		select: function(code) {
			// window.open(__claim(("new/{0}/{1}").format(code.toLowerCase(), grid.dataParams.get("member_id")), true), "");
			// window.open(__member(("new/{0}?type={1}").format(grid.dataParams.get("member_id"), code), true), "");
			window.open(__member(("new/{0}?plan={1}").format(0, code), true), "");
			// window.open(__member(("new/{0}").format(code), true), "");
		}
	});
};