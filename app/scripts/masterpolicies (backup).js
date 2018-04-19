// ****************************************************************************************************
// Last modified on
// 25-OCT-2014 ihms.0.0.1.3
// ****************************************************************************************************
//==================================================================================================
// File name: masterpolicies.js
//==================================================================================================
function CreateSubPage(params){
	return new MasterPoliciesView({
		container: params.container
	})
};

function CreateSubPagex(params){
	return new MasterPolicies(params)
};

Class.Inherits(MasterPolicies, SubPageTable);
function MasterPolicies(Params) {
	MasterPolicies.prototype.parent.call(this, Params);
};

MasterPolicies.prototype.classID = "MasterPolicies";
MasterPolicies.prototype.dataSource = "masterpolicies";
MasterPolicies.prototype.showToolbar = true;
MasterPolicies.prototype.horzScroll = true;
MasterPolicies.prototype.showPager = true;
MasterPolicies.prototype.showSummary = false;

MasterPolicies.prototype.InitializeGrid = function(grid) {
	MasterPolicies.prototype.parent.prototype.InitializeGrid.call(this, grid);
	
	grid.options.allowSort = true;
	grid.options.showBand = true;
	grid.options.showSelection = true;
	
	grid.optionsData.editCallback = function(grid, id) {
		__masterpolicy(id);
	};
	
	grid.Methods.add("deleteConfirm", function(grid, id) {
		return {
			title: "Delete Master Policy",
			message: ("Please confirm to delete document master policy <b>{0}</b>.").format(grid.dataset.lookup(parseInt(id), "policy_number"))
		}
	});
	
	grid.Events.OnInitRow.add(function(grid, row) {
		if(grid.dataset.get("expired")) row.attr("expired", 1);
	});
}

MasterPolicies.prototype.InitializeQuery = function(data) {
	MasterPolicies.prototype.parent.prototype.InitializeQuery.call(this, data);
	data
		.addColumn("page", 1, {numeric:true})
		.addColumn("pagesize", 25, {numeric:true})
		.addColumn("sort", "policy_number")
		.addColumn("order", "asc")
		.addColumn("filter", "")
		// .addColumn("broker_ids", "1022689")
		.addColumn("broker_ids", "1022690")
};

MasterPolicies.prototype.InitializeTableData = function(data) {
	MasterPolicies.prototype.parent.prototype.InitializeTableData.call(this, data);
	data.Columns
		.setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("broker_name", {label:"Broker", required:true})
		.setprops("policy_number", {label:"Policy No.", required:true})
		.setprops("underwriting_currency", {label:"U/W Currency"})
		.setprops("underwriting_year", {label:"U/W Year"})
		.setprops("effective_date", {label:"Effective Date", type:"date", required:true})
		.setprops("expiry_date", {label:"Expiry Date", type:"date", required:true})
		.setprops("status", {label:"Status"})
		.setprops("expired", {label:"Expired"})
		.setprops("plan_name", {label:"Type", required:true})
		// .setprops("plan_description", {label:"Description", type:"memo"})
		.setprops("plan_description", {label:"Description", required:true})
		.setprops("plan_currency", {label:"Plan Currency", required:true})
};

MasterPolicies.prototype.InitializeEditData = function(data) {
	MasterPolicies.prototype.parent.prototype.InitializeEditData.call(this, data);
	this.InitializeTableData(data); // same fields so use the properties set in InitializeTableData
	data.Columns
		// .setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("broker_name", {label:"Broker's Name"})
		// .setprops("policy_number", {label:"Policy No."})
		// .setprops("underwriting_currency", {label:"U/W Currency"})
		// .setprops("underwriting_year", {label:"U/W Year"})
		// .setprops("effective_date", {label:"Effective Date", type:"date"})
		// .setprops("expiry_date", {label:"Expiry Date", type:"date"})
		// .setprops("status", {label:"Status"})
		// .setprops("expired", {label:"Expired"})
		// .setprops("plan_name", {label:"Type"})
		// .setprops("plan_description", {label:"Description"})
		// .setprops("plan_currency", {label:"Currency"})
};

MasterPolicies.prototype.InitializeEditor = function(editor) {
	MasterPolicies.prototype.parent.prototype.InitializeEditor.call(this, editor);
	// editor.NewEdit("General", function(editor, tab) {
	editor.NewGroupEdit("General", function(editor, tab) {
		editor.AddGroup("Master Policy", function(editor) {
			editor.AddEdit("policy_number");
			// editor.AddEdit("policy_number", {password:true});
			editor.AddEdit("plan_name");
			editor.AddEdit("plan_description");
			// editor.AddEdit("plan_currency");
			editor.AddLookup("plan_currency", {width: 400,height: 200,init: CurrencyLookup
			// editor.AddLookup("plan_currency", {height: 200,init: CurrencyLookup
			editor.AddLookup("underwriting_currency", {width: 400,height: 200,init: CurrencyLookup
			});
		});
		editor.AddGroup("Dates", function(editor) {
			editor.AddEdit({ID: "effective_date"});
			editor.AddEdit({ID: "expiry_date"});
			editor.AddEdit({ID: "underwriting_year"});
		});
	});
	// pg.NewEdit("Master Policies", function(editor, tab) {
		// editor.AddEdit({ID: "policy_number"});
	// });
	// pg.NewContainer("Notes", function(container, tab) {
		// container.css("height", 100);
		// editor.AddEdit({ID: "policy_number"});
	// });
	// pg.NewEdit("Brokers", function(editor, tab) {
		// editor.AddEdit({ID: "plan_description"});
	// });
};

MasterPolicies.prototype.InitializeColumns = function(grid) {
	MasterPolicies.prototype.parent.prototype.InitializeColumns.call(this, grid);
	// grid.NewBand("Policy");
	// grid.NewColumn({id:"col_00", float:"left", width: 30, caption:"", fixedWidth:true,
		// drawHeader: function(container) {
			// container.css("text-align", "center");
			// CreateElement("img", container).attr("src", "/engine/images/data-open.png");
		// },
		// drawContent: function(container) {
			// container.css("text-align", "center");
			// container.html("");
			// CreateElement("img", container).attr("src", "/engine/images/data-open.png");
		// }
	// });

	// grid.NewCommand({command:"open", float: grid.owner.horzScroll ? "left" : ""});
	// grid.NewColumn({fname: "policy_number", width: 150, allowSort: true, float: grid.owner.horzScroll ? "left" : ""});
	// grid.NewColumn({fname: "broker_name", width: 200, allowSort: true});
	// grid.NewColumn({fname: "underwriting_currency", width: 100});
	// grid.NewColumn({fname: "underwriting_year", width: 75});
	// grid.NewColumn({fname: "effective_date", width: 125});
	// grid.NewColumn({fname: "expiry_date", width: 125});
	// grid.NewColumn({fname: "status", width: 100});
	// grid.NewColumn({fname: "expired", width: 75});
	// grid.NewColumn({fname: "plan_name", width: 300, allowSort: true});
	// grid.NewColumn({fname: "plan_description", width: 400});
	// grid.NewColumn({fname: "plan_currency", width: 100});
	
	// grid.NewCommand({command: "open", float:"left", width: 30});
	// grid.NewCommand({command:"select", float: grid.owner.horzScroll ? "left" : ""});
	
	// return;
	grid.NewCommand({command:"open", float: grid.owner.horzScroll ? "left" : ""});
	
	grid.InitBands("", function(band) {
		band.NewColumn({fname: "broker_name", width: 200, allowSort: true});
		// band.NewColumn({fname: "broker_name", width: 200, allowSort: true, float: grid.owner.horzScroll ? "left" : ""});
	});
	
	grid.InitBands("Master Policy", function(band) {
		band.InitBands("", function(band) {
			band.NewColumn({fname: "policy_number", width: 100, allowSort: true});
		};
		
		band.InitBands("Underwriting Test Header to Scroll", function(band) {
			band.NewColumn({fname: "underwriting_currency", width: 100});
			band.NewColumn({fname: "underwriting_year", width: 75});
		});
		band.InitBands("Date", function(band) {
			band.NewColumn({fname: "effective_date", width: 125});
			band.NewColumn({fname: "expiry_date", width: 125});
		});
		band.InitBands("Status", function(band) {
			band.NewColumn({fname: "status", width: 100});
			band.NewColumn({fname: "expired", width: 75});
		});
		band.InitBands("Plan", function(band) {
			band.NewColumn({fname: "plan_name", width: 300, allowSort: true});
			band.NewColumn({fname: "plan_description", width: 400});
			band.NewColumn({fname: "plan_currency", width: 100});
		});
	});
	return;
	
	var band = grid.NewBand("");
	// var band = grid;
	
	// grid.NewColumn({fname: "broker_name", width: 200, allowSort: true});
	
	var band2 = grid.NewBand("Master Policy");
	var band2a = band2.NewBand("1");
	// var band2a1 = band2a.NewBand("1a");
	var band2a1 = band2a;
	band2a1.NewColumn({fname: "policy_number", width: 150, allowSort: true});
	
	// var band2ab = band2a.NewBand("1b");
	var band2ab = band2a;
	
	var band2b = band2.NewBand("2");
	return;

	
	// var band2 = grid;
	var band2a = band2;
	// var band2a = band2.NewBand("1");
	// var band2a1 = band2a.NewBand("1");
	var band2a1 = band2a;
	
	
	// var band2a2 = band2a.NewBand("2");
	// var band2a2 = band2a.NewBand("2");
	// var band2a2 = grid;
	var band2a2 = band2a1;
	
	var band2b = grid;
	// var band2b = grid.NewBand("Date");
	// var band2b = grid.NewBand("Date");
	
	// var band3 = grid.NewBand("Status");
	var band3 = grid;
	
	// grid.NewColumn({fname: "plan_name", width: 300, allowSort: true});
	// grid.NewColumn({fname: "plan_description", width: 400});
	// grid.NewColumn({fname: "plan_currency", width: 100});

	// grid.NewColumn({id:"col_01", width: 100, caption:"ID"});
	// grid.NewColumn({id:"col_02", width: 250, caption:"Last Name"});
	// grid.NewColumn({id:"col_03", width: 250, caption:"First Name"});
	// grid.NewColumn({id:"col_04", width: 150, caption:"DOB"});
	// grid.NewColumn({id:"col_05", width: 400, caption:"Address"});
};
	