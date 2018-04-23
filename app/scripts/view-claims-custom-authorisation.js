// ****************************************************************************************************
// Last modified on
// 8-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-claims-custom-authorisation.js
//==================================================================================================
Class.Inherits(jCustomAuthorisationView, jCustomSavedQueryView);
function jCustomAuthorisationView(params) {
    jCustomAuthorisationView.prototype.parent.call(this, params);
};

jCustomAuthorisationView.prototype.classID = "jCustomAuthorisationView";
jCustomAuthorisationView.prototype.viewCss = "authorisation";
jCustomAuthorisationView.prototype.viewUrl = "app/claims-authorisation";
jCustomAuthorisationView.prototype.searchWidth = 650;
jCustomAuthorisationView.prototype.exportName = "Claims Authorisation";
jCustomAuthorisationView.prototype.exportSource = "DBClaims.GetClaimsAuthorisation";
jCustomAuthorisationView.prototype.popuMenuTitle = "Authorisation";

jCustomAuthorisationView.prototype.initialize = function(params) {
	jCustomAuthorisationView.prototype.parent.prototype.initialize.call(this, params);
	this.referral = params.requestParams.referral;
};

jCustomAuthorisationView.prototype.OnInitGrid = function(grid) {
	jCustomAuthorisationView.prototype.parent.prototype.OnInitGrid.call(this, grid);
	// grid.options.editNewPage = true;
};

jCustomAuthorisationView.prototype.OnInitDataRequest = function(dataset) {
	jCustomAuthorisationView.prototype.parent.prototype.OnInitDataRequest.call(this, dataset);
	
	dataset
		.addColumn("page", 1, {numeric:true})
		.addColumn("pagesize", 25, {numeric:true})
		.addColumn("sort", "service_no")
		.addColumn("order", "asc")
		// .addColumn("show_only_selected", 0, {numeric:true})
		.addColumn("claim_no", "")
		.addColumn("client_ids", "")
		// .addColumn("broker_ids", "")
		// .addColumn("plan_ids", "")
		// .addColumn("settlement_currency_codes", "")
		// .addColumn("client_currency_codes", "")
		// .addColumn("user_names", "")
};

jCustomAuthorisationView.prototype.OnInitSearchData = function(dataset) {
	jCustomAuthorisationView.prototype.parent.prototype.OnInitSearchData.call(this, dataset);
	
	dataset.Columns
		// .setprops("show_only_selected", {label: "Selected", numeric:true})
		.setprops("claim_no", {label:"Claim No."})
		.setprops("invoice_no", {label:"Invoice No."})
		.setprops("client_ids")
		// .setprops("policy_ids")
		// .setprops("broker_ids")
		// .setprops("plan_ids")
		// .setprops("settlement_currency_codes")
		// .setprops("client_currency_codes")
		// .setprops("user_names")
};

jCustomAuthorisationView.prototype.OnInitSearchEditorGeneral = function(editor) {
};

jCustomAuthorisationView.prototype.OnInitSearchEditorLookups = function(editor) {
	editor.NewSubSelectionView("Clients", 300, "client_ids", ClientsLookupView);
	// editor.NewSubSelectionView("Master Policies", 300, "policy_ids", MasterPoliciesLookupView);
	// editor.NewSubSelectionView("Brokers", 300, "broker_ids", BrokersLookupView);
	// editor.NewSubSelectionView("Settlement Currencies", 300, "settlement_currency_codes", CurrenciesLookupView);
	// editor.NewSubSelectionView("Client Currencies", 300, "client_currency_codes", CurrenciesLookupView);
	// editor.NewSubSelectionView("Users", 300, "user_names", UsersLookupView);
};

jCustomAuthorisationView.prototype.OnInitSearchEditor = function(editor) {
	jCustomAuthorisationView.prototype.parent.prototype.OnInitSearchEditor.call(this, editor);
	
	var self = this;
	
	editor.NewGroupEdit({caption:"General"}, function(editor, tab) {
		tab.container.css("border", "1px silver");
		tab.container.css("border-style", "solid solid none solid");
		
		self.OnInitSearchEditorGeneral(editor);
	});

	self.OnInitSearchEditorLookups(editor);
};

jCustomAuthorisationView.prototype.OnResetSearch = function(dataset) {
	// dataset.set("show_only_selected", 0);
};

jCustomAuthorisationView.prototype.OnInitData = function(dataset) {
	jCustomAuthorisationView.prototype.parent.prototype.OnInitData.call(this, dataset);
};

jCustomAuthorisationView.prototype.OnInitSummaryData = function(dataset) {
	jCustomAuthorisationView.prototype.parent.prototype.OnInitSummaryData.call(this, dataset);
};

jCustomAuthorisationView.prototype.OnInitRow = function(row) {
	jCustomAuthorisationView.prototype.parent.prototype.OnInitRow.call(this, row);
	
	// if(this.grid.dataset.get("Selected")) row.attr("x-select", "1");
};

jCustomAuthorisationView.prototype.OnInitMethods = function(grid) {
	jCustomAuthorisationView.prototype.parent.prototype.OnInitMethods.call(this, grid);
	
	var self = this;
	
	grid.methods.add("getCommandIcon", function(grid, column, previous) {
		if(column.command === "select") {
			if(grid.dataset.get("Selected")
				return "select,1"
			else
				return "un-select,0"
		} else if(column.command === "selected")
			return "close"
		else if(column.command === "un-selected")
			return "checkbox-marked-circle-outline"
		else
			return previous
		
	});
				
	grid.methods.add("allowCommand", function(grid, column, previous) {
		if(column.command === "selected")
			return grid.dataset.get("Selected")
		else if(column.command === "un-selected")
			return !grid.dataset.get("Selected")
		else
			return previous				
	});
	
	grid.methods.add("getCommandHint", function(grid, column, previous) {
		if(column.command === "selected")
			return "Un-select the payment for authorisation"
		else if(column.command === "un-selected")
			return "Select the payment for authorisation"
		else
			return previous
		
	});
	
	grid.methods.add("getLinkUrl", function(grid, params, previous) {
		if(params.column.linkField === "claim_id")
			return __claim(params.id, true)
		else if(params.column.linkField === "service_id")
			return __invoice(params.id, true)
		else if(params.column.linkField === "client_id")
			return __client(params.id, true)
		else if(params.column.linkField === "PolicyID")
			return __masterpolicy(params.id, true)
		else
			return previous
	});
};

jCustomAuthorisationView.prototype.OnPopupMenuCommands = function(menu) {
	jCustomAuthorisationView.prototype.parent.prototype.OnPopupMenuCommands.call(this, menu);
};

jCustomAuthorisationView.prototype.OnPopupMenu = function(menu) {
	jCustomAuthorisationView.prototype.parent.prototype.OnPopupMenu.call(this, menu);
	
	var self = this;
	var grid = this.grid;
	
	if(grid.methods.call("allowSelection")) {
		var m = menu.add(this.popuMenuTitle)
		
		if(grid.dataset.get("Selected"))
			m.addCommand("Un-Select", "", "close")
		else
			m.addCommand("Select", "", "checkbox-marked-circle-outline");
		
		this.OnPopupMenuCommands(m);
	};
	
	
	menu.add("Links")
		.add(("Open claim <b>{0}</b>").format(grid.dataset.get("claim_no")), __claim(grid.dataset.get("claim_id"), true), "db-open")
		.add(("Open invoice <b>{0}</b>").format(grid.dataset.get("service_no")), __invoice(grid.dataset.get("service_id"), true), "db-open")
		.add(("Open client <b>{0}</b>").format(grid.dataset.get("client_name")), __client(grid.dataset.get("client_id"), true), "db-open")
		
	// menu.add("Client and Master Policy")
	// menu.add("Client")
		// .add(("Open client <b>{0}</b>").format(grid.dataset.get("ClientName")), __client(grid.dataset.get("client_id"), true), "db-open")
		// .add(("Open master policy <b>{0}</b>").format(grid.dataset.get("PolicyNo")), __masterpolicy(grid.dataset.get("policy_id"), true), "db-open")
};

jCustomAuthorisationView.prototype.OnDrawCustomHeader = function(container) {
	jCustomAuthorisationView.prototype.parent.prototype.OnDrawCustomHeader.call(this, container);

	var self = this;
	var grid = this.grid;
	
	this.dashboard = CreateElementEx("div", container, function(dsahboard) {
		CreateElementEx("div", dsahboard, function(container) {
			container.addClass("widget");
			container.addClass("total");
			CreateElementEx("div", container, function(title) {
				title.attr("x-sec", "title")
				CreateElement("h1", title).html(grid.footerData.get("row_count"))
				// CreateElement("h1", title).html(241)
				CreateElement("p", title).html("Total Records")
			});
			
			desktop.svg.draw(CreateElement("div", container).attr("x-sec", "icon"), "table");
		});
		
		// CreateElementEx("div", dsahboard, function(container) {
			// container.addClass("widget");
			// container.addClass("selected");
			// CreateElementEx("div", container, function(title) {
				// title.attr("x-sec", "title")
				// CreateElement("h1", title).html(grid.footerData.get("Selected"))
				// CreateElement("h1", title).html(6)
				// CreateElement("p", title).html("Records Selected")
			// });
			
			// desktop.svg.draw(CreateElement("div", container).attr("x-sec", "icon"), "checkbox-marked-circle-outline");
		// });
	}, "dashboard");
	
	this.addFilterDisplay({name:"claim_no", caption:"Claim No.", operator:"is"});
	this.addFilterDisplay({name:"invoice_no", caption:"Invoice No.", operator:"is"});
	this.addFilterDisplay({name:"client_ids", caption:"Client ID", operator:"is"});
	// this.addFilterDisplay({name:"policy_ids", caption:"Master Policy ID", operator:"is"});
	// this.addFilterDisplay({name:"broker_ids", caption:"Broker ID", operator:"is"});
	// this.addFilterDisplay({name:"settlement_currency_codes", caption:"Settlement Currency", operator:"is"});
	// this.addFilterDisplay({name:"client_currency_codes", caption:"Client Currency", operator:"is"});
	// this.addFilterDisplay({name:"user_names", caption:"User", operator:"is"});
	// if(this.grid.dataParams.get("show_only_selected")) {
		// this.addFilterDisplay({displayText:"Showing only selected"});
	// }
};

jCustomAuthorisationView.prototype.OnInitColumns = function(grid) {
	jCustomAuthorisationView.prototype.parent.prototype.OnInitColumns.call(this, grid);
	
	var self = this;
	
	if(grid.methods.call("allowSelection")) {
		grid.NewBand({fixed:"left"}, function(band) {
			band.NewCommand({command:"select"});
		})
		// grid.NewBand({caption:"Select", fixed:"left"}, function(band) {
			// band.NewCommand({command:"selected"});
			// band.NewCommand({command:"un-selected"});
		// })
	};
};
