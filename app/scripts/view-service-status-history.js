// ****************************************************************************************************
// Last modified on
// 29-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-service-status-history.js
//==================================================================================================
function ServiceStatusView(viewParams){
	var url = "service-status-history";
	
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "service-status",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = url;
				
				grid.options.action = viewParams.action;
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

				grid.methods.add("canAdd", function(grid) {
					return false;
				});

				grid.methods.add("canEdit", function(grid) {
					return false;
				});

				grid.methods.add("canDelete", function(grid) {
					return false;
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
					var status = desktop.dbService.get("status_code") ;
					var module = desktop.customData.module_type.toLowerCase();

					toolbar.NewDropDownViewItem({
						id: "pending",
						icon: "service-status-pending",
						color: "forestgreen",
						title: "Change Pending Status",
						view: ServiceStatusCodesLookup,
						viewParams: {serviceType: desktop.serviceType, statusCode:"P"},
						permission: {
							view: (desktop.canEdit || (module == "inv" && (desktop.status == "D" || desktop.status == "E" || (desktop.status == "S")))) && grid.crud.edit
						},
						select2: function(btn, code) {
							desktop.serverPost({
								url: "/app/get/change-service-status/"+url,
								params: {
									id: desktop.dbService.getKey(),
									status_code: "P",
									sub_status_code: code
								},
								success: function(data) {
									location.reload();
								},
								error: {
									target: btn.element(),
									title: "changing pending status"
								}
							});
						}
					});
					
					toolbar.NewDropDownViewItem({
						id: "inv-decline",
						icon: "invoice-decline",
						color: "firebrick",
						title: "Decline Invoice",
						view: ServiceStatusCodesLookup,
						viewParams: {
							serviceType: desktop.serviceType, 
							statusCode: "D"
						},
						permission: {
							view: module === "inv" && (desktop.canEdit || desktop.status == "D") && grid.crud.decline
						},
						select2: function(btn, code) {
							desktop.serverPost({
								url: "/app/get/change-service-status/"+url,
								params: {
									id: desktop.dbService.getKey(),
									status_code: "D",
									sub_status_code: code
								},
								success: function(data) {
									location.reload();
								},
								error: {
									target: btn.element(),
									title: "changing decline status"
								}
							});
						}
					});
					
					toolbar.NewDropDownConfirmItem({
						id: "inv-post",
						icon: "invoice-settle",
						color: "dodgerblue",
						// title: "Pay/Settle Invoice",
						title: "Post Invoice",
						subTitle: "Please confirm to post invoice for payment.",
						permission: {
							view: module === "inv" && desktop.canEdit && grid.crud.post
						},
						confirm: function(button) {
							desktop.serverPost({
								url: "/app/get/inv-post/"+url,
								params: {
									id: desktop.dbService.getKey()
								},
								success: function(data) {
									location.reload();
								},
								error: {
									target: button.element(),
									title: "posting invoice"
								}
							});
						}
					});
					
					toolbar.NewDropDownViewItem({
						id: "inv-close",
						icon: "invoice-settle-other",
						color: "dodgerblue",
						// title: "Settle - Other Method",
						title: "Close Invoice",
						subTitle: "Close/Settle invoice using other method",
						view: ServiceStatusCodesLookup,
						viewParams: {serviceType: desktop.serviceType, statusCode:"S"},
						permission: {
							view: module === "inv" && desktop.canEdit && grid.crud.close
						},
						select2: function(btn, code) {
							desktop.serverPost({
								url: "/app/get/change-service-status/"+url,
								params: {
									id: desktop.dbService.getKey(),
									status_code: "S",
									sub_status_code: code
								},
								success: function(data) {
									location.reload();
								},
								error: {
									target: btn.element(),
									title: "closing invoice"
								}
							});
						}
					});
				
					
					toolbar.NewDropDownViewItem({
						id: "cancel",
						icon: "service-status-cancel",
						color: "firebrick",
						title: "Cancel",
						view: ServiceStatusCodesLookup,
						viewParams: {serviceType: desktop.serviceType, statusCode: "D"},
						permission: {
							view: module === "gop" && desktop.canEdit && grid.crud.decline
						},
						select2: function(btn, code) {
							desktop.serverPost({
								url: "/app/get/change-service-status/"+url,
								params: {
									id: desktop.dbService.getKey(),
									status_code: "D",
									sub_status_code: code
								},
								success: function(data) {
									location.reload();
								},
								error: {
									target: btn.element(),
									title: "cancelling gop"
								}
							});
						}
					});
					
					toolbar.NewDropDownConfirmItem({
						id: "post",
						icon: "send-to-outbox",
						color: "dodgerblue",
						hint: "Post GOP",
						title: "Post GOP",
						subTitle: "Please confirm to post guarantee of payment for authorisation.",
						// dataBind: desktop.dbService,
						// dataEvent: function(dataset, button) {
							// button.show(!dataset.editing);
						// },
						permission: {
							view: module === "gop" && desktop.canEdit && desktop.customData.permissions.service.post
						},
						confirm: function(button) {
							desktop.serverPost({
								url: "/app/get/gop-post/"+url,
								params: {
									id: desktop.dbService.getKey()
								},
								success: function(data) {
									location.reload();
								},
								error: {
									target: button.element(),
									title: "posting GOP"
								}
							});
						}
					});
					
					toolbar.NewDropDownConfirmItem({
						id: "supercede",
						icon: "supercede-gop",
						color: "forestgreen",
						hint: "Supercede GOP",
						title: "Supercede GOP",
						subTitle: "Please confirm to supercede guarantee of payment.",
						// dataBind: desktop.dbService,
						// dataEvent: function(dataset, button) {
							// button.show(!dataset.editing);
						// },
						permission: {
							view: module === "gop" && (desktop.status == "S" && desktop.subStatus != "S02" && desktop.subStatus != "S03") //&& desktop.customData.permissions.service.post
						},
						confirm: function(button) {
							desktop.serverPost({
								url: "/app/get/gop-supercede/"+url,
								params: {
									id: desktop.dbService.getKey()
								},
								success: function(data) {
									location.href = __service(data.id, "gop", true);
								},
								error: {
									target: button.element(),
									title: "superceding GOP"
								}
							});
						}
					});
					
					toolbar.NewDropDownConfirmItem({
						id: "awaiting",
						icon: "service-status-awaiting",
						color: "firebrick",
						color: "dodgerblue",
						title: "Await Invoice",
						subTitle: "Please confirm to await for the invoice.",
						permission: {
							view: module === "gop" && (desktop.status == "S" && desktop.subStatus == "S01")
						},
						confirm: function(button) {
							desktop.serverPost({
								url: "/app/get/gop-awaiting-invoice/"+url,
								params: {
									id: desktop.dbService.getKey()
								},
								success: function(data) {
									location.reload();
								},
								error: {
									target: button.element(),
									title: "chaging to awaiting invoice"
								}
							});
						}
					});
					
					toolbar.NewDropDownViewItem({
						id: "invoice-received",
						icon: "invoice-received",
						color: "dodgerblue",
						hint: "Invoice received",
						title: "Invoice Received",
						subTitle: "Please confirm to send guarantee of payment to outbox for authorisation.",
						view: ServiceSubTypesLookup,
						viewParams: {serviceType:"INV"},
						permission: {
							view: module === "gop" && (desktop.status == "S" && desktop.subStatus == "S08")
						},
						select2: function(btn, code) {
							desktop.serverPost({
								url: "/app/get/invoice-received/"+url,
								params: {
									id: desktop.dbService.getKey(),
									type: code
								},
								success: function(data) {
									location.href = __service(data.id, "inv", true);
								},
								error: {
									target: btn.element(),
									title: "adding diagnosis"
								}
							});
						}
					});
					
				});
				
			});
		}
	}));
};
