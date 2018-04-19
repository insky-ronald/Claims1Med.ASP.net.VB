// ****************************************************************************************************
// Last modified on
// 28-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: service-details.js
//==================================================================================================
function InitializeData(dataset) {
	dataset.Columns
		.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
};

function ServiceDetailsView(params) {
	params.container.addClass("service-details");
	params.dataset = desktop.dbService;
	
	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnRefresh.add(function(view, data) {
			// memberData.resetData(data.member_data, "", true);
		});
		
		view.Events.OnInitContent.add(function(view, container) {
			new jSplitContainer($.extend(params, {
				paintParams: {
					css: "members"
				},
				container: container,
				orientation: "vert",
				size: 40,
				usePercent: true,
				noBorder: true,
				init: function(splitter) {
					splitter.events.OnPaintPane1.add(function(splitter, container) {
						new jPageControl({
							paintParams: {
								theme: "service-details",
								icon: {
									size: 22,
									position: "left"
								}
							},
							container: container,
							init: function(pg) {
								pg.addTab({caption:"General",
									icon: {
										name: "view-list",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										// tab.container.addClass("bordered-content");
										// tab.container.addClass("content-scrollable");
										// tab.container.css("border-style", "solid solid none none");
										// ClaimDetailsEdit({container: tab.container});
									}
								});
								pg.addTab({caption:"Diagnosis",
									icon: {
										name: "pill",
										color: "firebrick"
									},
									OnCreate: function(tab) {
										// ClaimDiagnosisSummaryView({container:tab.container, claim_id:desktop.dbClaim.get("id")})
									}
								});
								pg.addTab({caption:"Medical Procedures",
									icon: {
										name: "pill",
										color: "firebrick"
									},
									OnCreate: function(tab) {
										// ClaimDiagnosisSummaryView({container:tab.container, claim_id:desktop.dbClaim.get("id")})
									}
								});
								pg.addTab({caption:"Add Plan",
									icon: {
										name: "table-edit",
										color: "forestgreen"
									},
									OnCreate: function(tab) {
										// ClaimDiagnosisSummaryView({container:tab.container, claim_id:desktop.dbClaim.get("id")})
									}
								});
							}
						});
					});
					
					splitter.events.OnPaintPane2.add(function(splitter, container) {						
						new jPageControl({
							paintParams: {
								theme: "service-details",
								icon: {
									size: 22,
									position: "left"
								}
							},
							container: container,
							init: function(pg) {
								pg.addTab({caption:"Invoice",
									icon: {
										name: "table-edit",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										return;
										new jSplitContainer({
											paintParams: {
												css: "service-details"
											},
											container: tab.container,
											orientation: "horz",
											size: 50,
											usePercent: true,
											noBorder: true,
											init: function(splitter) {
												splitter.events.OnPaintPane1.add(function(splitter, container) {
													// container.addClass("bordered-content");
													// container.addClass("content-scrollable");
													// container.css("border-style", "solid");
													// MemberInfoView({container: container});
												});
												
												splitter.events.OnPaintPane2.add(function(splitter, container) {
													new jPageControl({
														paintParams: {
															theme: "service-details",
															icon: {
																size: 22,
																position: "left"
															}
														},
														container: container,
														init: function(pg) {
															pg.addTab({caption:"Member's Policy Information",
																icon: {
																	name: "view-list",
																	color: "dodgerblue"
																},
																OnCreate: function(tab) {
																	// CreateElementEx("pre", tab.container, function(notes) {
																		// notes.addClass("notes");
																		// notes.html(desktop.dbMember.get("notes"));
																	// });
																}
															});
															pg.addTab({caption:"Plan History",
																icon: {
																	name: "view-list",
																	color: "forestgreen"
																},
																OnCreate: function(tab) {
																	
																}
															});
															pg.addTab({caption:"Address",
																icon: {
																	name: "view-list",
																	color: "forestgreen"
																},
																OnCreate: function(tab) {
																	
																}
															});
															pg.addTab({caption:"Contacts",
																icon: {
																	name: "view-list",
																	color: "forestgreen"
																},
																OnCreate: function(tab) {
																	
																}
															});
															pg.addTab({caption:"Medical Notes",
																icon: {
																	name: "view-list",
																	color: "forestgreen"
																},
																OnCreate: function(tab) {
																	
																}
															});
														}
													});
												});
											}
										});
									}
								});
								pg.addTab({caption:"Status History",
									icon: {
										name: "claim-status",
										color: "firebrick"
									},
									OnCreate: function(tab) {
										tab.container.addClass("bordered-content");
										tab.container.css("border-style", "solid none none solid");
										ServiceStatusView({container:tab.container, requestParams:{service_id:desktop.dbService.get("id")}})										
									}
								});
								pg.addTab({caption:"Actions",
									icon: {
										name: "calendar-blank",
										color: "forestgreen"
									},
									OnCreate: function(tab) {
										tab.container.addClass("bordered-content");
										tab.container.css("border-style", "solid none none solid");
										ServiceActionsView({container:tab.container, requestParams:{service_id:desktop.dbService.get("id")}})
									}
								});
								pg.addTab({caption:"Payment",
									icon: {
										name: "view-list",
										color: "forestgreen"
									},
									OnCreate: function(tab) {
										
									}
								});
								pg.addTab({caption:"Rebate",
									icon: {
										name: "view-list",
										color: "forestgreen"
									},
									OnCreate: function(tab) {
										
									}
								});
							}
						});
					});
				}
			});
			// var left = CreateElement("div", container).attr("x-sec", "content-left");
				// ClaimDetailsEdit({
					// claim_id: parseInt(params.requestParams.claim_id),
					// dataset: params.dataset,
					// container: left
				// })
			
			// var right = CreateElement("div", container).attr("x-sec", "content-right");
				// MemberInfoEdit({
					// claim_id: parseInt(params.requestParams.claim_id),
					// dataset: memberData,
					// container: right
				// })
		});
		
		// view.Events.OnInitToolbar.add(function(view, toolbar) {
			// toolbar.NewDropDownConfirmItem({
				// id: "delete",
				// icon: "delete",
				// color: "firebrick",
				// hint: "Delete claim",
				// title: "Delete Claim",
				// subTitle: "Please confirm to delete claim.",
				// dataBind: desktop.dbClaim,
				// dataEvent: function(dataset, button) {
					// button.show(!dataset.editing);
				// },
				// confirm: function() {
					
				// }
			// });
			
			// toolbar.SetVisible("delete", !desktop.dbClaim.editing);
		// });
	});
};
