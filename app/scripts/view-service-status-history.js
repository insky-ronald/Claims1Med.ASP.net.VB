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
				
				grid.options.viewType = "cardview";
				grid.options.hideHeader = true;
				
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
						grid.NewColumn({fname: "sub_status_code", width: 75});
						grid.NewColumn({fname: "sub_status", width: 300});
						grid.NewColumn({fname: "create_user", width: 150});
						grid.NewColumn({fname: "create_date", width: 150});
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
					var module = desktop.customData.module_type.toLowerCase();
					var status = desktop.dbService.get("status_code") ;

					return;
					if((module === "inv" && status === "P") || (module === "gop" && (status === "N" || status === "P")) ) {
						toolbar.NewDropDownViewItem({
							id: "change-status",
							icon: "status-change-pending",
							color: "forestgreen",
							title: "Change Pending Status",
							subTitle: "Choose the type of pending status to change to.",
							view: ServiceStatusLookup,
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
								view: ServiceStatusLookup,
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
								view: ServiceStatusLookup,
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
