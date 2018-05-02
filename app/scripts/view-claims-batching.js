// ****************************************************************************************************
// Last modified on
// 8-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-claims-batching.js
//==================================================================================================
Class.Inherits(PaymentBatchingView, jCustomAuthorisationView);
function PaymentBatchingView(params) {
    PaymentBatchingView.prototype.parent.call(this, params);
};

PaymentBatchingView.prototype.classID = "PaymentBatchingView";
PaymentBatchingView.prototype.viewCss = "payment-processing authorisation";
PaymentBatchingView.prototype.viewUrl = "app/claims-batching";
// PaymentBatchingView.prototype.searchWidth = 550;
PaymentBatchingView.prototype.exportName = "Claims Payment Batching";
PaymentBatchingView.prototype.exportSource = "DBMedics.GetClaimsBatching";
PaymentBatchingView.prototype.popuMenuTitle = "Payment Batching";

PaymentBatchingView.prototype.Authorise = function(column) {
	var self = this;
	var grid = this.grid;
	this.busy = true;
	desktop.HideHints();
	var authorise = grid.dataset.get("sub_status_code") === "A01" ? 1: 0;
	
	desktop.Ajax(
		self, 
		"/app/api/command/authorise-batch-invoice", 
		{
			id: grid.dataset.getKey(),
			authorise: authorise
		}, 
		function(result) {
			if (result.status == 0) {
				grid.dataset.set("authorised", authorise);
				if (authorise) {
					grid.footerData.set("authorised_amount", grid.footerData.get("authorised_amount")+grid.dataset.get("paid"));
					grid.footerData.set("authorised", grid.footerData.get("authorised")+1);
					grid.dataset.set("authorised_amount", grid.dataset.get("paid"));
					grid.dataset.set("batching_date", new Date());
					grid.dataset.set("batching_user", desktop.userName);
				} else {
					grid.footerData.set("authorised_amount", grid.footerData.get("authorised_amount")-grid.dataset.get("authorised_amount"));
					grid.footerData.set("authorised", grid.footerData.get("authorised")-1);
					grid.dataset.set("authorised_amount", 0);
					grid.dataset.set("batching_date", null);
					grid.dataset.set("batching_user", "");
				};
				grid.dataset.post();
				grid.refresh(true);
				self.busy = false;
				// console.log(self.busy);
			} else {
				self.busy = false;
				ErrorDialog({
					target: column.element,
					title: "Authorisation error",
					message: result.message
				});
			}
		}
	)
};

PaymentBatchingView.prototype.OnInitGrid = function(grid) {
	PaymentBatchingView.prototype.parent.prototype.OnInitGrid.call(this, grid);
	
	var self = this;
	this.busy = false;
	grid.Events.OnCommand.add(function(grid, column) {
		if (column.command === "authorise" && !self.busy) {
			self.Authorise(column);
		}
	});
};

PaymentBatchingView.prototype.OnInitDataRequest = function(dataset) {
	PaymentBatchingView.prototype.parent.prototype.OnInitDataRequest.call(this, dataset);

	dataset
		.addColumn("loaded", 0, {numeric:true})
		// .addColumn("show_referral", defaultValue(this.params.requestParams.referral, 0), {numeric:true})
		.addColumn("show_only_authorised", "")
};

PaymentBatchingView.prototype.OnInitSearchData = function(dataset) {
	PaymentBatchingView.prototype.parent.prototype.OnInitSearchData.call(this, dataset);
	
	dataset.Columns
		.setprops("show_only_authorised", {label: "Show Only Authorised"})
		// .setprops("show_referral", {numeric:true})
};

PaymentBatchingView.prototype.OnInitSearchEditorGeneral = function(editor) {
	PaymentBatchingView.prototype.parent.prototype.OnInitSearchEditorGeneral.call(this, editor);

	// editor.AddGroup("Authorisation", function(editor) {
		// editor.AddText("claim_no")
		// editor.AddText("service_no")
	// });

	// editor.AddGroup("Invoice", function(editor) {
		// editor.AddText("invoice_no")
	// });

	editor.AddGroup("Authorisation", function(editor) {
		editor.AddRadioButton("show_only_authorised", {
			key: "id",
			value: "value",
			data: [
				{id:"A02", value:"Yes"},
				{id:"", value:"Show all"}
			]
		});
	});
};

PaymentBatchingView.prototype.OnInitSearchEditorLookups = function(editor) {
	PaymentBatchingView.prototype.parent.prototype.OnInitSearchEditorLookups.call(this, editor);
};

PaymentBatchingView.prototype.OnResetSearch = function(dataset) {
	PaymentBatchingView.prototype.parent.prototype.OnResetSearch.call(this, dataset);
	// dataset.set("show_blocked", 10);
	// dataset.set("show_referral", defaultValue(this.params.requestParams.referral, 0));
};

PaymentBatchingView.prototype.OnInitData = function(dataset) {
	PaymentBatchingView.prototype.parent.prototype.OnInitData.call(this, dataset);
	
	dataset.Columns
		.setprops("service_id", {label:"ID", numeric:true, key: true})
		.setprops("claim_no", {label:"Claim No."})
		.setprops("service_no", {label:"Service No."})
		.setprops("case_owner", {label:"Claim Owner"})
		.setprops("interco_reference", {label:"Inter-Co Reference"})
		.setprops("client_name", {label:"Client"})
		.setprops("float_name", {label:"Float"})
		.setprops("policy_holder", {label:"Policy Holder"})
		.setprops("payee_type", {label:"Payee Type"})
		.setprops("payee_name", {label:"Payee's Name"})
		.setprops("patient_name", {label:"Patient's Name"})
		.setprops("certificate_no", {label:"Certificate No."})
		.setprops("provider_name", {label:"Provider"})
		.setprops("admission_date", {label:"Admission Date", type:"date"})
		.setprops("discharge_date", {label:"Discharge Date", type:"date"})
		
		.setprops("authorise", {numeric:true})
		.setprops("approved_date", {label:"Approved Date (E01)", type:"date", format:"datetime"})
		.setprops("approved_user", {label:"Approved User"})
		.setprops("batching_date", {label:"Date", type:"date", format:"datetime"})
		.setprops("batching_user", {label:"User"})
		
		.setprops("authorised_date", {label:"Date", type:"date", format:"datetime"})
		.setprops("authorised_user", {label:"User"})
		
		.setprops("invoice_no", {label:"Invoice No."})
		.setprops("payment_mode", {label:"Mode"})
		
		.setprops("settlement_currency_code", {label:"SCY"})
		.setprops("paid", {label:"Payable", numeric:true, type:"money", format:"00"})
		.setprops("base_currency_code", {label:"BCY"})
		.setprops("paid_base", {label:"Payable", numeric:true, type:"money", format:"00"})
		.setprops("authorised_amount", {label:"Authorised", numeric:true, type:"money", format:"00"})
		
		.setprops("validation_mode", {label:"Validation"})
		.setprops("invoice_date", {label:"Invoice Date", type:"date"})
		.setprops("invoice_date_received", {label:"Received Date", type:"date"})
		.setprops("invoice_input_date", {label:"Entry Date", type:"date", format:"datetime"})
		.setprops("create_date", {label:"Creation Date", type:"date", format:"datetime"})
};

PaymentBatchingView.prototype.OnInitSummaryData = function(dataset) {
	PaymentBatchingView.prototype.parent.prototype.OnInitSummaryData.call(this, dataset);
	
	dataset.Columns
		.setprops("authorised_amount", {label:"Amount", numeric:true, type:"money", format:"00"})
		.setprops("paid", {label:"Amount", numeric:true, type:"money", format:"00"})
		.setprops("paid_base", {label:"Amount", numeric:true, type:"money", format:"00"});
};

PaymentBatchingView.prototype.OnInitRow = function(row) {
	PaymentBatchingView.prototype.parent.prototype.OnInitRow.call(this, row);
	
	if(this.grid.dataset.get("authorised")) {
		row.attr("x-authorised", "1");
	}
};

PaymentBatchingView.prototype.OnInitMethods = function(grid) {
	PaymentBatchingView.prototype.parent.prototype.OnInitMethods.call(this, grid);
	
	var self = this;
	
	grid.methods.add("getCommandHeaderIcon", function(grid, column, previous) {
		if(column.command === "authorise") {
			return "authorise"
		}
	});
	
	grid.methods.add("getCommandIcon", function(grid, column, previous) {
		if(column.command === "authorise") {
			if(grid.dataset.get("authorised") {
				return "un-authorise,1"
			} else {
				return "authorise,0"
			}
		} else {
			return previous
		}
	});
				
	grid.methods.add("allowCommand", function(grid, column, previous) {
		if(column.command === "authorise")
			return true
		else
			return previous
	});
	
	grid.methods.add("getCommandHint", function(grid, column, previous) {
		if(column.command === "authorise") {
			if(grid.dataset.get("authorised")
				return "Un-Authorise the payment"
			else
				return "Authorise the payment"
		} else {
			return previous
		}
		
	});
	
	grid.methods.add("allowSelection", function(grid, params, previous) {
		return grid.crud.authorise;
	});
	
};

PaymentBatchingView.prototype.OnPopupMenuCommands = function(menu) {
	PaymentBatchingView.prototype.parent.prototype.OnPopupMenuCommands.call(this, menu);
	var self = this;
	var grid = this.grid;
	
	if(grid.methods.call("allowSelection")) {
		if(grid.dataset.get("authorised")
			menu.addCommand("Un-Authorize", "", "un-authorise")
		else
			menu.addCommand("Authorize", "", "authorise")
	}
};


PaymentBatchingView.prototype.OnInitColumns = function(grid) {
	PaymentBatchingView.prototype.parent.prototype.OnInitColumns.call(this, grid);
	var self = this;
	
	if(grid.methods.call("allowSelection")) {
		grid.NewBand({fixed:"left"}, function(band) {
			band.NewCommand({command:"authorise"});
		})
	};
	
	grid.NewBand({caption:"General"}, function(band) {
		band.NewColumn({fname: "claim_no", width: 125, allowSort: true, linkField:"claim_id"});
		band.NewColumn({fname: "service_no", width: 150, allowSort: true, linkField:"service_id"});
		band.NewColumn({fname: "case_owner", width: 150,  allowSort: true});
		band.NewColumn({fname: "interco_reference", width: 150,  allowSort: false});
	});
	
	grid.NewBand({caption:"Client and Policy Holder"}, function(band) {
		band.NewColumn({fname: "client_name", width: 250, allowSort: true, linkField:"client_id"});
		band.NewColumn({fname: "float_name", width: 200, allowSort: true});
		band.NewColumn({fname: "policy_holder", width: 250, allowSort: true});
	});
	
	grid.NewBand({caption:"Invoice and Payment Detail"}, function(band) {
		band.NewColumn({fname: "payee_type", width: 125});
		band.NewColumn({fname: "payee_name", width: 250, allowSort: true});
		// band.NewColumn({fname: "patient_name", width: 250, allowSort: true});
		// band.NewColumn({fname: "certificate_no", width: 125, allowSort: true});
		// band.NewColumn({fname: "provider_name", width: 250, allowSort: true});
		// band.NewColumn({fname: "admission_date", width: 150, allowSort: true});
		// band.NewColumn({fname: "discharge_date", width: 150, allowSort: true});
		band.NewColumn({fname: "invoice_no", width: 150});
		band.NewColumn({fname: "payment_mode", width: 100});
		band.NewColumn({fname: "settlement_currency_code", width: 60});
		band.NewColumn({fname: "paid", width: 125, showFooter:true});
		band.NewColumn({fname: "base_currency_code", width: 60});
		band.NewColumn({fname: "paid_base", width: 125, showFooter:true});
		band.NewColumn({fname: "authorised_amount", width: 125, showFooter:true});
		// band.NewColumn({fname: "validation_mode", width: 100});
	});
	
	grid.NewBand({caption:"Batching (A02)"}, function(band) {
		band.NewColumn({fname: "batching_user", width: 150, allowSort: true});
		band.NewColumn({fname: "batching_date", width: 150, allowSort: true});
	});
	
	grid.NewBand({caption:"Authorisation (E02)"}, function(band) {
		band.NewColumn({fname: "authorised_user", width: 150, allowSort: true});
		band.NewColumn({fname: "authorised_date", width: 150, allowSort: true});
	});
	
	grid.NewBand({caption:"Invoice"}, function(band) {
		band.NewColumn({fname: "create_date", width: 150, allowSort: true});
		band.NewColumn({fname: "invoice_input_date", width: 150, allowSort: true});
	});
	
	// grid.NewBand({caption:"Authorisation", fixed:"right"}, function(band) {
		// band.NewColumn({fname: "SettlementCurrency", width: 75, allowSort: true});
		// band.NewColumn({fname: "AuthorisedAmount", width: 100, showFooter: true, allowSort: true});
	// });
};

PaymentBatchingView.prototype.OnDrawCustomHeader = function(container) {
	PaymentBatchingView.prototype.parent.prototype.OnDrawCustomHeader.call(this, container);
	var self = this;
	var grid = this.grid;
	
	CreateElementEx("div", this.dashboard, function(container) {
		container.addClass("widget");
		container.addClass("selected");
		CreateElementEx("div", container, function(title) {
			title.attr("x-sec", "title")
			CreateElement("h1", title).html(grid.footerData.get("authorised"))
			CreateElement("p", title).html("Records Authorised")
		});
		
		desktop.svg.draw(CreateElement("div", container).attr("x-sec", "icon"), "block-helper");
	});
	
	if(this.grid.dataParams.get("show_only_authorised"))
		this.addFilterDisplay({displayText:"Showing Only Authorised"});
	
	// if(this.grid.dataParams.get("show_blocked") === 0)
		// this.addFilterDisplay({displayText:"Showing Non-Blocked Invoices"})
	// else if(this.grid.dataParams.get("show_blocked") === 1)
		// this.addFilterDisplay({displayText:"Showing Blocked Invoices"})
	
};
