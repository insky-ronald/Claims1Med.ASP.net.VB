// ****************************************************************************************************
// Last modified on
// 17-MAY-2018
// ****************************************************************************************************
//==================================================================================================
// File name: report-2003.js
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
TabularReportView.prototype.viewCss = "utilization report";
TabularReportView.prototype.viewUrl = "app/report-2003";
TabularReportView.prototype.searchWidth = 800;
TabularReportView.prototype.exportName = "Utilization Report";
TabularReportView.prototype.exportSource = "DBReporting.RunReport";
TabularReportView.prototype.popuMenuTitle = "Utilization";

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
		.addColumn("sort", "policy_name")
		.addColumn("order", "asc")

	dataset.Events.OnResetSearch.add(function(dataset, grid) {
		//Clients
		dataset.set("client_ids", "");
		//Claim
		dataset.set("claim_no", "");
		dataset.set("invoice_no", "");
		dataset.set("status_codes", "");
		// dataset.set("status", "");
		dataset.set("claim_sub_types", ""); //Service Type
		// dataset.set("claim_sub_type", ""); //Service Type
		//Treatment Date
		dataset.set("treatment_date_start", ""); 
		dataset.set("treatment_date_end", ""); 
		//Policy
		dataset.set("policy_nos", ""); 
		// dataset.set("policy_no", ""); 
		// dataset.set("policy_name", ""); 
		//Provider
		dataset.set("provider_ids", ""); 
		// dataset.set("provider_name", ""); 
		dataset.set("physician_ids", ""); 
		// dataset.set("physician", ""); 
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
		.setprops("status_codes", {label:"Status"})
		// .setprops("status", {label:"Status"})
		.setprops("claim_sub_types", {label:"Claim Type"})
		// .setprops("claim_sub_type", {label:"Service Type"})
		//Treatment Date
		.setprops("treatment_date_start", {label:"Start", type:"date"})
		.setprops("treatment_date_end", {label:"End", type:"date"})
		//Policy
		.setprops("policy_nos", {label:"Policy No."})
		// .setprops("policy_no", {label:"Policy No."})
		// .setprops("policy_name", {label:"Policy Holder"})
		//Provider
		.setprops("provider_ids", {label:"Provider Name"})
		// .setprops("provider_name", {label:"Provider Name"})
		.setprops("physician_ids", {label:"Doctor Name"})
		// .setprops("physician", {label:"Doctor Name"})
};

TabularReportView.prototype.OnInitSearchEditor = function(editor) {
	TabularReportView.prototype.parent.prototype.OnInitSearchEditor.call(this, editor);

	editor.NewGroupEdit({caption:"Report"}, function(editor, tab) {
		tab.container.css("border", "1px silver");
		tab.container.css("border-style", "solid solid none solid");

		editor.AddGroup("Claim", function(editor) {
			editor.AddText("claim_no");
			editor.AddText("service_no");
			// editor.AddLookup("status", {width:400, height:250, init:InvoiceStatusLookup});
			// editor.AddLookup("claim_sub_type", {width:400, height:250, init:AllServiceTypesLookup});
		});
		
		editor.AddGroup("Treatment Date", function(editor) {
			editor.AddDate("treatment_date_start");
			editor.AddDate("treatment_date_end");
		});
		
		// editor.AddGroup("Policy", function(editor) {
			// editor.AddText("policy_no");
			// editor.AddText("policy_name");
		// });
		
		// editor.AddGroup("Provider", function(editor) {
			// editor.AddText("provider_name");
			// editor.AddText("physician");
		// });
	});

	editor.NewSubSelectionView("Clients", 300, "client_ids", ClientsLookupView);
	editor.NewSubSelectionView("Service Status", 300, "status_codes", InvoiceStatusLookupView);
	editor.NewSubSelectionView("Service Type", 300, "claim_sub_types", AllServiceTypesLookupView);
	editor.NewSubSelectionView("Policy No.", 300, "policy_nos", PolicyNoLookupView);
	editor.NewSubSelectionView("Provider", 300, "provider_ids", ProviderIdsLookupView);
	editor.NewSubSelectionView("Doctor", 300, "physician_ids", DoctorIdsLookupView);
};

TabularReportView.prototype.OnInitData = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitData.call(this, dataset);

	dataset.Columns
		.setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("policy_name", {label:"Policy Name", required:true})
		.setprops("policy_no", {label:"Policy No.", required:true})
		.setprops("claim_no", {label:"Claim No.", required:true})
		.setprops("patient", {label:"Patient Name"})
		.setprops("service_no", {label:"Service No.", required:true})
		.setprops("treatment_date", {label:"Treatment Date", type:"date", required:true})
		.setprops("icd_code", {label:"ICD Code"})
		.setprops("diagnosis", {label:"Diagnosis"})
		.setprops("provider_name", {label:"Provider Name"})
		.setprops("physician", {label:"Physician"})
		.setprops("length_of_stay", {label:"Length of Staty"})
		.setprops("claim_type", {label:"Claim Type"})
		.setprops("age", {label:"Age", numeric:true})
		.setprops("age_band", {label:"Age Band"}) 
		.setprops("status_description", {label:"Status"})
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
	this.addFilterDisplay({name:"status_codes", caption:"Status", operator:"is"});
	// this.addFilterDisplay({name:"status", caption:"Status", operator:"is"});
	this.addFilterDisplay({name:"claim_sub_types", caption:"Claim Type", operator:"is"});
	// this.addFilterDisplay({name:"claim_sub_type", caption:"Service Type", operator:"is"});
	this.addFilterDisplay({name:"treatment_date_start", caption:"Treatment Start Date", operator:">="});
	this.addFilterDisplay({name:"treatment_date_end", caption:"Treatment End Date", operator:"<="});
	this.addFilterDisplay({name:"policy_nos", caption:"Policy No.", operator:"is"});
	// this.addFilterDisplay({name:"policy_no", caption:"Policy No.", operator:"is"});
	// this.addFilterDisplay({name:"policy_name", caption:"Policy Holder.", operator:"is"});
	this.addFilterDisplay({name:"provider_ids", caption:"Provider ID", operator:"is"});
	// this.addFilterDisplay({name:"provider_name", caption:"Provider Name", operator:"is"});
	this.addFilterDisplay({name:"physician_ids", caption:"Doctor ID", operator:"is"});
	// this.addFilterDisplay({name:"physician", caption:"Doctor Name", operator:"is"});
};

TabularReportView.prototype.OnInitColumns = function(grid) {
	TabularReportView.prototype.parent.prototype.OnInitColumns.call(this, grid);

	// grid.NewColumn({fname: "policy_name", width: 150, allowSort: true, linkField:"policy_name"});
	grid.NewColumn({fname: "policy_name", width: 150, allowSort: true});
	grid.NewColumn({fname: "policy_no", width: 100, allowSort: true});
	// grid.NewColumn({fname: "claim_no", width: 100, allowSort: true, linkField:"claim_no"});
	grid.NewColumn({fname: "claim_no", width: 100, allowSort: true});
	grid.NewColumn({fname: "patient", width: 250, allowSort: true});
	grid.NewColumn({fname: "service_no", width: 150, allowSort: true});
	grid.NewColumn({fname: "treatment_date", width: 125, allowSort: true});
	grid.NewColumn({fname: "icd_code", width: 100, allowSort: true});
	grid.NewColumn({fname: "diagnosis", width: 250, allowSort: true});
	grid.NewColumn({fname: "provider_name", width: 250, allowSort: true});
	grid.NewColumn({fname: "physician", width: 150, allowSort: true});
	grid.NewColumn({fname: "length_of_stay", width: 150, allowSort: true});
	grid.NewColumn({fname: "claim_type", width: 250, allowSort: true});
	grid.NewColumn({fname: "age", width: 50, allowSort: true});
	grid.NewColumn({fname: "age_band", width: 100, allowSort: true});
	grid.NewColumn({fname: "status_description", width: 150, allowSort: true});
};
