// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-sob.js
//==================================================================================================
function SobView(params) {
	var serviceID = params.requestParams.serviceID;

	return new jGrid($.extend(params, {
		paintParams: {
			css: "sob",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/sob";
				grid.options.horzScroll = false;
				// grid.options.showSummary = true;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showBand = false;
				grid.options.showMasterDetail = true;

				grid.options.viewType = "treeview";
				grid.options.treeViewSettings.keyColumnName = "id";
				grid.options.treeViewSettings.parentColumnName = "parent_id";
				grid.options.treeViewSettings.columnName = "benefit_name";

				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", 440, {numeric:true})
				});

				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {numeric:true, key: true})
						.setprops("detail_id", {label:"ID", numeric:true})
						.setprops("benefit_name", {label:"Benefit",
							getText: function(column, value) {
								return ("{0}. {1}").format(column.dataset.get("item_no"), value)
							}
						})
						// .setprops("benefit_code", {label:"Code"})
						// .setprops("diagnosis_code", {label:"Diagnosis"})
						// .setprops("status_code", {label:"Status"})
						// .setprops("currency_code", {label:"Ccy"})
						// .setprops("estimate", {label:"Estimate", numeric:true, type:"money", format:"00"})
						// .setprops("actual_amount", {label:"Actual", numeric:true, type:"money", format:"00"})
						// .setprops("breakdown", {label:"Breakdown", numeric:true, type:"money", format:"00"})
						// .setprops("units", {label:"Units", numeric:true, type:"money", format:"0"})
						// .setprops("approved_amount", {label:"Approved", numeric:true, type:"money", format:"00"})
						// .setprops("ex_gratia", {label:"Ex-Gratia", numeric:true, type:"money", format:"00"})
						// .setprops("declined_amount", {label:"Declined", numeric:true, type:"money", format:"00"})
						// .setprops("deductible", {label:"Deductible", numeric:true, type:"money", format:"00"})
				});

				// grid.Events.OnInitSubData.add(function(grid, params) {
					// if(params.index === 1) {
						// if(grid.footerData) {
							// grid.footerData.resetData(params.rawData)
						// } else {
							// grid.footerData = new Dataset(params.rawData, "Footer Data");
						// }

						// grid.footerData.Columns
							// .setprops("estimate", {label:"Estimate", numeric:true, type:"money", format:"00"})
							// .setprops("actual_amount", {label:"Actual", numeric:true, type:"money", format:"00"})
							// .setprops("approved_amount", {label:"Approved", numeric:true, type:"money", format:"00"})
							// .setprops("ex_gratia", {label:"Ex-Gratia", numeric:true, type:"money", format:"00"})
							// .setprops("declined_amount", {label:"Declined", numeric:true, type:"money", format:"00"})
							// .setprops("deductible", {label:"Deductible", numeric:true, type:"money", format:"00"})
					// }
				// });

				grid.Events.OnInitRow.add(function(grid, row) {
					row.attr("x-limit", grid.dataset.get("has_limit") ? 1: 0);
					row.attr("x-benefits", grid.dataset.get("has_benefits") ? 1: 0);
					row.attr("x-top", grid.dataset.get("parent_id") == 0 ? 1: 0);
					// row.attr("breakdown", grid.dataset.get("is_breakdown") ? 1: 0);
					// row.attr("novalidate", grid.dataset.get("is_novalidate") ? 1: 0);
					// row.attr("recovery", grid.dataset.get("is_recover") ? 1: 0);
					// row.attr("exclusion", grid.dataset.get("is_exclusion") ? 1: 0);
					// row.attr("detail-id", grid.dataset.get("detail_id"));
					// row.attr("status", grid.dataset.get("status_code"));
				});

				grid.Events.OnTreeViewButtons.add(function(grid, params) {
					if(grid.dataset.get("has_limit")) {
						params.addIcon({icon:"limits", name:"limit"})
					else 
						params.addIcon({icon:"limits", name:"no-limit"});
					
					if(grid.dataset.get("has_benefits")) {
						params.addIcon({icon:"schedule-benefits", name:"benefits"})
					else 
						params.addIcon({icon:"schedule-benefits", name:"no-benefits"})
					
					if(grid.dataset.get("has_exclusions")) {
						params.addIcon({icon:"schedule-exclusions", name:"exclusions"})
					else 
						params.addIcon({icon:"schedule-exclusions", name:"no-exclusions"})
				});

				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Item",
						message: ("Please confirm to delete item <b>{0}</b>.").format(grid.dataset.get("benefit_name"))
					};
				});

				grid.methods.add("allowCommand", function(grid, column) {
					if(column.command === "edit") {
						return grid.dataset.get("parent_id") > 0
					} else if(column.command === "delete") {
						return grid.dataset.get("parent_id") > 0
					} else {
						return true
					}
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "benefit_name", width: 600, allowSort: false, fixedWidth:true});
				});
				
				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(250);
					new jPageControl({
						paintParams: {
							theme: "sob",
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
							pg.addTab({caption:"Limits",
								icon: {
									name: "limits",
									color: "forestgreen"
								},
								OnCreate: function(tab) {
									tab.container.addClass("master-detail-tab");
									LimitsView({
										container: tab.container,
										requestParams: {
											service_id: grid.dataset.getKey()
										}
									})
								}
							});
							pg.addTab({caption:"Eligibles",
								icon: {
									name: "schedule-benefits",
									color: "dodgerblue"
								},
								OnCreate: function(tab) {
									tab.container.addClass("master-detail-tab");
									ScheduleEligiblesView({
										container: tab.container,
										requestParams: {
											service_id: grid.dataset.getKey()
										}
									})
								}
							});
							pg.addTab({caption:"Exclusions",
								icon: {
									name: "schedule-exclusions",
									color: "firebrick"
								},
								OnCreate: function(tab) {
									tab.container.addClass("master-detail-tab");
									ScheduleExclusionsView({
										container: tab.container,
										requestParams: {
											service_id: grid.dataset.getKey()
										}
									})
								}
							});
						}
					});
				});

				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.NewItem({
						// id: "test",
						// icon: "export-excel",
						// iconColor: "firebrick",
						// hint: "Test",
						// click: function(item) {
							// grid.refresh(true);
						// }
					// });
					// toolbar.NewItem({
						// id: "test2",
						// icon: "test",
						// iconColor: "firebrick",
						// hint: "Test",
						// click: function(item) {
						// }
					// });
				});
			})
		}
	}));
};
