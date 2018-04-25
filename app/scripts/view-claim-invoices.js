// ****************************************************************************************************
// File name: view-claim-invoices.js
// Last modified on
//
// ****************************************************************************************************
function ListClaimServices(viewParams) {
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "claim-invoices",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {
			var title, label, module = viewParams.requestParams.module.toUpperCase();
			
			if (module == "INV") {
				title = "Invoice";
				label = "invoice";
			} else if (module == "GOP") {
				title = "Guarantee of Payment";
				label = "GOP";
			} else if (module == "NOC") {
				title = "Notification of Claim";
				label = "NOC";
			} else if (module == "CAS") {
				title = "Case Fee";
				label = "case fee";
			} else if (module == "REC") {
				title = "Recovery of Claim";
				label = "recovery";
			} else if (module == "COS") {
				title = "Cost Containment";
				label = "cost containment";
			} else if (module == "FLG") {
				title = "Flag";
				label = "flag";
			}
			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "claim-services";

				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				grid.options.showPager = false;
				grid.options.showBand = true;
				grid.options.fixedWidth = true;
				grid.options.editNewPage = true;
				grid.search.visible = false;

				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("claim_id", viewParams.requestParams.claim_id, {numeric:true})
						.addColumn("service_type", module)
						.addColumn("sort", "service_no")
						.addColumn("order", "asc")
				});

				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("service_no", {label:"Service No."})
						.setprops("sub_type", {label:"Service Type"})
						.setprops("claim_currency_code", {label:"CCY"})
						.setprops("settlement_currency_code", {label:"SCY"})
						.setprops("eligibility_currency_code", {label:"ECY"})
						.setprops("actual_amount", {label:"CCY"})
						.setprops("actual_amount", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("approved_amount", {label:"Approved", numeric:true, type:"money", format:"00"})
						.setprops("paid_amount", {label:"Payment", numeric:true, type:"money", format:"00"})
						.setprops("status", {label:"Status"})
						.setprops("sub_status", {label:"Sub-Status"});

					if(module == "INV") {
						data.Columns
							.setprops("invoice_no", {label:"Invoice No."})
							.setprops("invoice_date", {label:"Date", type:"date"})
					} else if(module == "GOP") {
						data.Columns
							.setprops("start_date", {label:"Admission Date", type:"date"})
							.setprops("end_date", {label:"Discharge Date", type:"date"})
					}
				});

				grid.methods.add("getCommandIcon", function(grid, column) {
					if(column.command === "open") {
						// return "security"
						return "db-open"
					} else {
						return ""
					}
				});

				grid.methods.add("editPageUrl", function(grid, id) {
					// if(params.module === "inv")
						// return __invoice(id, true)
					// else if(params.module === "gop")
						return __service(id, module, true)
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({caption: "Service"}, function(band) {
						band.NewColumn({fname: "service_no", width: 150, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "sub_type", width: 200, allowSort: true, fixedWidth:true});
					});

					if(module == "INV") {
						grid.NewBand({caption: "Invoice"}, function(band) {
							band.NewColumn({fname: "invoice_no", width: 150, allowSort: true, fixedWidth:true});
							band.NewColumn({fname: "invoice_date", width: 125, allowSort: true, fixedWidth:true});
						});

						grid.NewBand({caption: "Claim"}, function(band) {
							band.NewColumn({fname: "claim_currency_code", width: 50, allowSort: true, fixedWidth:true});
							band.NewColumn({fname: "actual_amount", width: 100, allowSort: true, fixedWidth:true});
							band.NewColumn({fname: "approved_amount", width: 100, allowSort: true, fixedWidth:true});
						});

						grid.NewBand({caption: "Payment"}, function(band) {
							band.NewColumn({fname: "settlement_currency_code", width: 50, allowSort: true, fixedWidth:true});
							band.NewColumn({fname: "paid_amount", width: 100, allowSort: true, fixedWidth:true});
							band.NewColumn({fname: "eligibility_currency_code", width: 50, allowSort: true, fixedWidth:true});
						});
					} else if(module == "GOP") {
						grid.NewBand({caption: "Admission"}, function(band) {
							band.NewColumn({fname: "start_date", width: 125, allowSort: true});
							band.NewColumn({fname: "end_date", width: 125, allowSort: true});
						});

						grid.NewBand({caption: "Guarantee"}, function(band) {
							band.NewColumn({fname: "claim_currency_code", width: 50, allowSort: true});
							band.NewColumn({fname: "actual_amount", width: 100, allowSort: true});
							band.NewColumn({fname: "approved_amount", width: 100, allowSort: true});
						});
					};

					grid.NewBand({caption: "Status"}, function(band) {
						band.NewColumn({fname: "status", width: 125, allowSort: true});
						band.NewColumn({fname: "sub_status", width: 200, allowSort: true});
					});

				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// ServiceSubTypesLookup() refer to view-service-sub--types-lookup.js
					toolbar.NewDropDownViewItem({
						id: "new-service",
						icon: "new",
						color: "#1CA8DD",
						title: "New " + title,
						height: 300,
						subTitle: ("Choose the type of {0} to create.").format(label),
						view: ServiceSubTypesLookup,
						viewParams: {serviceType:module},
						select: function(code) {
							// console.log(code.toLowerCase())
							// console.log(grid.dataParams.get("claim_id"))
							window.open(__newservice(grid.dataParams.get("claim_id"), module, code, true), "");
						}
					});
				});
			});
		}
	}));
}
