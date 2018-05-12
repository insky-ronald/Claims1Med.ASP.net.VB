// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: claim-details.js
//==================================================================================================
function ClientDetailsView(params) {
	var tabIconSize = 20;
	
	params.container.addClass("client-details");
	params.dataset = desktop.dbClient;
	params.postBack = "app/client"
	// return;
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
				size: 50,
				usePercent: true,
				noBorder: true,
				init: function(splitter) {
					splitter.events.OnPaintPane1.add(function(splitter, container) {
						new jPageControl({
							paintParams: {
								css: "pg-client",
								theme: "client-details",
								icon: {
									size: tabIconSize,
									position: "left"
								}
							},
							container: container,
							init: function(pg) {
								pg.addTab({caption: "Client",
									icon: {
										name: "user",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										// ClaimDetailsEdit({container: tab.container});
									}
								});
							}
						});
					});
					
					splitter.events.OnPaintPane2.add(function(splitter, container) {
						new jSplitContainer($.extend(params, {
							paintParams: {
								theme: "white-green-dark"
							},
							container: container,
							orientation: "horz",
							size: 50,
							usePercent: true,
							noBorder: true,
							init: function(splitter) {
								splitter.events.OnPaintPane1.add(function(splitter, container) {
									new jPageControl({
										paintParams: {
											css: "pg-client",
											theme: "client-details",
											icon: {
												size: tabIconSize,
												position: "left"
											}
										},
										container: container,
										init: function(pg) {
											pg.addTab({caption: "Address",
												icon: {
													name: "addresses",
													color: "dodgerblue"
												},
												OnCreate: function(tab) {
													AddressesView({
														getMasterID: function() {
															return desktop.dbClient.get("id")
														},
														container: tab.container
													});
												}
											});
											pg.addTab({caption: "Contacts",
												icon: {
													name: "contacts",
													color: "dodgerblue"
												},
												OnCreate: function(tab) {
													ContactsView({
														getMasterID: function() {
															return desktop.dbClient.get("id")
														},
														container: tab.container
													});
												}
											});
											pg.addTab({caption: "Banks",
												icon: {
													name: "bank",
													color: "dodgerblue"
												},
												OnCreate: function(tab) {
													BanksView({
														getMasterID: function() {
															return desktop.dbClient.get("id")
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
											css: "pg-client",
											theme: "client-details",
											icon: {
												size: tabIconSize,
												position: "left"
											}
										},
										container: container,
										init: function(pg) {
											pg.addTab({caption: "Floats",
												icon: {
													name: "table",
													color: "forestgreen"
												},
												OnCreate: function(tab) {
													FloatsView({
														getMasterID: function() {
															return desktop.dbClient.get("id")
														},
														container: tab.container
													});
												}
											});
											
											pg.addTab({caption: "Case Fees",
												icon: {
													name: "table",
													color: "forestgreen"
												},
												OnCreate: function(tab) {
													// ClaimDetailsEdit({container: tab.container});
												}
											});
										}
									});
								});
							}
						});
					});
				}
			});
		});
	});
};
