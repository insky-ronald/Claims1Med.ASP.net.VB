// ****************************************************************************************************
// Last modified on
// 06-OCT-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-claim-audit-logs.js
//==================================================================================================
function ClaimAuditLogsView(params) {
	return new jGrid($.extend(params, {
		paintParams: {
			css: "audit-logs",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "claim-audit-logs";
				
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.showPager = true;
				// grid.options.showMasterDetail = true;
				grid.options.editNewPage = true;
				
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "create_date")
						.addColumn("order", "desc")
						.addColumn("claim_id", params.requestParams.claim_id)
						.addColumn("service_id", params.requestParams.service_id)
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {numeric:true, key: true})
						.setprops("claim_id", {numeric:true})
						.setprops("service_id", {numeric:true})
						.setprops("code", {label:"Log ID"})
						.setprops("log_name", {label:"Log Type"})
						.setprops("module_name", {label:"Service Type"})
						.setprops("reference_no", {label:"Reference No."})
						.setprops("notes", {label:"Notes"})
						// .setprops("service_name", {label:"Service Name"})
						// .setprops("case_status", {label:"Case Status"})
						// .setprops("plan_code", {label:"Plan Code"})
						// .setprops("provider_name", {label:"Provider"})
						// .setprops("doctor_name", {label:"Physician's Name"})
						// .setprops("diagnosis", {label:"Diagnosis"})
						// .setprops("diagnosis_list", {label:"Diagnosis"})
						.setprops("create_user_name", {label:"User"})
						.setprops("create_date", {label:"Date", type:"date", format:"datetime"})
						// .setprops("end_date", {label:"Discharge", type:"date"})
						// .setprops("actual_amount", {label:"Actual", numeric:true, type:"money", format:"00"})
						// .setprops("approved_amount", {label:"Approved", numeric:true, type:"money", format:"00"})
						// .setprops("declined_amount", {label:"Declined", numeric:true, type:"money", format:"00"})
						// .setprops("deductible_amount", {label:"Deductible", numeric:true, type:"money", format:"00"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					// row.attr("x-status", grid.dataset.get("is_active"))
				});	
				
				grid.methods.add("getLinkUrl", function(grid, params) {
					// if(params.column.linkField === "id")
					if(params.column.linkField === "claim_id") {
						return __claim(params.id, true)
					} else if(params.column.linkField === "service_id") {
						return __service(params.id, grid.dataset.get("service_type").toLowerCase(), true)
					}
				})
				
				grid.methods.add("editPageUrl", function(grid, id) {
					return __service(id, grid.dataset.get("service_type").toLowerCase(), true)
				})
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 75, fixedWidth:true, allowSort: true});
					grid.NewColumn({fname: "log_name", width: 300, fixedWidth:true});					
					if(params.requestParams.service_id == 0) {
						grid.NewColumn({fname: "module_name", width: 150, fixedWidth:true});
						grid.NewColumn({fname: "reference_no", width: 150, fixedWidth:true, allowSort: true});
					};
					grid.NewColumn({fname: "notes", width: 500, fixedWidth:true});
					// grid.NewColumn({fname: "service_no", width: 150, fixedWidth:true, linkField:"service_id"});
					// grid.NewColumn({fname: "case_status", width: 250, fixedWidth:true});
					// grid.NewColumn({fname: "plan_code", width: 100, fixedWidth:true});
					// grid.NewColumn({fname: "provider_name", width: 250, fixedWidth:true});
					// grid.NewColumn({fname: "doctor_name", width: 200, fixedWidth:true});
					grid.NewColumn({fname: "create_date", width: 150, fixedWidth:true, allowSort: true});
					grid.NewColumn({fname: "create_user_name", width: 150, fixedWidth:true});
					// grid.NewColumn({fname: "actual_amount", width: 100, fixedWidth:true});
					// grid.NewColumn({fname: "approved_amount", width: 100, fixedWidth:true});
					// grid.NewColumn({fname: "declined_amount", width: 100, fixedWidth:true});
					// grid.NewColumn({fname: "deductible_amount", width: 100, fixedWidth:true});
					// grid.NewColumn({fname: "service_name", width: 250, fixedWidth:true});
				});

				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(200);
					// new jPageControl({
						// paintParams: {
							// theme: "claim-services",
							// fullBorder: true,
							// icon: {
								// size: 18,
								// position: "left",
								// name: "view-list",
								// color: "dimgray"
							// }
						// },
						// indent: 0,
						// container: params.container,
						// init: function(pg) {
							// pg.addTab({caption:"Invoices",
								// OnCreate: function(tab) {
									// tab.container.addClass("master-detail-tab");
									// ListClaimServices({
										// container: tab.container,
										// requestParams: {
											// module: "inv",
											// claim_id: grid.dataset.getKey()
										// }
									// })
								// }
							// });
							// pg.addTab({caption:"Guarantee of Payments",
								// OnCreate: function(tab) {
									// tab.container.addClass("master-detail-tab");
									// ListClaimServices({
										// container: tab.container,
										// requestParams: {
											// module: "gop",
											// claim_id: grid.dataset.getKey()
										// }
									// })
								// }
							// });
						// }
					// });
				});
			});
		}
	}));
};
