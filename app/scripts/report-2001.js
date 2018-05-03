// ****************************************************************************************************
// Last modified on
// 03-MAY-2018
// ****************************************************************************************************
//==================================================================================================
// File name: report-2001.js
//==================================================================================================
function ReportView(viewParams) {
	// console.log(viewParams);
	return new TabularReportView({container:viewParams.container, reporttID: parseInt(viewParams.requestParams.report_id)});
};

Class.Inherits(TabularReportView, jCustomSavedQueryView);
function TabularReportView(params) {
    TabularReportView.prototype.parent.call(this, params);
};

TabularReportView.prototype.classID = "TabularReportView";
TabularReportView.prototype.viewCss = "members report";
TabularReportView.prototype.viewUrl = "app/report-2001";
TabularReportView.prototype.searchWidth = 600;
TabularReportView.prototype.exportName = "Active Members";
TabularReportView.prototype.exportSource = "DBReporting.RunReport";
TabularReportView.prototype.popuMenuTitle = "Members";

TabularReportView.prototype.initialize = function(params) {
	TabularReportView.prototype.parent.prototype.initialize.call(this, params);
	this.reporttID = params.reporttID;
};

TabularReportView.prototype.OnInitGrid = function(grid) {
	TabularReportView.prototype.parent.prototype.OnInitGrid.call(this, grid);
	grid.options.showSummary = false;
	grid.options.editNewPage = true;
	grid.options.showBand = false;
};

TabularReportView.prototype.OnInitDataRequest = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitDataRequest.call(this, dataset);
	// console.log(dataset.data);
	// console.log("here");
	dataset
		.addColumn("id", this.reporttID, {numeric:true})
		.addColumn("loaded", 0, {numeric:true})
		// .addColumn("page", 1, {numeric:true})
		// .addColumn("pagesize", 50, {numeric:true})
		.addColumn("sort", "full_name")
		.addColumn("order", "asc")

	dataset.Events.OnResetSearch.add(function(dataset, grid) {
		dataset.set("client_ids", "");
		dataset.set("show_members_option", "");
	})
};

TabularReportView.prototype.OnInitSearchData = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitSearchData.call(this, dataset);
	dataset.Columns
		.setprops("client_ids", {label:"Client ID"})
		.setprops("show_members_option", {label:"Show Members"})
};

TabularReportView.prototype.OnInitSearchEditor = function(editor) {
	TabularReportView.prototype.parent.prototype.OnInitSearchEditor.call(this, editor);

	editor.NewGroupEdit({caption:"Report"}, function(editor, tab) {
		tab.container.css("border", "1px silver");
		tab.container.css("border-style", "solid solid none solid");

		editor.AddGroup("Option", function(editor) {
			// editor.AddText("client_ids");
			editor.AddRadioButton("show_members_option", {
				key: "id",
				value: "value",
				data: [
					{id:"A", value:"Active"},
					{id:"X", value:"Inactive"},
					{id:"", value:"Show all"}
				]
			});
		});
	});

	editor.NewSubSelectionView("Clients", 300, "client_ids", ClientsLookupView);
	// editor.NewSubSelectionView("Master Policies", 300, "policy_ids", MasterPoliciesLookupView);
};

// TabularReportView.prototype.OnInitSearchEditorLookups = function(editor) {
	// editor.NewSubSelectionView("Clients", 300, "client_ids", ClientsLookupView);
	// editor.NewSubSelectionView("Master Policies", 300, "policy_ids", MasterPoliciesLookupView);
	// editor.NewSubSelectionView("Brokers", 300, "broker_ids", BrokersLookupView);
	// editor.NewSubSelectionView("Settlement Currencies", 300, "settlement_currency_codes", CurrenciesLookupView);
	// editor.NewSubSelectionView("Client Currencies", 300, "client_currency_codes", CurrenciesLookupView);
	// editor.NewSubSelectionView("Users", 300, "user_names", UsersLookupView);
// };

TabularReportView.prototype.OnInitData = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitData.call(this, dataset);

	dataset.Columns
		.setprops("member_id", {label:"ID", numeric:true, key: true})
		.setprops("certificate_no", {label:"Certificate No.", required:true})
		// .setprops("alpha_id", {label:"Client Certificate No."})
		.setprops("relation", {label:"Relation"})
		.setprops("product", {label:"Product"})
		.setprops("full_name", {label:"Member's Name"})
		.setprops("effective_date", {label:"Effective Date", type:"date", required:true})
		.setprops("expiry_date", {label:"Expiry Date", type:"date", required:true})
		.setprops("cancellation_date", {label:"Cancellation Date", type:"date", required:true})
		.setprops("sex", {label:"Sex"})
		.setprops("client_name", {label:"Client"})
		.setprops("plan_name", {label:"Plan Name"})
		.setprops("policy_no", {label:"Policy No.", required:true})
		.setprops("policy_holder", {label:"Policy Holder", required:true})
		.setprops("dob", {label:"DOB", type:"date"})
};

TabularReportView.prototype.OnInitSummaryData = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitSummaryData.call(this, dataset);
};

TabularReportView.prototype.OnInitRow = function(row) {
	TabularReportView.prototype.parent.prototype.OnInitRow.call(this, row);
};

TabularReportView.prototype.OnInitMethods = function(grid) {
	TabularReportView.prototype.parent.prototype.OnInitMethods.call(this, grid);

	grid.methods.add("getLinkUrl", function(grid, params) {
		if(params.column.linkField === "member_id") {
			return __member(params.id, true)
		} else if(params.column.linkField === "client_id") {
			return __client(params.id, true)
		} else if(params.column.linkField === "product_code") {
			return __product(params.id, true)
		} else {
			return ""
		}
	});

	grid.methods.add("editPageUrl", function(grid, id) {
		return __member(id, true);
	})
};

TabularReportView.prototype.OnPopupMenuCommands = function(menu) {
	TabularReportView.prototype.parent.prototype.OnPopupMenuCommands.call(this, menu);
};

TabularReportView.prototype.OnPopupMenu = function(menu) {
	TabularReportView.prototype.parent.prototype.OnPopupMenu.call(this, menu);
};

TabularReportView.prototype.OnDrawCustomHeader = function(container) {
	TabularReportView.prototype.parent.prototype.OnDrawCustomHeader.call(this, container);

	// this.addFilterDisplay({name:"name", caption:"Member's Name", operator:"starts with"});
	// this.addFilterDisplay({name:"certificate_no", caption:"Certificate No.", operator:"starts with"});
	this.addFilterDisplay({name:"client_ids", caption:"Client ID", operator:"is"});
	if(this.grid.dataParams.get("show_members_option") == "A")
		this.addFilterDisplay({displayText:"Showing Active Members"})
	else if(this.grid.dataParams.get("show_members_option") == "X")
		this.addFilterDisplay({displayText:"Showing Inactive Members"});
	
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

TabularReportView.prototype.OnInitColumns = function(grid) {
	TabularReportView.prototype.parent.prototype.OnInitColumns.call(this, grid);

	grid.NewColumn({fname: "certificate_no", width: 150, allowSort: true});
	// grid.NewColumn({fname: "alpha_id", width: 150, allowSort: true});
	grid.NewColumn({fname: "policy_no", width: 150, allowSort: true});
	grid.NewColumn({fname: "full_name", width: 250, allowSort: true, linkField:"member_id"});
	grid.NewColumn({fname: "plan_name", width: 250, allowSort: true});
	grid.NewColumn({fname: "relation", width: 150, allowSort: true});
	grid.NewColumn({fname: "dob", width: 100, allowSort: false});
	grid.NewColumn({fname: "sex", width: 75, allowSort: false});
	grid.NewColumn({fname: "effective_date", width: 125, allowSort: false});
	grid.NewColumn({fname: "expiry_date", width: 125, allowSort: false});
	grid.NewColumn({fname: "cancellation_date", width: 125, allowSort: false});
	grid.NewColumn({fname: "policy_holder", width: 250, allowSort: true});
	// grid.NewColumn({fname: "client_name", width: 250, allowSort: true, linkField:"client_id"});
	// grid.NewColumn({fname: "product", width: 250, allowSort: true, linkField:"product_code"});
	grid.NewColumn({fname: "client_name", width: 250, allowSort: true});
	grid.NewColumn({fname: "product", width: 250, allowSort: true});
};
