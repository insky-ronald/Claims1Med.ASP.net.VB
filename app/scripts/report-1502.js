// ****************************************************************************************************
// Last modified on
// 2-JUN-2018
// ****************************************************************************************************
//==================================================================================================
// File name: report-1502.js
//==================================================================================================
function ReportView(viewParams) {
	return new TabularReportView({container:viewParams.container, reporttID: parseInt(viewParams.requestParams.report_id)});
};

Class.Inherits(TabularReportView, jCustomSavedQueryView);
function TabularReportView(params) {
    TabularReportView.prototype.parent.call(this, params);
};

TabularReportView.prototype.classID = "TabularReportView";
TabularReportView.prototype.viewCss = "claim cummulative by invoice item report";
TabularReportView.prototype.viewUrl = "app/report-1502";
TabularReportView.prototype.searchWidth = 600;
TabularReportView.prototype.exportName = "Claim Cummulative Report - Invoice Item";
TabularReportView.prototype.exportSource = "DBReporting.RunReport";
TabularReportView.prototype.popuMenuTitle = "Invoice";

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
		.addColumn("pagesize", 50, {numeric:true})
		.addColumn("sort", "certificate_id")
		.addColumn("order", "asc")

	dataset.Events.OnResetSearch.add(function(dataset, grid) {
		//General
		dataset.set("user_names", "")
		//Client
		dataset.set("client_ids", "")
		//Invoice Status
		dataset.set("invoice_status", "")
		dataset.set("invoice_status_code", "")
		dataset.set("invoice_sub_status", "")
		//Dates
		dataset.set("status_date", "")
		dataset.set("incident_date", "")
		dataset.set("notification_date", "")
	})
};

TabularReportView.prototype.OnInitSearchData = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitSearchData.call(this, dataset);
	dataset.Columns
		.setprops("user_names", {label:"Users"})
		
		.setprops("client_ids", {label:"Client ID"})
		
		.setprops("invoice_status", {label:"Status"})
		.setprops("invoice_status_code", {label:"Status Code"})
		.setprops("invoice_sub_status", {label:"Sub-Status"})
		
		.setprops("status_date", {label:"Status Date", type:"date"})
		.setprops("incident_date", {label:"Incident Date", type:"date"})
		.setprops("notification_date", {label:"Notification Date", type:"date"})
};

TabularReportView.prototype.OnInitSearchEditor = function(editor) {
	TabularReportView.prototype.parent.prototype.OnInitSearchEditor.call(this, editor);

	editor.NewGroupEdit({caption:"Report"}, function(editor, tab) {
		tab.container.css("border", "1px silver");
		tab.container.css("border-style", "solid solid none solid");
		
		editor.AddGroup("Invoice Status", function(editor) {
			editor.AddDropDown("invoice_status", {width:425, height:350, disableEdit:false, init:InvoiceStatusLookup, 
				lookup: function(grid) {
					grid.Events.OnSelectLookup.add(function(grid, key) {
						//for TabularReportView, use Dataset instead of dataset
						editor.Dataset.set("invoice_status", grid.dataset.lookup(key, "status"));
						editor.Dataset.set("invoice_status_code", grid.dataset.lookup(key, "status_code"));
					});
				}
			});
			
			editor.AddDropDown("invoice_sub_status", {width:425, height:350, disableEdit:false, init:InvoiceSubStatusLookup, 
				lookup: function(grid) {
					grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
						if (editor.Dataset.raw("invoice_status") === "") {
							dataParams.set("status_code", "");
						} else {
														//for TabularReportView, use Dataset instead of dataset
							dataParams.set("status_code", editor.Dataset.raw("invoice_status_code"));
						};
					});
					
					grid.Events.OnSelectLookup.add(function(grid, key) {
						//for TabularReportView, use Dataset instead of dataset
						editor.Dataset.set("invoice_sub_status", grid.dataset.lookup(key, "sub_status_code"));
					});
				}
			});
		});
		
		editor.AddGroup("Dates", function(editor) {
			editor.AddDate("status_date");
			editor.AddDate("incident_date");
			editor.AddDate("notification_date");
		});
	});

	editor.NewSubSelectionView("Users", 300, "user_names", UserNamesLookupView);
	editor.NewSubSelectionView("Clients", 300, "client_ids", ClientsLookupView);
	// editor.NewSubSelectionView("Service Types", 300, "service_types", CustomerServiceTypeCodesLookupView);
	// editor.NewSubSelectionView("Status", 300, "sub_status_codes", CustomerServiceStatusCodesLookupView);
};

TabularReportView.prototype.OnInitData = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitData.call(this, dataset);

	dataset.Columns
		// .setprops("client_id", {label:"Client ID", numeric:true})
		// .setprops("client_name", {label:"Client Name"})
		// .setprops("product_code", {label:"Product Code"})
		// .setprops("product_name", {label:"Product Name"})
		.setprops("claim_id", {label:"Claim ID", numeric:true, key: true})
		.setprops("scheme_code", {label:"Scheme Code"})
		.setprops("scheme", {label:"Scheme"})
		.setprops("certificate_id", {label:"Certificate ID"})
		.setprops("policy_purchased_date", {label:"Policy Purchased Date", type:"date"})
		.setprops("policy_start_date", {label:"Policy Start Date", type:"date"})
		.setprops("policy_expiry_date", {label:"Policy Expiry Date", type:"date"})
		.setprops("last_name", {label:"Last Name"})
		.setprops("first_name", {label:"First Name"})
		.setprops("gender", {label:"Gender"})
		.setprops("dob", {label:"DOB", type:"date"})
		.setprops("claim_no", {label:"Claim No."})
		.setprops("incident_date", {label:"Incident Date", type:"date"})
		.setprops("area_of_loss", {label:"Area of Loss"})
		.setprops("invoice_date", {label:"Invoice Date", type:"date"})
		.setprops("notification_date", {label:"Notification Date", type:"date"})
		.setprops("benefit", {label:"Benefit"})
		.setprops("benefit_desc", {label:"Description"})
		.setprops("invoice_currency", {label:"Invoice Currency"})
		.setprops("claimed_amount", {label:"Amount Claimed", numeric:true, type:"money", format:"00"})
		.setprops("client_currency", {label:"Client Currency"})
		.setprops("client_amount", {label:"Amount Claimed", numeric:true, type:"money", format:"00"})
		.setprops("excess_amount", {label:"Excess", numeric:true, format:"00"})
		.setprops("paid_amount", {label:"Amount Paid", numeric:true, type:"money", format:"00"})
		.setprops("invoice_sub_status_code", {label:"Sub Status"})
		.setprops("status_date", {label:"Status Date", type:"date"})
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
		// if(params.column.linkField === "member_id") {
			// return __member(params.id, true)
		// } else if(params.column.linkField === "client_id") {
			// return __client(params.id, true)
		// } else if(params.column.linkField === "product_code") {
			// return __product(params.id, true)
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

	this.addFilterDisplay({name:"user_names", caption:"User", operator:"is"});
	this.addFilterDisplay({name:"client_ids", caption:"Client ID", operator:"is"});
	this.addFilterDisplay({name:"invoice_status", caption:"Invoice Status", operator:"is"});
	this.addFilterDisplay({name:"invoice_status_code", caption:"Invoice Status Code", operator:"is"});
	this.addFilterDisplay({name:"invoice_sub_status", caption:"Invoice Sub-Status", operator:"is"});
	this.addFilterDisplay({name:"status_date", caption:"Status Date", operator:"is"});
	this.addFilterDisplay({name:"incident_date", caption:"Incident Date", operator:"is"});
	this.addFilterDisplay({name:"notification_date", caption:"Notification Date", operator:"is"});
};

TabularReportView.prototype.OnInitColumns = function(grid) {
	TabularReportView.prototype.parent.prototype.OnInitColumns.call(this, grid);

	grid.NewColumn({fname: "scheme_code", width: 75, allowSort: false});
	grid.NewColumn({fname: "scheme", width: 100, allowSort: false});
	grid.NewColumn({fname: "certificate_id", width: 100, allowSort: true});
	grid.NewColumn({fname: "policy_purchased_date", width: 125, allowSort: false});
	grid.NewColumn({fname: "policy_start_date", width: 125, allowSort: false});
	grid.NewColumn({fname: "policy_expiry_date", width: 100, allowSort: false});
	grid.NewColumn({fname: "last_name", width: 150, allowSort: false});
	grid.NewColumn({fname: "first_name", width: 200, allowSort: false});
	grid.NewColumn({fname: "gender", width: 50, allowSort: false});
	grid.NewColumn({fname: "dob", width: 100, allowSort: false});
	grid.NewColumn({fname: "claim_no", width: 125, allowSort: false});
	grid.NewColumn({fname: "incident_date", width: 125, allowSort: true});
	grid.NewColumn({fname: "area_of_loss", width: 100, allowSort: false});
	grid.NewColumn({fname: "invoice_date", width: 100, allowSort: false});
	grid.NewColumn({fname: "notification_date", width: 125, allowSort: true});
	grid.NewColumn({fname: "benefit", width: 185, allowSort: false});
	grid.NewColumn({fname: "benefit_desc", width: 185, allowSort: false});
	grid.NewColumn({fname: "invoice_currency", width: 100, allowSort: false});
	grid.NewColumn({fname: "claimed_amount", width: 100, allowSort: false});
	grid.NewColumn({fname: "client_currency", width: 100, allowSort: false});
	grid.NewColumn({fname: "client_amount", width: 100, allowSort: false});
	grid.NewColumn({fname: "excess", width: 75, allowSort: false});
	grid.NewColumn({fname: "paid_amount", width: 100, allowSort: false});
	grid.NewColumn({fname: "invoice_sub_status_code", width: 75, allowSort: false});
	grid.NewColumn({fname: "status_date", width: 100, allowSort: true});
};
