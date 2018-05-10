// ****************************************************************************************************
// Last modified on
// 29-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-service-status-history.js
//==================================================================================================
function ServiceStatusView(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "service-status",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/service-status-history";
				
				// grid.options.viewType = "cardview";
				// grid.options.hideHeader = true;
				
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.editNewPage = false;
				grid.options.showBand = false;
				grid.options.showSummary = false;
				grid.options.showPager = false;
				
				grid.search.visible = false;
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", viewParams.requestParams.service_id, {numeric:true})
						.addColumn("sort", "create_date")
						.addColumn("order", "desc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("status_code", {label:"Status Code"})
						.setprops("status", {label:"Status"})
						.setprops("sub_status_code", {label:"Code"})
						.setprops("sub_status", {label:"Sub-Status"})
						.setprops("create_user", {label:"User"})
						.setprops("create_user_name", {label:"User"})
						.setprops("create_date", {label:"Date", type:"date", format:"datetime"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("service-status", grid.dataset.get("status_code").toLowerCase())
				});	
				
				if(grid.options.viewType !== "cardview") {
					grid.Events.OnInitColumns.add(function(grid) {
						grid.NewColumn({fname: "status", width: 150});
						grid.NewColumn({fname: "sub_status_code", width: 50});
						grid.NewColumn({fname: "sub_status", width: 250});
						grid.NewColumn({fname: "create_date", width: 150});
						grid.NewColumn({fname: "create_user_name", width: 125});
					});
				}
				
				grid.Events.OnInitCard.add(function(grid, card) {
					grid.dataset.gotoKey(parseInt(card.attr("row-id")));
					card.attr("x-status", grid.dataset.get("status_code"));
					
					CreateElementEx("div", card, function(container) {
						CreateElement("div", container).addClass("name").html(grid.dataset.get("status"));
						CreateElement("div", container).addClass("code").html(grid.dataset.get("sub_status_code"));
						CreateElement("div", container).addClass("desc").html(grid.dataset.get("sub_status"));
					}, "status");
					
					CreateElementEx("div", card, function(container) {
						CreateElementEx("div", container, function(container) {
							CreateElement("div", container).html("Created by");
							CreateElement("div", container).html(grid.dataset.text("create_user_name"));
						}, "user");
						CreateElementEx("div", container, function(container) {
							CreateElement("div", container).html("Created on");
							CreateElement("div", container).html(grid.dataset.formatDateTime("create_date", "MMMM d, yyyy"));
						}, "user");
						// CreateElement("div", container).addClass("name").html(grid.dataset.get("create_user_name"))
						// CreateElement("div", container).addClass("date").html(grid.dataset.formatDateTime("create_date", "MMMM d, yyyy"))
					}, "log");
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// console.log(viewParams);
					// console.log(desktop);
					var status = desktop.dbService.get("status_code") ;
					var module = desktop.customData.module_type.toLowerCase();

					if (desktop.canEdit || (module == "inv" && (desktop.status == "D" || desktop.status == "S"))) {
						var btnPending = toolbar.NewDropDownViewItem({
							id: "pending",
							icon: "service-status-pending",
							color: "forestgreen",
							title: "Change Pending Status",
							view: ServiceStatusCodesLookup,
							viewParams: {serviceType: desktop.serviceType, statusCode:"P"},
							select: function(code) {
								desktop.Ajax(null, "/app/api/command/change-service-status", {
										id: desktop.dbService.getKey(),
										status_code: "P",
										sub_status_code: code
									}, 
									function(result) {
										if(result.status < 0) {
											ErrorDialog({
												target: btnPending.elementContainer,
												title: "Error",
												message: result.message,
												snap: "bottom",
												inset: false
											});
										} else {
											location.reload();
										}
									}
								)
							}
						});
					}
					
					if(module === "inv" && (desktop.canEdit || desktop.status == "D")) {
						var btnDecline = toolbar.NewDropDownViewItem({
							id: "inv-decline",
							icon: "invoice-decline",
							color: "firebrick",
							title: "Decline Invoice",
							view: ServiceStatusCodesLookup,
							viewParams: {serviceType: desktop.serviceType, statusCode:"D"},
							select: function(code) {
								desktop.Ajax(null, "/app/api/command/change-service-status", {
										id: desktop.dbService.getKey(),
										status_code: "D",
										sub_status_code: code
									}, 
									function(result) {
										if(result.status < 0) {
											ErrorDialog({
												target: btnDecline.elementContainer,
												title: "Error",
												message: result.message,
												snap: "bottom",
												inset: false
											});
										} else {
											location.reload();
										}
									}
								)
							}
						});
					}
					
					if(module === "inv" && desktop.canEdit) {
						toolbar.NewDropDownConfirmItem({
							id: "inv-settle",
							icon: "invoice-settle",
							color: "dodgerblue",
							title: "Pay/Settle Invoice",
							subTitle: "Please confirm to post invoice for payment.",
							confirm: function(button) {
								desktop.Ajax(null, "/app/api/command/inv-settle", {
										id: desktop.dbService.getKey()
									}, 
									function(result) {
										if(result.status < 0) {
											ErrorDialog({
												target: button.elementContainer,
												title: "Error",
												message: result.message,
												snap: "bottom",
												inset: false
											});
										} else {
											location.reload();
										}
									}
								)
							}
						});
					}
					
					if(module === "inv" && desktop.canEdit) {
						var btnSettle = toolbar.NewDropDownViewItem({
							id: "inv-settle-other",
							icon: "invoice-settle-other",
							color: "dodgerblue",
							title: "Settle - Other Method",
							view: ServiceStatusCodesLookup,
							viewParams: {serviceType: desktop.serviceType, statusCode:"S"},
							select: function(code) {
								desktop.Ajax(null, "/app/api/command/change-service-status", {
										id: desktop.dbService.getKey(),
										status_code: "S",
										sub_status_code: code
									}, 
									function(result) {
										if(result.status < 0) {
											ErrorDialog({
												target: btnSettle.elementContainer,
												title: "Error",
												message: result.message,
												snap: "bottom",
												inset: false
											});
										} else {
											location.reload();
										}
									}
								)
							}
						});
					}
					
					
					if(module === "gop" && desktop.canEdit) {
						var btnCancel = toolbar.NewDropDownViewItem({
							id: "cancel",
							icon: "service-status-cancel",
							color: "firebrick",
							title: "Cancel",
							// subTitle: "Choose the type of pending status.",
							// height: 200,
							// width: 500,
							// view: ProceduresView,
							select: function(code) {
								desktop.Ajax(
									self, 
									"/app/api/command/add-claim-procedure",
									{
										service_id: desktop.dbService.get("id"),
										claim_id: desktop.dbService.get("claim_id"),
										code: code,
										diagnosis_code: ""
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh();
										} else {
											ErrorDialog({
												target: btnCancel.elementContainer,
												title: "Error adding procedure",
												message: result.message
											});
										}
									}
								)
							}
						});
					}
					
					if(module === "gop" && (desktop.status == "S" && desktop.subStatus == "S01")) {
						toolbar.NewDropDownConfirmItem({
							id: "awaiting",
							icon: "service-status-awaiting",
							color: "firebrick",
							color: "dodgerblue",
							title: "Await Invoice",
							subTitle: "Please confirm to await for the invoice.",
							confirm: function(button) {
								desktop.Ajax(null, "/app/api/command/gop-awaiting-invoice", {
										id: desktop.dbService.getKey()
									}, 
									function(result) {
										if(result.status < 0) {
											ErrorDialog({
												target: button.elementContainer,
												title: "Error",
												message: result.message,
												snap: "bottom",
												inset: false
											});
										} else {
											location.reload();
										}
									}
								)
							}
						});
					}
					
					return;
					if((module === "inv" && status === "P") || (module === "gop" && (status === "N" || status === "P")) ) {
						toolbar.NewDropDownViewItem({
							id: "change-status",
							icon: "status-change-pending",
							color: "forestgreen",
							title: "Change Pending Status",
							subTitle: "Choose the type of pending status to change to.",
							// view: ServiceStatusLookup,
							viewParams: {module:module, status:"P"},
							select: function(code) {
								// window.open(__invoice(("new?claim_id={0}&claim_type={1}&service_type={2}").format(desktop.dbClaim.get("id"), desktop.dbClaim.get("claim_type"), code), true), "");
							}
						});
						
						if(module === "gop") {
							toolbar.NewDropDownViewItem({
								id: "cancel-gop",
								icon: "status-cancel",
								color: "firebrick",
								title: "Cancel Guarantee",
								subTitle: "Choose the type of cancelation.",
								// view: ServiceStatusLookup,
								viewParams: {module:module, status:"D"},
								select: function(code) {
									// window.open(__invoice(("new?claim_id={0}&claim_type={1}&service_type={2}").format(desktop.dbClaim.get("id"), desktop.dbClaim.get("claim_type"), code), true), "");
								}
							});
						};
						
						if(module === "inv") {
							toolbar.NewDropDownViewItem({
								id: "decline",
								icon: "status-decline",
								title: "Decline Invoice",
								subTitle: "Choose the type of decline.",
								color: "firebrick",
								// view: ServiceStatusLookup,
								viewParams: {module:module, status:"D"},
								select: function(code) {
									// window.open(__invoice(("new?claim_id={0}&claim_type={1}&service_type={2}").format(desktop.dbClaim.get("id"), desktop.dbClaim.get("claim_type"), code), true), "");
								}
							});
							
							toolbar.NewDropDownConfirmItem({
								id: "approve",
								icon: "status-approve",
								color: "dodgerblue",
								title: "Approve for Payment",
								subTitle: "Please confirm to approve this invoice for payment.",
								confirm: function() {
									console.log("confirm")
									// window.open(__invoice(("new?claim_id={0}&claim_type={1}&service_type={2}").format(desktop.dbClaim.get("id"), desktop.dbClaim.get("claim_type"), code), true), "");
								}
							});
							
							toolbar.NewDropDownConfirmItem({
								id: "settle",
								icon: "status-settle",
								color: "orangered",
								title: "Settle (Cash Paid)",
								subTitle: "Please confirm this invoice as paid by cash.",
								confirm: function() {
									console.log("bucket")
									// window.open(__invoice(("new?claim_id={0}&claim_type={1}&service_type={2}").format(desktop.dbClaim.get("id"), desktop.dbClaim.get("claim_type"), code), true), "");
								}
							});
							
							toolbar.NewDropDownConfirmItem({
								id: "bucket",
								icon: "status-bucket",
								color: "slateblue",
								title: "Bucket Invoice",
								subTitle: "Please confirm to bucket this invoice.",
								confirm: function() {
									console.log("bucket")
									// window.open(__invoice(("new?claim_id={0}&claim_type={1}&service_type={2}").format(desktop.dbClaim.get("id"), desktop.dbClaim.get("claim_type"), code), true), "");
								}
							});
						};
					}
				});
				
			});
		}
	}));
};
