// ****************************************************************************************************
// Last modified on
// 17-AUG-2017
// ****************************************************************************************************
//==================================================================================================
// File name: clinics.js
//==================================================================================================
function ProviderClinicsView(params) {
	var clinicsMasterView;
	
	new jSplitContainer($.extend(params, {
		paintParams: {
			theme: "white-green-dark"
		},
		container: params.container,
		orientation: "horz",
		size: 45,
		usePercent: true,
		noBorder: true,
		init: function(splitter) {
			splitter.events.OnPaintPane1.add(function(splitter, container) {
				clinicsMasterView = ClinicsView({container: container});
			});
			
			splitter.events.OnPaintPane2.add(function(splitter, container) {
				new jPageControl({
					paintParams: {
						theme: "default",
						icon: {
							size: 18,
							position: "left",
							color: "#27AE60"
						}
					},
					container: container,
					masterView: clinicsMasterView,
					init: function(pg) {
						pg.addTab({caption:"Addresses",
							icon: {
								name: "addresses"
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
							OnActivate: function(tab) {
								tab.detail.sync();
							}
						});
						
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
						});
					}
				})
			})
		}
	}))
};
