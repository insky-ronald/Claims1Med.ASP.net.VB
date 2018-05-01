// ****************************************************************************************************
// Last modified on
// 17-AUG-2017
// ****************************************************************************************************
//==================================================================================================
// File name: provider-master-detail-view.js
//==================================================================================================
function ProviderMasterDetailView(params) {	
	var providerType = params.requestParams.provider_type;
	var providerMasterView;
	
	desktop.dbCountries = desktop.LoadCacheData(desktop.customData.countries, "countries", "code");
	desktop.dbDoctorSpecialisation = desktop.LoadCacheData(desktop.customData.specialisation, "specialisation", "specialisation_code");
	
	new jPageControl({
		paintParams: {
			// theme: "customer-service-view",
			icon: {
				size: 24,
				position: "left"
			}
		},
		container: params.container,
		init: function(pg) {
			var title;
			if(providerType === "D")
				title = "Doctors"
			else if(providerType === "H")
				title = "Hospitals";
			
			pg.addTab({caption:title,
				icon: {
					name: "search",
					color: "#27AE60"
				},
				OnCreate: function(tab) {
					new jSplitContainer($.extend(params, {
						paintParams: {
							css: "customer-service"
						},
						container: tab.container,
						orientation: "horz",
						size: 45,
						usePercent: true,
						noBorder: true,
						init: function(splitter) {
							splitter.events.OnPaintPane1.add(function(splitter, container) {
								container.addClass("providers-view-container");
								if(providerType === "D")
									providerMasterView = DoctorsView({
										container: container,
										providerType: providerType
									});
								else if(providerType === "H")
									providerMasterView = HospitalsView({
										container: container,
										providerType: providerType
									});
							});
							
							splitter.events.OnPaintPane2.add(function(splitter, container) {
								// container.addClass("view-container");
								new jPageControl({
									paintParams: {
										theme: "provider-sub-view",
										icon: {
											size: 18,
											position: "left",
											color: "#27AE60"
										}
									},
									container: container,
									masterView: providerMasterView,
									init: function(pg) {
										pg.addTab({caption:"Addresses",
											icon: {
												name: "table"
											},
											OnSetKey: function(detail, keyID) {
												detail.view.dataParams.set("name_id", keyID);
												detail.view.refresh();
											},
											OnCreateMasterDetail: function(detail, keyID) {
												return new AddressesView({
													getMasterID: function() {
														return detail.master.view.dataset.getKey()
													},
													container: detail.tab.container
												});
											},
											// OnCreate: function(tab) {
												// tab.detail.update();
											// },
											OnActivate: function(tab) {
												tab.detail.sync();
											}
										};
										pg.addTab({caption:"Contacts",
											icon: {
												name: "contacts"												
											},
											OnSetKey: function(detail, keyID) {
												detail.view.dataParams.set("name_id", keyID);
												detail.view.refresh();
											},
											OnCreateMasterDetail: function(detail, keyID) {
												return new ContactsView({
													getMasterID: function() {
														return detail.master.view.dataset.getKey()
													},
													container: detail.tab.container
												});
											},
											OnCreate: function(tab) {
												tab.detail.update();
											},
											OnActivate: function(tab) {
												tab.detail.sync();
											}
										});
										pg.addTab({caption:"Banks",
											icon: {
												name: "bank"
											},
											OnSetKey: function(detail, keyID) {
												detail.view.dataParams.set("name_id", keyID);
												detail.view.refresh();
											},
											OnCreateMasterDetail: function(detail, keyID) {
												return new BanksView({
													getMasterID: function() {
														return detail.master.view.dataset.getKey()
													},
													container: detail.tab.container
												});
											},
											OnCreate: function(tab) {
												tab.detail.update();
											},
											OnActivate: function(tab) {
												tab.detail.sync();
											}
										});
										pg.addTab({caption:"Notes",
											icon: {
												name: "notes"
											},
											OnCreate: function(tab) {
											}
										};
										/*
										pg.addTab({caption:"Discount",
											icon: {
												name: "discount"
											},
											OnSetKey: function(detail, keyID) {
												// detail.view.dataParams.set("name_id", keyID);
												// detail.view.refresh();
											},
											OnCreateMasterDetail: function(detail, keyID) {
												return new ProviderDiscountEdit({
													id: keyID,
													container: detail.tab.container
												});
											},
											OnCreate: function(tab) {
												tab.detail.update();
											},
											OnActivate: function(tab) {
												tab.detail.sync();
											}
										}; */
										if(providerType === "D") {
											pg.addTab({caption:"Hospitals",
												icon: {
													name: "hospitals"
												},
												OnCreate: function(tab) {
												}
											};
										};
										if(providerType === "H") {
											pg.addTab({caption:"Clients",
												icon: {
													name: "hospitals"
												},
												OnCreate: function(tab) {
												}
											};
											pg.addTab({caption:"Doctors",
												icon: {
													name: "doctor"
												},
												OnCreate: function(tab) {
												}
											};
										};
									}
								});
							});
						}
					});
				}
			}
		}
	});
};
