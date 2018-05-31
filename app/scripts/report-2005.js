// ****************************************************************************************************
// Last modified on
// 26-MAY-2018
// ****************************************************************************************************
//==================================================================================================
// File name: report-2005.js
//==================================================================================================
function ReportView(viewParams) {
	return new TabularReportView({container:viewParams.container, reporttID: parseInt(viewParams.requestParams.report_id)});
};

Class.Inherits(TabularReportView, jCustomSavedQueryView);
function TabularReportView(params) {
    TabularReportView.prototype.parent.call(this, params);
};

TabularReportView.prototype.classID = "TabularReportView";
TabularReportView.prototype.viewCss = "customer service notes report";
TabularReportView.prototype.viewUrl = "app/report-2005";
TabularReportView.prototype.searchWidth = 600;
TabularReportView.prototype.exportName = "Customer Service Notes";
TabularReportView.prototype.exportSource = "DBReporting.RunReport";
TabularReportView.prototype.popuMenuTitle = "Service Notes";

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
		.addColumn("sort", "reference_no")
		.addColumn("order", "asc")

	dataset.Events.OnResetSearch.add(function(dataset, grid) {
		//Customer Service
		dataset.set("reference_no", "")
		dataset.set("service_types", "")
		//Status
		dataset.set("sub_status_codes", "")
		//Call Date
		dataset.set("call_date_start", "")
		dataset.set("call_date_end", "")
		//Note
		dataset.set("note_category", "")
		dataset.set("note_code", "")
		dataset.set("note_sub_category", "")
		//Creation
		dataset.set("note_insert_date_start", "")
		dataset.set("note_insert_date_end", "")
		//Client
		dataset.set("client_ids", "");
		//Member
		dataset.set("member_name", "");
	})
};

TabularReportView.prototype.OnInitSearchData = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitSearchData.call(this, dataset);
	dataset.Columns
		//Customer Service
		.setprops("reference_no", {label:"Reference No."})
		.setprops("service_types", {label:"Service Type"})
		//Status
		.setprops("sub_status_codes", {label:"Status"})
		//Call Date
		.setprops("call_date_start", {label:"Start", type:"date"})
		.setprops("call_date_end", {label:"End", type:"date"})
		//Note
		.setprops("note_category", {label:"Category"})
		.setprops("note_code", {label:"Code"})
		.setprops("note_sub_category", {label:"Sub-Category"})
		//Creation
		.setprops("note_insert_date_start", {label:"Start", type:"date"})
		.setprops("note_insert_date_end", {label:"End", type:"date"})
		//Client
		.setprops("client_ids", {label:"Client ID"})
		//Member
		.setprops("member_name", {label:"Member's Name"})
};

TabularReportView.prototype.OnInitSearchEditor = function(editor) {
	TabularReportView.prototype.parent.prototype.OnInitSearchEditor.call(this, editor);

	editor.NewGroupEdit({caption:"Report"}, function(editor, tab) {
		tab.container.css("border", "1px silver");
		tab.container.css("border-style", "solid solid none solid");
		
		editor.AddGroup("Call Date", function(editor) {
			editor.AddDate("call_date_start");
			editor.AddDate("call_date_end");
		});
		
		editor.AddGroup("Note", function(editor) {
			editor.AddDropDown("note_category", {width:425, height:350, disableEdit:false, init:NoteTypesLookup, 
				lookup: function(grid) {
					grid.Events.OnSelectLookup.add(function(grid, key) {
						//for TabularReportView, use Dataset instead of dataset
						editor.Dataset.set("note_category", grid.dataset.lookup(key, "note_type"));
						editor.Dataset.set("note_code", grid.dataset.lookup(key, "code"));
					});
				}
			});
			
			editor.AddDropDown("note_sub_category", {width:425, height:350, disableEdit:false, init:NoteSubTypesLookup, 
				lookup: function(grid) {
					grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
						if (editor.Dataset.raw("note_category") === "") {
							dataParams.set("note_type", "");
						} else {
														//for TabularReportView, use Dataset instead of dataset
							dataParams.set("note_type", editor.Dataset.raw("note_code"));
						};
					});
					
					grid.Events.OnSelectLookup.add(function(grid, key) {
						//for TabularReportView, use Dataset instead of dataset
						editor.Dataset.set("note_sub_category", grid.dataset.lookup(key, "note_sub_type"));
					});
				}
			});
			// console.log(editor.Dataset.raw("note_category"));
		});
		
		editor.AddGroup("Creation", function(editor) {
			editor.AddDate("note_insert_date_start");
			editor.AddDate("note_insert_date_end");
		});

		editor.AddGroup("Member", function(editor) {
			editor.AddText("member_name");
		});
	});

	editor.NewSubSelectionView("Clients", 300, "client_ids", ClientsLookupView);
	editor.NewSubSelectionView("Service Types", 300, "service_types", CustomerServiceTypeCodesLookupView);
	editor.NewSubSelectionView("Status", 300, "sub_status_codes", CustomerServiceStatusCodesLookupView);
};

TabularReportView.prototype.OnInitData = function(dataset) {
	TabularReportView.prototype.parent.prototype.OnInitData.call(this, dataset);

	dataset.Columns
		.setprops("note_id", {label:"ID", numeric:true, key: true})
		.setprops("invoice_id", {label:"Invoice ID", numeric:true, required:true})
		// .setprops("ip_id", {label:"IP ID", numeric:true, required:true})
		.setprops("client_id", {label:"Client ID", numeric:true, required:true})
		.setprops("reference_no", {label:"Reference No."})
		.setprops("call_date", {label:"Call Date", type:"date", required:true})
		.setprops("note_category", {label:"Category"})
		.setprops("note_sub_category", {label:"Sub-Category"})
		.setprops("notes", {label:"Notes"})
		.setprops("note_insert_date", {label:"Insert Date", type:"date"})
		.setprops("note_insert_user", {label:"Insert User"})
		.setprops("service_type_desc", {label:"Service Type"})
		.setprops("member_name", {label:"Member's Name"})
		.setprops("caller_name", {label:"Caller's Name"})
		.setprops("relationship", {label:"Relationship"})
		.setprops("client_name", {label:"Client's Name"})
		.setprops("main_status", {label:"Status"})
		.setprops("sub_status", {label:"Sub-Status"})
		.setprops("country_code", {label:"Country"})
		.setprops("town", {label:"Town"})
		.setprops("place", {label:"Place"})
		.setprops("phone_no", {label:"Phone No."})
		.setprops("email", {label:"Email"})
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

	this.addFilterDisplay({name:"client_ids", caption:"Client ID", operator:"is"});
	this.addFilterDisplay({name:"service_types", caption:"Service Type", operator:"is"});
	this.addFilterDisplay({name:"sub_status_codes", caption:"Status", operator:"is"});
	this.addFilterDisplay({name:"note_category", caption:"Category", operator:"is"});
	this.addFilterDisplay({name:"note_sub_category", caption:"Sub-Category", operator:"is"});
	this.addFilterDisplay({name:"member_name", caption:"Member's Name", operator:"like"});
};

TabularReportView.prototype.OnInitColumns = function(grid) {
	TabularReportView.prototype.parent.prototype.OnInitColumns.call(this, grid);

	grid.NewColumn({fname: "reference_no", width: 125, allowSort: true});
	grid.NewColumn({fname: "call_date", width: 100, allowSort: true});
	grid.NewColumn({fname: "note_category", width: 125, allowSort: true});
	grid.NewColumn({fname: "note_sub_category", width: 125, allowSort: true});
	grid.NewColumn({fname: "notes", width: 500, allowSort: false});
	grid.NewColumn({fname: "note_insert_date", width: 100, allowSort: false});
	grid.NewColumn({fname: "note_insert_user", width: 100, allowSort: false});
	grid.NewColumn({fname: "service_type_desc", width: 150, allowSort: false});
	grid.NewColumn({fname: "member_name", width: 250, allowSort: false});
	grid.NewColumn({fname: "caller_name", width: 200, allowSort: true});
	grid.NewColumn({fname: "relationship", width: 150, allowSort: true});
	grid.NewColumn({fname: "client_name", width: 200, allowSort: true});
	grid.NewColumn({fname: "main_status", width: 175, allowSort: true});
	grid.NewColumn({fname: "sub_status", width: 175, allowSort: true});
	grid.NewColumn({fname: "country_code", width: 125, allowSort: true});
	grid.NewColumn({fname: "town", width: 150, allowSort: true});
	grid.NewColumn({fname: "place", width: 150, allowSort: true});
	grid.NewColumn({fname: "phone_no", width: 100, allowSort: true});
	grid.NewColumn({fname: "email", width: 150, allowSort: true});
};
