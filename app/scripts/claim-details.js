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
	params.postBack = "app/claim"
	// console.log(params);
	
	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnRefresh.add(function(view, data) {
			// memberData.resetData(data.member_data, "", true);
		});
		
		view.Events.OnInitContent.add(function(view, container) {
			new jSplitContainer($.extend(params, {
				paintParams: {
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
								pg.addTab({caption:desktop.dbClaim.get("claim_type_name"),
									icon: {
										name: "view-list",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										// ClaimDetailsEdit(), refer to edit-claim-details.js
										ClaimDetailsEdit({container: tab.container});
									}
								});
								
								if(!desktop.customData.newRecord) {
									pg.addTab({caption:"Diagnosis",
										icon: {
											name: "pill",
											color: "firebrick"
										},
										OnCreate: function(tab) {
											ClaimDiagnosisSummaryView({container:tab.container, claim_id:desktop.dbClaim.get("id")})
										}
									})
								}
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
															// Hide for now as not needed by LDA
															// pg.addTab({caption:"Member's Policy Information",
																// icon: {
																	// name: "info",
																	// color: "dodgerblue"
																// },
																// OnCreate: function(tab) {
																	// CreateElementEx("pre", tab.container, function(notes) {
																		// notes.addClass("notes");
																		// notes.html(desktop.dbMember.get("notes"));
																	// });
																// }
															// });
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
																	// MemberMedicalNotesEdit: refer to edit-member-medical-notes.js
																	new MemberMedicalNotesEdit({container:tab.container, dataset:desktop.dbMedicalNotes})																	
																}
															});
															pg.addTab({caption:"Address",
																icon: {
																	name: "addresses",
																	color: "forestgreen"
																},
																OnCreate: function(tab) {
																	AddressesView({
																		getMasterID: function() {
																			return desktop.dbMember.get("name_id")
																		},
																		container: tab.container
																	});
																}
															});
															pg.addTab({caption:"Contacts",
																icon: {
																	name: "contacts",
																	color: "forestgreen"
																},
																OnCreate: function(tab) {
																	ContactsView({
																		getMasterID: function() {
																			return desktop.dbMember.get("name_id")
																		},
																		container: tab.container
																	});
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
								
								if(!desktop.customData.newRecord) {
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
								}
							}
						});
					});
				}
			}));
			
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
				confirm: function(button) {
					desktop.Ajax(null, "/app/get/delete/claim", {
							mode: "delete",
							data: "["+JSON.stringify({id: desktop.dbClaim.get("id")})+"]"
						}, 
						function(result) {
							if(result.status < 0) {
								ErrorDialog({
									target: button.elementContainer,
									title: "Error deleting claim",
									message: result.message,
									snap: "bottom",
									inset: false
								})
							} else {
								window.close();
							}
						}
					)
				}
			});
			
			toolbar.SetVisible("delete", !desktop.dbClaim.editing);
		});
	});
};
