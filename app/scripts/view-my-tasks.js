// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-task-manager.js
//==================================================================================================
function MyTasksView(viewParams) {
	return new jMyTasks({container:viewParams.container});
};

Class.Inherits(jMyTasks, jCustomSavedQueryView);
function jMyTasks(params) {
    jMyTasks.prototype.parent.call(this, params);
};

jMyTasks.prototype.classID = "jMyTasks";
jMyTasks.prototype.viewCss = "my-tasks report";
jMyTasks.prototype.viewUrl = "app/my-tasks";
jMyTasks.prototype.searchWidth = 600;
jMyTasks.prototype.exportName = "My Tasks";
jMyTasks.prototype.exportSource = "DBMedics.GetMyTasks";
jMyTasks.prototype.popuMenuTitle = "My Tasks";

jMyTasks.prototype.initialize = function(params) {
	jMyTasks.prototype.parent.prototype.initialize.call(this, params);
};

jMyTasks.prototype.OnInitGrid = function(grid) {
	jMyTasks.prototype.parent.prototype.OnInitGrid.call(this, grid);
	grid.options.showSummary = false;
	grid.options.editNewPage = false;
	grid.options.showBand = false;
	grid.options.showMasterDetail = true;
	grid.options.showPopupMenu = false;
	grid.search.visible = false;
	grid.exportData.allow = false;
};

jMyTasks.prototype.OnInitDataRequest = function(dataset) {
	jMyTasks.prototype.parent.prototype.OnInitDataRequest.call(this, dataset);

	dataset
		.addColumn("page", 1, {numeric:true})
		.addColumn("pagesize", 25, {numeric:true})
		.addColumn("sort", "claim_no")
		.addColumn("order", "asc")
		// .addColumn("name", "")
		// .addColumn("member_no", "")
		// .addColumn("claim_types", "*")
		// .addColumn("service_types", "*")
		// .addColumn("status_codes", "")
		// .addColumn("sub_status_codes", "")
		// .addColumn("entry_start_date", null)
		// .addColumn("entry_end_date", null)
		.addColumn("client_ids", "");
		// .addColumn("policy_ids", "");

	dataset.Events.OnResetSearch.add(function(dataset, grid) {
		// dataset.set("claim_no", "");
		// dataset.set("member_no", "");
		// dataset.set("claim_types", "*");
		// dataset.set("service_types", "*");
		// dataset.set("status_codes", "");
		// dataset.set("sub_status_codes", "");
		// dataset.set("name", "");
		dataset.set("client_ids", "");
		// dataset.set("policy_ids", "");
	})
};

jMyTasks.prototype.OnInitSearchData = function(dataset) {
	jMyTasks.prototype.parent.prototype.OnInitSearchData.call(this, dataset);
	// dataset.Columns
		// .setprops("name", {label:"Name"})
		// .setprops("certificate_no", {label:"Certificate No."})
		// .setprops("claim_types", {label: "Claim Type"})
		// .setprops("service_types", {label: "Service Type"})
		// .setprops("status_codes", {label: "Status"})
		// .setprops("sub_status_codes", {label: "Sub-Status"})
		// .setprops("entry_start_date", {label: "From", type:"date"})
		// .setprops("entry_end_date", {label: "To", type:"date"})
};

jMyTasks.prototype.OnInitSearchEditor = function(editor) {
	jMyTasks.prototype.parent.prototype.OnInitSearchEditor.call(this, editor);

	editor.NewGroupEdit({caption:"Tasks"}, function(editor, tab) {
		tab.container.css("border", "1px silver");
		tab.container.css("border-style", "solid solid none solid");

		editor.AddGroup("", function(editor) {
			// editor.AddText("name");
			// editor.AddText("certificate_no");
		});

		// editor.NewSubSelectionView("Clients", 300, "client_ids", ClientsLookupView);
		
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

	editor.NewSubSelectionView("Clients", 300, "client_ids", ClientsLookupView);
	// editor.NewSubSelectionView("Master Policies", 300, "policy_ids", MasterPoliciesLookupView);
};

jMyTasks.prototype.OnInitData = function(dataset) {
	jMyTasks.prototype.parent.prototype.OnInitData.call(this, dataset);

	dataset.Columns
		.setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("claim_no", {label:"Claim No."})
		.setprops("service_no", {label:"Service No."})
		.setprops("action_class", {label:"Action Class"})
		.setprops("action", {label:"Action"})
		.setprops("action_owner", {label:"Owner"})
		.setprops("action_set_date", {label:"Creation Date", type:"date", required:true})
		.setprops("action_set_user", {label:"Action Creator"})
		.setprops("days", {label:"Days Overdue", numeric:true})
		.setprops("service_status_code", {label:"Status"})
		.setprops("service_status", {label:"Status"})
		.setprops("service_sub_status_code", {label:"Sub-Status"})
		.setprops("service_sub_status", {label:"Sub-Status"})
		.setprops("provider_name", {label:"Provider"})
		.setprops("full_name", {label:"Claimant"})
		.setprops("case_owner", {label:"Claim Owner"})
		.setprops("claim_type_name", {label:"Claim Type"})
		.setprops("service_type_name", {label:"Service Type"})
		.setprops("service_sub_type_name", {label:"Service Sub-Type"})
		.setprops("transaction_date", {label:"Admission Date", type:"date", required:true})
		.setprops("transaction_end_date", {label:"Discharge Date", type:"date", required:true})
		.setprops("client_name", {label:"Client"})
		.setprops("product_name", {label:"Product"})
		.setprops("policy_no", {label:"Policy No.", required:true})
		.setprops("policy_holder", {label:"Policy Holder", required:true})
		.setprops("diagnosis_code", {label:"ICD", required:true})
		.setprops("diagnosis", {label:"Diagnosis", required:true})
	
		// .setprops("id", {label:"ID", numeric:true, key: true})
		// .setprops("certificate_no", {label:"Certificate No.", required:true})
		// .setprops("alpha_id", {label:"Client Certificate No."})
		// .setprops("relationship", {label:"Relation"})
		// .setprops("product_name", {label:"Product"})
		// .setprops("full_name", {label:"Member's Name"})
		// .setprops("start_date", {label:"Effective Date Date", type:"date", required:true})
		// .setprops("end_date", {label:"Expiry Date", type:"date", required:true})
		// .setprops("sex", {label:"Sex"})
		// .setprops("client_name", {label:"Client"})
		// .setprops("plan_name", {label:"Plan Name"})
		// .setprops("policy_no", {label:"Policy No.", required:true})
		// .setprops("policy_holder", {label:"Policy Holder", required:true})
		// .setprops("dob", {label:"DOB", type:"date"})
};

jMyTasks.prototype.OnInitSummaryData = function(dataset) {
	jMyTasks.prototype.parent.prototype.OnInitSummaryData.call(this, dataset);
};

jMyTasks.prototype.OnInitRow = function(row) {
	jMyTasks.prototype.parent.prototype.OnInitRow.call(this, row);

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

jMyTasks.prototype.OnInitMethods = function(grid) {
	jMyTasks.prototype.parent.prototype.OnInitMethods.call(this, grid);

	grid.methods.add("getLinkUrl", function(grid, params) {
		// if(params.column.linkField === "id") {
			// return __member(params.id, true)
		if(params.column.linkField === "client_id") {
			return __client(params.id, true)
		} else if(params.column.linkField === "member_id") {
			return __member(params.id, true)
		} else if(params.column.linkField === "product_code") {
			return __product(params.id, true)
		} else if(params.column.linkField === "claim_id") {
			return __claim(params.id, true)
		} else if(params.column.linkField === "service_id") {
			// var module = grid.dataset.lookup(params.id, "service_type");
			var module = grid.dataset.lookup(grid.dataset.getKey(), "service_type");
			return __service(params.id, module, true)
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

jMyTasks.prototype.OnPopupMenuCommands = function(menu) {
	jMyTasks.prototype.parent.prototype.OnPopupMenuCommands.call(this, menu);
};

jMyTasks.prototype.OnPopupMenu = function(menu) {
	jMyTasks.prototype.parent.prototype.OnPopupMenu.call(this, menu);
};

jMyTasks.prototype.OnDrawCustomHeader = function(container) {
	jMyTasks.prototype.parent.prototype.OnDrawCustomHeader.call(this, container);

	// this.addFilterDisplay({name:"name", caption:"Member's Name", operator:"starts with"});
	// this.addFilterDisplay({name:"certificate_no", caption:"Certificate No.", operator:"starts with"});
	this.addFilterDisplay({name:"client_ids", caption:"Client ID", operator:"is"});
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

jMyTasks.prototype.OnMasterDetail = function(grid, params) {
	params.setHeight(200);
	CreateElementEx("pre", params.container, function(notes) {
		notes.append(grid.dataset.text("notes"));
	});
};

jMyTasks.prototype.OnInitColumns = function(grid) {
	jMyTasks.prototype.parent.prototype.OnInitColumns.call(this, grid);

	grid.NewColumn({fname: "action_class", width: 150, allowSort: true});
	grid.NewColumn({fname: "action", width: 250, allowSort: true});
	// grid.NewColumn({fname: "days", width: 100, allowSort: false});

	grid.NewColumn({fname: "claim_no", width: 100, allowSort: true, linkField:"claim_id"});
	// grid.NewColumn({fname: "case_owner", width: 125, allowSort: true});
	// grid.NewColumn({fname: "claim_type_name", width: 100, allowSort: true});
	grid.NewColumn({fname: "service_no", width: 175, allowSort: true, linkField:"service_id"});
	grid.NewColumn({fname: "action_set_date", width: 125, allowSort: true});
	grid.NewColumn({fname: "action_set_user", width: 125, allowSort: true});
	// grid.NewColumn({fname: "service_type_name", width: 150, allowSort: true});
	// grid.NewColumn({fname: "service_sub_type_name", width: 250, allowSort: true});

	// grid.NewColumn({fname: "service_status", width: 100, allowSort: true});
	// grid.NewColumn({fname: "service_sub_status", width: 200, allowSort: true});
	
	// grid.NewColumn({fname: "provider_name", width: 250, allowSort: true});
	// grid.NewColumn({fname: "transaction_date", width: 125, allowSort: true});
	// grid.NewColumn({fname: "transaction_end_date", width: 125, allowSort: true});
	// grid.NewColumn({fname: "diagnosis_code", width: 75, allowSort: true});
	// grid.NewColumn({fname: "diagnosis", width: 250, allowSort: true});

	// grid.NewColumn({fname: "full_name", width: 250, allowSort: true, linkField:"member_id"});

	// grid.NewColumn({fname: "client_name", width: 250, allowSort: true, linkField:"client_id"});
	// grid.NewColumn({fname: "product_name", width: 250, allowSort: true});
	// grid.NewColumn({fname: "policy_no", width: 100, allowSort: true});
	// grid.NewColumn({fname: "policy_holder", width: 250, allowSort: true});
};

jMyTasks.prototype.OnInitToolbar = function(toolbar) {
	jMyTasks.prototype.parent.prototype.OnInitToolbar.call(this, toolbar);
	
	return;
	toolbar.NewDropDownViewItem({
		id: "new-member",
		icon: "new",
		color: "#1CA8DD",
		title: "New Member",
		height: 200,
		width: 800,
		subTitle: "Choose the plan to assign the new member",
		// view: PlansLookup,
		// viewParams: {module:"INV", mode:1},
		select: function(code) {
			// window.open(__claim(("new/{0}/{1}").format(code.toLowerCase(), grid.dataParams.get("member_id")), true), "");
			// window.open(__member(("new/{0}?type={1}").format(grid.dataParams.get("member_id"), code), true), "");
			window.open(__member(("new/{0}?plan={1}").format(0, code), true), "");
			// window.open(__member(("new/{0}").format(code), true), "");
		}
	});
};