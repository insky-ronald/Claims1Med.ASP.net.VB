// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: member.js
//==================================================================================================
function MemberView(params) {
	var tabIconSize = 20;
	
	params.container.addClass("member");
	// params.dataset = new Dataset(desktop.customData.data, "Member");
	params.dataset = desktop.dbMember;
	params.postBack = "app/member"
	// desktop.dbCountries = desktop.LoadCacheData(desktop.customData.countries, "countries", "code");
	
	var member_id = params.requestParams.member_id;
	var certificate_id = params.requestParams.certificate_id;

	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
	
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
								pg.addTab({caption:"Member",
									icon: {
										name: "user",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										MemberEdit({container: tab.container});
									}
								});
								
								// pg.addTab({caption:"Medical Notes",
									// icon: {
										// name: "notes",
										// color: "orange"
									// },
									// OnCreate: function(tab) {
										// ClaimDetailsEdit({container: tab.container});
									// }
								// });
							}
						});
					});
					
					splitter.events.OnPaintPane2.add(function(splitter, container) {
						new jSplitContainer({
							paintParams: {
								theme: "white-green-dark"
							},
							container: container,
							orientation: "horz",
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
											pg.addTab({caption:"Plan History",
												icon: {
													name: "history",
													color: "forestgreen"
												},
												OnCreate: function(tab) {
													MemberPlanHistoryView({container:tab.container, requestParams: {member_id:desktop.dbMember.get("id")}});
												}
											});
											
											// if(!desktop.customData.newRecord) {
											pg.addTab({caption:"Family Members",
												icon: {
													name: "users",
													color: "dodgerblue"
												},
												OnCreate: function(tab) {
													// ClaimDiagnosisSummaryView({container:tab.container, claim_id:desktop.dbClaim.get("id")})
												}
											})
											// }
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
										}
									});
								});
								
								splitter.events.OnPaintPane2.add(function(splitter, container) {
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
											pg.addTab({caption:"Medical Notes",
												icon: {
													name: "notes",
													color: "orange"
												},
												OnCreate: function(tab) {
													new MemberMedicalNotesEdit({container:tab.container, dataset:desktop.dbMedicalNotes})
												}
											});
											
											// pg.addTab({caption:"Case History",
												// icon: {
													// name: "history",
													// color: "forestgreen"
												// },
												// OnCreate: function(tab) {
													// ClaimDetailsEdit(), refer to edit-claim-details.js
													// ClaimDetailsEdit({container: tab.container});
												// }
											// });
											
											// if(!desktop.customData.newRecord) {
											pg.addTab({caption:"Benefit Utilisation",
												icon: {
													name: "benefit",
													color: "dodgerblue"
												},
												OnCreate: function(tab) {
													new jPageControl({
														paintParams: {
															css: "pg-claim",
															theme: "claim-details",
															icon: {
																size: tabIconSize,
																position: "left"
															}
														},
														container: tab.container,
														init: function(pg) {
															pg.addTab({caption:"Normal",
																icon: {
																	name: "benefit",
																	color: "dodgerblue"
																},
																OnCreate: function(tab) {
																	// ClaimDetailsEdit({container: tab.container});
																}
															});
															
															pg.addTab({caption:"Per Year",
																icon: {
																	name: "benefit",
																	color: "dodgerblue"
																},
																OnCreate: function(tab) {
																	// ClaimDetailsEdit({container: tab.container});
																}
															});
														}
													});
												}
											});
											// }
										}
									});
								});
							}
						});
					});
				}
			});
		});
		
		view.Events.OnInitToolbar.add(function(view, toolbar) {
			toolbar.NewDropDownConfirmItem({
				id: "delete",
				icon: "delete",
				color: "firebrick",
				hint: "Delete member",
				title: "Delete Member",
				subTitle: "Please confirm to delete member.",
				dataBind: desktop.dbMember,
				dataEvent: function(dataset, button) {
					button.show(!dataset.editing);
				},
				confirm: function(button) {
					desktop.Ajax(null, "/app/get/delete/member", {
							mode: "delete",
							data: "["+JSON.stringify({id: desktop.dbMember.get("id")})+"]"
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
			
			toolbar.SetVisible("delete", !desktop.dbMember.editing);
		});
		
	});
};
