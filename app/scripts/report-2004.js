// ****************************************************************************************************
// Last modified on
// 23-MAY-2018
// ****************************************************************************************************
//==================================================================================================
// File name: report-2004.js
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
TabularReportView.prototype.viewCss = "medical expense report"; //always add "report" for the CSS to take effect
TabularReportView.prototype.viewUrl = "app/report-2004";
TabularReportView.prototype.searchWidth = 800;
TabularReportView.prototype.exportName = "Summary of Medical Expenses";
TabularReportView.prototype.exportSource = "DBReporting.RunReport";
TabularReportView.prototype.popuMenuTitle = "Medical Expenses";

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
		.addColumn("page", 1, {numeric:true})
		.addColumn("pagesize", 25, {numeric:true})
		.addColumn("sort", "claim_no")
		.addColumn("order", "asc")

	dataset.Events.OnResetSearch.add(function(dataset, grid) {
		//Clients
		dataset.set("client_ids", "");
		//Claim
		dataset.set("claim_no", "");
		dataset.set("service_no", "");
		dataset.set("service_id", "");
		dataset.set("status_codes", "");
		dataset.set("claim_types", "");
		//Policy
		dataset.set("policy_nos", ""); 
		//Provider
		dataset.set("provider_ids", ""); 
		dataset.set("physician_ids", ""); 
		//Case Opened
		dataset.set("case_opened_start", ""); 
		dataset.set("case_opened_end", ""); 
		//Incident Date
		dataset.set("incident_date_start", ""); 
		dataset.set("incident_date_end", ""); 
	})
};

TabularReportView.prototype.OnInitSearchData = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitSearchData.call(this, dataset);
	dataset.Columns
		//Clients
		.setprops("client_ids", {label:"Client ID"}) 
		//Claim
		.setprops("claim_no", {label:"Claim No."})
		.setprops("service_no", {label:"Service No."})
		.setprops("service_id", {label:"Invoice No."})
		.setprops("status_codes", {label:"Status"})
		.setprops("claim_types", {label:"Claim Type"})
		//Policy
		.setprops("policy_nos", {label:"Policy No."})
		//Provider
		.setprops("provider_ids", {label:"Provider Name"})
		.setprops("physician_ids", {label:"Doctor Name"})
		//Case Opened
		.setprops("case_opened_start", {label:"Start", type:"date"})
		.setprops("case_opened_end", {label:"End", type:"date"})
		//Incident Date
		.setprops("incident_date_start", {label:"Start", type:"date"})
		.setprops("incident_date_end", {label:"End", type:"date"})
};

TabularReportView.prototype.OnInitSearchEditor = function(editor) {
	TabularReportView.prototype.parent.prototype.OnInitSearchEditor.call(this, editor);

	editor.NewGroupEdit({caption:"Report"}, function(editor, tab) {
		tab.container.css("border", "1px silver");
		tab.container.css("border-style", "solid solid none solid");

		editor.AddGroup("Claim", function(editor) {
			editor.AddText("claim_no");
			editor.AddText("service_no");
			editor.AddText("service_id");
		});
		
		editor.AddGroup("Case Opened", function(editor) {
			editor.AddDate("case_opened_start");
			editor.AddDate("case_opened_end");
		});
		
		editor.AddGroup("Date of Claim", function(editor) {
			editor.AddDate("incident_date_start");
			editor.AddDate("incident_date_end");
		});
	});

	editor.NewSubSelectionView("Clients", 300, "client_ids", ClientsLookupView);
	editor.NewSubSelectionView("Claim Type", 300, "claim_types", ClaimTypeCodesLookupView);
	editor.NewSubSelectionView("Service Status", 300, "status_codes", InvoiceStatusLookupView);
	editor.NewSubSelectionView("Policy No.", 300, "policy_nos", PolicyNoLookupView);
	editor.NewSubSelectionView("Provider", 300, "provider_ids", ProviderIdsLookupView);
	editor.NewSubSelectionView("Doctor", 300, "physician_ids", DoctorIdsLookupView);
};

TabularReportView.prototype.OnInitData = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitData.call(this, dataset);

	dataset.Columns
		.setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("case_opened", {label:"Case Opened", type:"date", required:true})
		.setprops("claim_no", {label:"Claim No.", required:true})
		.setprops("service_no", {label:"Service No.", required:true})
		.setprops("service_id", {label:"Invoice No.", required:true})
		.setprops("status_desc", {label:"Status"})
		.setprops("claimant", {label:"Claimant"})
		.setprops("policy_no", {label:"Policy No.", required:true})
		.setprops("plan_desc", {label:"Plan Name", required:true})
		.setprops("age", {label:"Age", numeric:true})
		.setprops("sex", {label:"Gender"})
		.setprops("incident_date", {label:"Date of Claim", type:"date", required:true})
		.setprops("diagnosis", {label:"Diagnosis"})
		.setprops("provider_name", {label:"Provider Name"})
		.setprops("doctor_name", {label:"Physician"})
		.setprops("amount", {label:"Amount", numeric:true, type:"money", format:"00"})
		.setprops("claim_type", {label:"Claim Type"})		
};

TabularReportView.prototype.OnInitSummaryData = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitSummaryData.call(this, dataset);
};

TabularReportView.prototype.OnInitRow = function(row) {
	TabularReportView.prototype.parent.prototype.OnInitRow.call(this, row);
};

TabularReportView.prototype.OnInitMethods = function(grid) {
	TabularReportView.prototype.parent.prototype.OnInitMethods.call(this, grid);

	// grid.methods.add("getLinkUrl", function(grid, params) {
		// if(params.column.linkField === "policy_name") {
			// return __product(params.id, true)
		// } else if(params.column.linkField === "claim_no") {
			// return __claim(params.id, true)
		// } else {
			// return ""
		// }
	// });

	// grid.methods.add("editPageUrl", function(grid, id) {
		// return __member(id, true);
	// })
};

TabularReportView.prototype.OnPopupMenuCommands = function(menu) {
	TabularReportView.prototype.parent.prototype.OnPopupMenuCommands.call(this, menu);
};

TabularReportView.prototype.OnPopupMenu = function(menu) {
	TabularReportView.prototype.parent.prototype.OnPopupMenu.call(this, menu);
};

TabularReportView.prototype.OnDrawCustomHeader = function(container) {
	TabularReportView.prototype.parent.prototype.OnDrawCustomHeader.call(this, container);
	
	this.addFilterDisplay({name:"client_ids", caption:"Client ID", operator:"is"});
	this.addFilterDisplay({name:"claim_no", caption:"Claim No.", operator:"is"});
	this.addFilterDisplay({name:"service_no", caption:"Service No.", operator:"is"});
	this.addFilterDisplay({name:"service_id", caption:"Onvoice No.", operator:"is"});
	this.addFilterDisplay({name:"status_codes", caption:"Status", operator:"is"});
	this.addFilterDisplay({name:"claim_types", caption:"Claim Type", operator:"is"});
	this.addFilterDisplay({name:"policy_nos", caption:"Policy No.", operator:"is"});
	this.addFilterDisplay({name:"provider_ids", caption:"Provider ID", operator:"is"});
	this.addFilterDisplay({name:"physician_ids", caption:"Doctor ID", operator:"is"});
	this.addFilterDisplay({name:"case_opened_start", caption:"Case Opened Start", operator:">="});
	this.addFilterDisplay({name:"case_opened_end", caption:"Case Opened End", operator:"<="});
	this.addFilterDisplay({name:"incident_date_start", caption:"Date of Claim Start", operator:">="});
	this.addFilterDisplay({name:"incident_date_end", caption:"Date of Claim End", operator:"<="});
};

TabularReportView.prototype.OnInitColumns = function(grid) {
	TabularReportView.prototype.parent.prototype.OnInitColumns.call(this, grid);

	grid.NewColumn({fname: "case_opened", width: 110, allowSort: true});
	grid.NewColumn({fname: "claim_no", width: 100, allowSort: true});
	grid.NewColumn({fname: "service_no", width: 150, allowSort: true});
	grid.NewColumn({fname: "service_id", width: 100, allowSort: true});
	grid.NewColumn({fname: "status_desc", width: 150, allowSort: true});
	grid.NewColumn({fname: "claimant", width: 250, allowSort: true});
	grid.NewColumn({fname: "policy_no", width: 100, allowSort: true});
	grid.NewColumn({fname: "plan_desc", width: 175, allowSort: true});
	grid.NewColumn({fname: "age", width: 50, allowSort: true});
	grid.NewColumn({fname: "sex", width: 75, allowSort: true});
	grid.NewColumn({fname: "incident_date", width: 125, allowSort: true});
	grid.NewColumn({fname: "diagnosis", width: 250, allowSort: true});
	grid.NewColumn({fname: "provider_name", width: 250, allowSort: true});
	grid.NewColumn({fname: "doctor_name", width: 150, allowSort: true});
	grid.NewColumn({fname: "amount", width: 100, allowSort: true});
	grid.NewColumn({fname: "claim_type", width: 100, allowSort: true});
};
