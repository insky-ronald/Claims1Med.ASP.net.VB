// ****************************************************************************************************
// Last modified on
// 26-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-member-claims.js
//==================================================================================================
function MemberClaimsView(params) {
	return new jGrid($.extend(params, {
		paintParams: {
			css: "member-claims",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "member-claims?"+ ObjectToRequestParams(params.requestParams);
				
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showMasterDetail = true;
				grid.options.editNewPage = true;
				
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 1000, {numeric:true})
						.addColumn("sort", "claim_no")
						.addColumn("order", "asc")
						.addColumn("member_id", params.member_id)
						// .addColumn("filter", "member 6")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("claim_no", {label:"Claim No."})
						.setprops("notification_date", {label:"Notification Date", type:"date"})
						.setprops("claim_type", {label:"Claim Type"})
						.setprops("status", {label:"Status"})
						.setprops("diagnosis", {label:"Diagnosis"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					// row.attr("x-status", grid.dataset.get("is_active"))
				});	
				
				// grid.methods.add("getCommandIcon", function(grid, column) {
					// if(column.command === "open") {
						// return "db-open"
					// } else {
						// return ""
					// }
				// })
				
				grid.methods.add("editPageUrl", function(grid, id) {
					return __claim(id, true)
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "claim_no", width: 150, fixedWidth:true, allowSort: true});
					grid.NewColumn({fname: "claim_type", width: 200, fixedWidth:true});
					grid.NewColumn({fname: "notification_date", width: 200, fixedWidth:true, allowSort: true});
					grid.NewColumn({fname: "status", width: 200, fixedWidth:true});
					grid.NewColumn({fname: "diagnosis", width: 200, fixedWidth:true,
						drawContent: function(cell) {
							cell.addClass("diagnosis");
							var diagnosis = JSON.parse(grid.dataset.get("diagnosis"));
							$(diagnosis).each(function(i, a) {
								CreateElementEx("span", cell, function(item) {
									item.html(a.code);
									item.attr("x-status", a.status);
									// desktop.SetHint(cell.data("hintTarget", cell), hint, "top")
									desktop.SetHint(item.data("hintTarget", item), a.diagnosis, "top")
								})
							})
						}
					});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// ClaimTypesLookup() refer to view-claim-types-lookup.js
					toolbar.NewDropDownViewItem({
						id: "new-claim",
						icon: "new",
						color: "#1CA8DD",
						title: "New Claim",
						height: 200,
						subTitle: "Choose the type of claim to create",
						view: ClaimTypesLookup,
						// viewParams: {module:"INV", mode:1},
						select: function(code) {
							window.open(__claim(("new/{0}/{1}").format(code.toLowerCase(), grid.dataParams.get("member_id")), true), "");
						}
					});
				});

				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(300);
					new jPageControl({
						paintParams: {
							theme: "claim-services",
							fullBorder: true,
							icon: {
								size: 18,
								position: "left",
								name: "view-list",
								color: "dimgray"
							}
						},
						indent: 0,
						container: params.container,
						init: function(pg) {
							pg.addTab({caption:"Invoices",
								OnCreate: function(tab) {
									tab.container.addClass("master-detail-tab");
									ListClaimServices({
										container: tab.container,
										requestParams: {
											module: "inv",
											claim_id: grid.dataset.getKey()
										}
									})
								}
							});
							pg.addTab({caption:"Guarantee of Payments",
								OnCreate: function(tab) {
									tab.container.addClass("master-detail-tab");
									ListClaimServices({
										container: tab.container,
										requestParams: {
											module: "gop",
											claim_id: grid.dataset.getKey()
										}
									})
								}
							});
							// pg.addTab({caption:"Notification of Claims",
								// icon: {
									// name: "table",
									// color: "dimgray"
								// },
								// OnCreate: function(tab) {
									// tab.container.addClass("master-detail-tab");
								// }
							// });
						}
					});
				});
			});
		}
	}));
};
