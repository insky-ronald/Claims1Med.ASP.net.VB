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
						if (desktop.customData.newRecord) {
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
									// display family members only
									pg.addTab({caption:"Family Members",
										icon: {
											name: "users",
											color: "dodgerblue"
										},
										OnCreate: function(tab) {
											FamilyMembersView({
												container:tab.container, 
												requestParams:{
													new_member: desktop.customData.newRecord,
													plan_code:desktop.dbMember.get("plan_code"),
													certificate_id:desktop.dbMember.get("certificate_id")
												}
											})
										}
									})
								}
							});
							
							return;
						}
						
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
											pg.addTab({
												caption:"Family Members",
												icon: {
													name: "users",
													color: "dodgerblue"
												},
												OnCreate: function(tab) {
													FamilyMembersView({
														container:tab.container, 
														requestParams:{
															new_member: desktop.customData.newRecord,
															plan_code:desktop.dbMember.get("plan_code"),
															certificate_id:desktop.dbMember.get("certificate_id")
														}
													})
												}
											});
											
											pg.addTab({
												caption:"Address",
												icon: {
													name: "addresses",
													color: "forestgreen"
												},
												permission: desktop.customData.permissions.address,
												OnCreate: function(tab) {
													AddressesView({
														action: "member-address",
														getMasterID: function() {
															return desktop.dbMember.get("name_id")
														},
														container: tab.container
													});
												}
											});
											
											pg.addTab({
												caption:"Contacts",
												icon: {
													name: "contacts",
													color: "forestgreen"
												},
												permission: desktop.customData.permissions.contact,
												OnCreate: function(tab) {
													ContactsView({
														action: "member-contact",
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
											pg.addTab({caption:"Plan History",
												icon: {
													name: "history",
													color: "forestgreen"
												},
												permission: desktop.customData.permissions.plan_history,
												OnCreate: function(tab) {
													new MemberPlanHistoryView({
														container:tab.container, 
														requestParams: {
															member_id: desktop.dbMember.get("id")
														}
													});
												}
											});
											
											pg.addTab({caption:"Medical Notes",
												icon: {
													name: "notes",
													color: "orange"
												},
												permission: desktop.customData.permissions.medical_notes,
												OnCreate: function(tab) {
													new MemberMedicalNotesEdit({
														container:tab.container, 
														dataset: desktop.dbMedicalNotes,
														requestParams: {
															readonly: !desktop.customData.permissions.medical_notes.edit
														}
													})
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
					// button.show(!dataset.editing && desktop.customData.crud["delete"]);
					button.show(!dataset.editing);
				},
				permission: {view:desktop.customData.crud["delete"]},
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
			
			// toolbar.SetVisible("delete", !desktop.dbMember.editing && desktop.customData.crud["delete"]);
			// toolbar.SetVisible("delete", !desktop.dbMember.editing);
		});
		
	});
};
