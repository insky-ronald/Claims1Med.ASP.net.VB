// ****************************************************************************************************
// Last modified on
// 29-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-service-actions.js
//==================================================================================================
function ServiceActionsView(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "service-actions",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/service-actions";
				
				grid.options.viewType = "cardview";
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.editNewPage = false;
				grid.options.showBand = false;
				grid.options.showSummary = false;
				grid.options.showPager = false;
				// grid.options.hideHeader = true;
				
				grid.search.visible = false;
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", viewParams.requestParams.service_id, {numeric:true})
						.addColumn("sort", "due_date")
						.addColumn("order", "desc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("is_done", {label:"", 
							getText: function(column, value) {
								if(value === "D")
									return "Closed"
								else if(value === "X")
									return "Canceled"
								else if(value === "N")
									return "Open"
								else 
									return value
							}
						})
						.setprops("action_type", {label:"Class", 
							getText: function(column, value) {
								return value.toLowerCase()
							}
						})
						.setprops("action", {label:"Action"})
						.setprops("due_date", {label:"Due Date", type:"date"})
						.setprops("action_owner", {label:"Owner"})
						.setprops("completion_date", {label:"Date Completed", type:"date", format:"datetime"})
						.setprops("completion_user", {label:"Completed By"})
						.setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
						.setprops("update_date", {label:"Last Updated", type:"date", format:"datetime"})
						.setprops("due_date", {label:"Due Date", type:"date", format:"datetime"})
				});

				// grid.Events.OnInitRow.add(function(grid, row) {	
					// row.attr("service-status", grid.dataset.get("status_code").toLowerCase())
				// });	
				
				if(grid.options.viewType === "cardview")
					grid.Events.OnInitColumns.add(function(grid) {
						grid.NewColumn({fname: "action", width: 100, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "action_type", width: 100, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "due_date", width: 100, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "action_owner", width: 100, allowSort: true});
						grid.NewColumn({fname: "completion_date", width: 125, allowSort: true});
						grid.NewColumn({fname: "completion_user", width: 125, allowSort: true});
					})
				else
					grid.Events.OnInitColumns.add(function(grid) {
						grid.NewColumn({fname: "action_type", width: 200, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "action", width: 200, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "due_date", width: 150, allowSort: true, fixedWidth:true});
						// grid.NewColumn({fname: "due_date", width: 100, allowSort: true, fixedWidth:true});
						// grid.NewColumn({fname: "action_owner", width: 100, allowSort: true});
						// grid.NewColumn({fname: "completion_date", width: 125, allowSort: true});
						// grid.NewColumn({fname: "completion_user", width: 125, allowSort: true});
					})
				
				grid.Events.OnInitCard.add(function(grid, card) {
					grid.dataset.gotoKey(parseInt(card.attr("row-id")));
					card.attr("x-status", grid.dataset.raw("is_done"));
					
					CreateElementEx("div", card, function(container) {						
						CreateElement("div", container).addClass("status").html(grid.dataset.text("is_done"))
						CreateElementEx("div", container, function(container) {
							CreateElement("span", container).addClass("type").html(grid.dataset.text("action_type"))
							CreateElement("span", container).addClass("sub-type").html(grid.dataset.text("action"))
						}, "task")
					}, "action-section action");
						
					if(grid.dataset.text("notes"))
						CreateElementEx("pre", card, function(container) {
							container.html(grid.dataset.text("notes")
						}, "action-section action-notes")
					
					CreateElementEx("div", card, function(container) {
						CreateElementEx("div", container, function(container) {
							CreateElement("div", container).html("Owner")
							CreateElement("div", container).html(grid.dataset.text("action_owner_name"))
						}, "user");
						CreateElementEx("div", container, function(container) {
							CreateElement("div", container).html("Due Date")
							CreateElement("div", container).html(grid.dataset.formatDateTime("due_date", "MMMM d, yyyy"))
						}, "user");
						
					}, "action-section other");
					
					CreateElementEx("div", card, function(container) {
						CreateElementEx("div", container, function(container) {
							CreateElement("div", container).html("Created by")
							CreateElement("div", container).html(grid.dataset.text("create_user_name"))
						}, "user");
						CreateElementEx("div", container, function(container) {
							CreateElement("div", container).html("Created on")
							CreateElement("div", container).html(grid.dataset.formatDateTime("create_date", "MMMM d, yyyy"))
						}, "user");
					}, "action-section other");

					if(grid.dataset.raw("is_done") === "D")
						CreateElementEx("div", card, function(container) {
							// CreateElement("div", container).addClass("close-user").html(grid.dataset.text("complete_user_name"))
							CreateElementEx("div", container, function(container) {
								CreateElement("div", container).html("Closed by")
								CreateElement("div", container).html(grid.dataset.text("complete_user_name"))
							}, "user");
							CreateElementEx("div", container, function(container) {
								CreateElement("div", container).html("Closed on")
								CreateElement("div", container).html(grid.dataset.formatDateTime("completion_date", "MMMM d, yyyy"))
							}, "user");
						}, "action-section other close");

					if(grid.dataset.raw("is_done") === "X")
						CreateElementEx("div", card, function(container) {
							// CreateElement("div", container).addClass("cancel-user").html(grid.dataset.text("update_user_name"))
							CreateElementEx("div", container, function(container) {
								CreateElement("div", container).html("Canceled by")
								CreateElement("div", container).html(grid.dataset.text("update_user_name"))
							}, "user");
							CreateElementEx("div", container, function(container) {
								CreateElement("div", container).html("Canceled on")
								CreateElement("div", container).html(grid.dataset.formatDateTime("update_date", "MMMM d, yyyy"))
							}, "user");
							// CreateElement("div", container).addClass("cancel-date").html(grid.dataset.formatDateTime("update_date", "MMMM d, yyyy"))
						}, "action-section other cancel");
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// console.log(viewParams);
					// console.log(desktop);
					var module = desktop.customData.module_type;
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
