// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: claim-details.js
//==================================================================================================
function ClaimDetailsView(params) {
	var tabIconSize = 20;
	
	params.container.addClass("claim-details");
	params.dataset = desktop.dbClaim;
	
	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnRefresh.add(function(view, data) {
			// memberData.resetData(data.member_data, "", true);
		});
		
		view.Events.OnInitContent.add(function(view, container) {
			new jSplitContainer($.extend(params, {
				paintParams: {
					// css: "sp-claim",
					theme: "white-green-dark"
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
								css: "pg-claim",
								theme: "claim-details",
								icon: {
									size: tabIconSize,
									position: "left"
								}
							},
							container: container,
							init: function(pg) {
								// pg.addTab({caption:"Test",
									// icon: {
										// name: "user",
										// color: "dodgerblue"
									// },
									// OnCreate: function(tab) {
										// tab.container.addClass("test-scroll");
										// CreateElement("div", tab.container).addClass("test-scroll-content");
										// new jScroller({
											// target:tab.container
										// })
									// }
								// });
								pg.addTab({caption:"Claim",
									icon: {
										name: "view-list",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										ClaimDetailsEdit({container: tab.container});
									}
								});
								pg.addTab({caption:"Diagnosis",
									icon: {
										name: "pill",
										color: "firebrick"
									},
									OnCreate: function(tab) {
										ClaimDiagnosisSummaryView({container:tab.container, claim_id:desktop.dbClaim.get("id")})
									}
								});
							}
						});
					});
					
					splitter.events.OnPaintPane2.add(function(splitter, container) {
						new jPageControl({
							paintParams: {
								css: "pg-claim2",
								theme: "claim-details",
								icon: {
									size: tabIconSize,
									position: "left"
								}
							},
							showScrollButtons:true,
							container: container,							
							init: function(pg) {
								// pg.addTab({caption:"Test",
									// icon: {
										// name: "user",
										// color: "dodgerblue"
									// },
									// OnCreate: function(tab) {
										// tab.container.addClass("test-scroll")
										// CreateElement("div", tab.container).addClass("test-scroll-content");
										// new jScroller({
											// target:tab.container
										// })
									// }
								// });
								pg.addTab({caption:"Member",
									icon: {
										name: "user",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										new jSplitContainer({
											paintParams: {
												// css: "claim-details"
												// css: "sp-claim2",
												theme: "white-green-dark"
											},
											container: tab.container,
											orientation: "horz",
											size: 60,
											usePercent: true,
											noBorder: true,
											init: function(splitter) {
												splitter.events.OnPaintPane1.add(function(splitter, container) {
													// container.addClass("bordered-content");
													// container.addClass("content-scrollable");
													// container.css("border-width", "inherit");
													// container.css("border-color", "inherit");
													// container.css("border-style", "none none solid none");
													MemberInfoView({container: container});
												});
												
												splitter.events.OnPaintPane2.add(function(splitter, container) {
													new jPageControl({
														paintParams: {
															css: "pg-member",
															theme: "claim-details",
															icon: {
																size: tabIconSize,
																position: "left"
															}
														},
														// showScrollButtons:true,
														container: container,
														init: function(pg) {
															pg.addTab({caption:"Member's Policy Information",
																icon: {
																	name: "user",
																	color: "dodgerblue"
																},
																OnCreate: function(tab) {
																	CreateElementEx("pre", tab.container, function(notes) {
																		notes.addClass("notes");
																		notes.html(desktop.dbMember.get("notes"));
																	});
																}
															});
															pg.addTab({caption:"Plan History",
																icon: {
																	name: "history",
																	color: "forestgreen"
																},
																OnCreate: function(tab) {
																	// console.log(desktop.dbMember.get("id"))
																	MemberPlanHistoryView({container:tab.container, requestParams: {member_id:desktop.dbMember.get("member_id")}});
																}
															});
															pg.addTab({caption:"Medical Notes",
																icon: {
																	name: "notes",
																	color: "darkgoldenrod"
																},
																OnCreate: function(tab) {
																	new MemberMedicalNotesEdit({container:tab.container, dataset:desktop.dbMedicalNotes})																	
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
															// pg.addTab({caption:"This is a test",
																// icon: {
																	// name: "view-list",
																	// color: "forestgreen"
																// },
																// OnCreate: function(tab) {
																	
																// }
															// });
															// pg.addTab({caption:"John Zapanta",
																// icon: {
																	// name: "view-list",
																	// color: "forestgreen"
																// },
																// OnCreate: function(tab) {
																	
																// }
															// });
															// pg.addTab({caption:"IBSI",
																// icon: {
																	// name: "view-list",
																	// color: "forestgreen"
																// },
																// OnCreate: function(tab) {
																	
																// }
															// });
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
										ClaimStatusHistoryView({container:tab.container, claim_id:desktop.dbClaim.get("id")})
									}
								});
								// pg.addTab({caption:"Diagnosis Summary",
									// icon: {
										// name: "view-list",
										// color: "forestgreen"
									// },
									// OnCreate: function(tab) {
										
									// }
								// });
								pg.addTab({caption:"Benefit Utilisation",
									icon: {
										name: "view-list",
										color: "forestgreen"
									},
									OnCreate: function(tab) {
										
									}
								});
								pg.addTab({caption:"This is a test",
									icon: {
										name: "view-list",
										color: "forestgreen"
									},
									OnCreate: function(tab) {
										
									}
								});
								pg.addTab({caption:"John Zapanta",
									icon: {
										name: "view-list",
										color: "forestgreen"
									},
									OnCreate: function(tab) {
										
									}
								});
								pg.addTab({caption:"IBSI",
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
		
		view.Events.OnInitToolbar.add(function(view, toolbar) {
			toolbar.NewDropDownConfirmItem({
				id: "delete",
				icon: "delete",
				color: "firebrick",
				hint: "Delete claim",
				title: "Delete Claim",
				subTitle: "Please confirm to delete claim.",
				dataBind: desktop.dbClaim,
				dataEvent: function(dataset, button) {
					button.show(!dataset.editing);
				},
				confirm: function() {
					
				}
			});
			
			toolbar.SetVisible("delete", !desktop.dbClaim.editing);
		});
	});
};

function ClaimDetailsView2(params) {
	// console.log(params)
	params.container.addClass("claim-details");
	var memberData = new Dataset(desktop.customData.member_data, "Member");
	params.dataset = new Dataset(desktop.customData.data, "Claim");
	desktop.dbCountries = desktop.LoadCacheData(desktop.customData.countries, "countries", "code");
	desktop.dbUsers = desktop.LoadCacheData(desktop.customData.users, "users", "user_name");
	desktop.dbClaimTypes = desktop.LoadCacheData([
		{code:"MED", claim_type:"Medical"},
		{code:"MEDW", claim_type:"Medical Claims Warranty"},
		{code:"TRV", claim_type:"Travel"},
	], "claimtypes", "code");
	
	// var claim_id = params.requestParams.claim_id;
	// var member_id = params.requestParams.member_id;
	
	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnRefresh.add(function(view, data) {
			memberData.resetData(data.member_data, "", true);
		});
		
		view.Events.OnInitContent.add(function(view, container) {
			var left = CreateElement("div", container).attr("x-sec", "content-left");
				// view.claim = ClaimDetailsEdit({
				ClaimDetailsEdit({
					claim_id: parseInt(params.requestParams.claim_id),
					dataset: params.dataset,
					container: left
				})
			
			var right = CreateElement("div", container).attr("x-sec", "content-right");
				// view.member = MemberInfoEdit({
				MemberInfoEdit({
					claim_id: parseInt(params.requestParams.claim_id),
					dataset: memberData,
					container: right
				})
		});
		
		// view.Events.OnInitToolbar.add(function(view, toolbar) {
		// });
	});
};
