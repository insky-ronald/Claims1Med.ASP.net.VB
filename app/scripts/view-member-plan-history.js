// ****************************************************************************************************
// Last modified on
// 03-OCT-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-member-plan-history.js
//==================================================================================================
function MemberPlanHistoryView(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "plan-history",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
		},
		init: function(grid, callback) {			
			if (desktop.dbClaim) {
				desktop.dbClaim.Events.OnCancel.add(function(dataset) {
					desktop.dbMember.cancel();
					grid.refresh(true);
				});
			};
			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/member-plan-history";
				
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.editNewPage = false;
				grid.options.showBand = false;
				grid.options.showSummary = false;
				grid.options.showPager = false;
				// grid.options.showMasterDetail = true;
				grid.options.showMasterDetail = false;
				
				grid.search.visible = false;
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("member_id", viewParams.requestParams.member_id, {numeric:true})
						// .addColumn("sort", "sequence_no")
						// .addColumn("order", "desc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("sequence_no", {label:"#"})
						.setprops("flag", {label:"Flag"})
						.setprops("history_type", {label:"Type"})
						.setprops("plan_code", {label:"Plan"})
						.setprops("sub_product", {label:"Sub-Product"})
						.setprops("start_date", {label:"Start Date", type:"date"})
						.setprops("end_date", {label:"End Date", type:"date"})
						.setprops("cancelation_date", {label:"Cancelation Date", type:"date"})
						.setprops("reinstatement_date", {label:"Reinstatement Date", type:"date"})
						.setprops("extension_date", {label:"Extension Date", type:"date"})
						.setprops("renewal_date", {label:"Renewal Date", type:"date"})
						.setprops("rcd", {label:"RCD", type:"date"})
						.setprops("wait_period_start_date", {label:"Wait Period Start Date", type:"date"})
						.setprops("wait_period_days", {label:"Wait (Days)", numeric:true})
						.setprops("wait_period_months", {label:"Wait (Months)", numeric:true})
						.setprops("prorate_amount", {label:"ProRate Benefit", numeric:true, type:"money", format:"00"})
						.setprops("emergency_amount", {label:"Emergency Benefit", numeric:true, type:"money", format:"00"})
						
						.setprops("create_user", {label:"User"})
						.setprops("create_user_name", {label:"Created By"})
						.setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
						
						.setprops("update_user", {label:"User"})
						.setprops("update_user_name", {label:"Updated By"})
						.setprops("update_date", {label:"Last Updated", type:"date", format:"datetime"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-vip", grid.dataset.get("vip_flag"));
					row.attr("x-blacklisted", grid.dataset.get("blacklisted_flag"));
				});	
		
				grid.methods.add("getCommandHeaderIcon", function(grid, column, defaultValue) {
					if(column.command === "master-detail")
						return "notes"
					else if(column.command === "override1")
						return "override"
					else if(column.command === "override2")
						return "override"
					else
						return defaultValue
				});
		
				grid.methods.add("getCommandIcon", function(grid, column, defaultValue) {
					if(column.command === "override1")
						return "override"
					else if(column.command === "override2")
						return "override"
					else
						return defaultValue
				});
		
				grid.methods.add("getCommandHint", function(grid, column, defaultValue) {
					if(column.command === "master-detail")
						return "View history notes"
					else if(column.command === "override1")
						return "Override Plan"
					else if(column.command === "override2")
						return "Override Plan from same Product"
					else
						return defaultValue
				});

				grid.methods.add("allowCommand", function(grid, column, defaultValue) {
					if(column.command === "override1")
						return grid.dataset.get("plan_code").trim() !== desktop.dbClaim.get("plan_code").trim()
					else
						return defaultValue
				});

				grid.Events.OnCommand.add(function(grid, column) {
					var title = "Override Plan from same Product";
					if(column.command === "override2") {
						desktop.ValidateActionEx({
							e: column.element,
							id: 500001,
							key_id: desktop.dbClaim.getKey(),
							string_value: grid.dataset.get("plan_code"),
							title: title,
							callback: function(result) {
								desktop.CanDeleteClaim({
									id: desktop.dbClaim.getKey(),
									change_plan: 1,
									callback: function(result) {
										if (result.status) {
											ErrorDialog({
												target: column.element,
												title: title,
												message: result.message
											});
										} else {
											desktop.ValidateActionEx({
												e: column.element,
												id: 500002,
												key_id: desktop.dbClaim.getKey(),
												string_value: grid.dataset.get("plan_code"),
												title: title,
												callback: function(result) {
													ConfirmDialog({
														target: column.element,
														title: title,
														message: ("Are you sure you want to override current plan <b>{0}</b> to <b>{1}</b>?").format(grid.dataset.get("plan_code").trim(), result.action_name),
														callback: function(dialog) {
															desktop.dbMember.set("plan_code", grid.dataset.get("plan_code").trim());
															
															desktop.dbClaim.set("sub_product", grid.dataset.get("sub_product").trim());
															desktop.dbClaim.set("plan_code", result.action_name);
															desktop.dbClaim.set("plan_code2", grid.dataset.get("plan_code").trim());
															
															desktop.ValidateActionEx({
																e: desktop.claimInfoContainer,
																id: 300002,
																key_id: desktop.dbClaim.getKey(),
																string_value: desktop.dbMember.get("plan_code"),
																callback: function(result) {
																}
															})
															
															// var claim = desktop.dbClaim.data[0];
															// claim.plan_code = result.action_name;
															// claim.plan_code2 = grid.dataset.get("plan_code").trim();
															// claim.sub_product = grid.dataset.get("sub_product").trim();
															
															// desktop.UpdateClaimData({
																// id: desktop.dbClaim.getKey(),
																// data: claim,
																// title: "Override Plan from same Product"
															// })
														}
													});
												}
											});
										}
									}
								});
							}
						});
					} else if(column.command === "override1") {
						desktop.Ajax(
							self, 
							"/app/command/can-delete-claim", 
							{
								id: desktop.dbClaim.getKey(),
								change_plan: 1
							}, 
							function(result) {
								if (result.status == 0) {
									ConfirmDialog({
										target: column.element,
										title: "Override Plan",
										message: ("Please confirm to override the current plan <b>{0}</b> with <b>{1}</b>.").format(desktop.dbClaim.get("plan_code").trim(), grid.dataset.get("plan_code").trim()),
										callback: function(dialog) {
											desktop.dbMember.set("plan_code", grid.dataset.get("plan_code").trim());
											
											desktop.dbClaim.set("sub_product", grid.dataset.get("sub_product").trim());
											desktop.dbClaim.set("plan_code", grid.dataset.get("plan_code").trim());
											desktop.dbClaim.set("plan_code2", "");
											
											grid.refresh(true);
											
											// desktop.dbClaim.Events.OnCancel.add(function(dataset) {
												// desktop.dbMember.cancel();
												// grid.refresh(true);
											// });
											// var claim = desktop.dbClaim.data[0];
											// claim.plan_code = grid.dataset.get("plan_code").trim();
											// claim.plan_code2 = "";
											// claim.sub_product = grid.dataset.get("sub_product").trim();
											
											// desktop.UpdateClaimData({
												// id: desktop.dbClaim.getKey(),
												// data: claim,
												// title: "Override Plan"
											// })
										}
									});
								} else {
									ErrorDialog({
										target: column.element,
										title: "Error: Override Plan",
										message: result.message
									});
								}
							}
						)
					};
				});
				
				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(250);
					CreateElementEx("pre", params.container, function(notes) {
						notes.append(grid.dataset.text("notes"));
						// notes.append(desktop.dbMember.text("notes"));
						// notes.append("TEST:\tA\rTEST:\tA\r");
					});
					// ListNoteSubTypes({
						// noteSubType: grid.dataset.get("code"),
						// container: params.container
					// })
				})
				
				grid.Events.OnInitColumns.add(function(grid) {
					// if (desktop.dbClaim) {
						// grid.NewBand({caption: "...", fixed:"left"} , function(band) {
							// band.NewCommand({command:"override1"});
							// band.NewCommand({command:"override2"});
						// });
					// };
					
					grid.NewBand({caption: "..."} , function(band) {
						band.NewColumn({fname: "sequence_no", width: 30});
						// band.NewColumn({fname: "flag", width: 50});
						band.NewColumn({fname: "history_type", width: 50});
						band.NewColumn({fname: "plan_code", width: 100});
						// band.NewColumn({fname: "sub_product", width: 100});
						band.NewColumn({fname: "start_date", width: 100});
						band.NewColumn({fname: "end_date", width: 100});
						band.NewColumn({fname: "cancelation_date", width: 100});
						band.NewColumn({fname: "reinstatement_date", width: 100});
						band.NewColumn({fname: "extension_date", width: 100});
						band.NewColumn({fname: "renewal_date", width: 100});
						band.NewColumn({fname: "rcd", width: 100});
						band.NewColumn({fname: "wait_period_start_date", width: 100});
						band.NewColumn({fname: "wait_period_days", width: 100});
						band.NewColumn({fname: "wait_period_months", width: 100});
						band.NewColumn({fname: "prorate_amount", width: 100});
						band.NewColumn({fname: "create_date", width: 150});
						band.NewColumn({fname: "create_user_name", width: 100});
						band.NewColumn({fname: "update_date", width: 150});
						band.NewColumn({fname: "update_user_name", width: 100});
					});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					
				});
			});
		}
	}));
};
