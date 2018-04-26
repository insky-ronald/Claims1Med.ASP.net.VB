// ****************************************************************************************************
// Last modified on
// 25-Apr-2018
// ****************************************************************************************************
//==================================================================================================
// File name: view-providers.js
//==================================================================================================
function ProvidersView(viewParams) {
	var providersMasterView;
	new jSplitContainer($.extend(viewParams, {
		paintParams: {
			//css: "accounts"
			theme: "white-green-dark"
		},
		container: viewParams.container,
		orientation: "horz",
		size: 60,
		usePercent: true,
		noBorder: true,
		init: function(splitter) {
			splitter.events.OnPaintPane1.add(function(splitter, container) {
				container.addClass("pane1-container");
				
				providersMasterView = ProvidersList({container:container, requestParams:viewParams.requestParams});
			});
			
			splitter.events.OnPaintPane2.add(function(splitter, container) {
				container.addClass("pane2-container");
				new jPageControl({
					paintParams: {
						theme: "default",
						icon: {
							size: 24,
							position: "left"
						}
					},
					container: container,
					masterView: providersMasterView,
					init: function(pg) {
						pg.addTab({caption:"Addresses",
							icon: {
								name: "addresses",
								color: "dodgerblue"
							},
							OnSetKey: function(detail, keyID) {
								detail.view.dataParams.set("name_id", keyID);
								detail.view.refresh();
							},
							OnCreateMasterDetail: function(detail, keyID) {
								return new AddressesView({
									nameID: keyID,
									container: detail.tab.container,
									masterDataset: detail.master.view.dataset
								});
							},
							OnActivate: function(tab) {
								tab.detail.sync();
							}
						});
						pg.addTab({caption:"Contacts",
							icon: {
								name: "contacts",
								color: "forestgreen"
							},
							OnSetKey: function(detail, keyID) {
								detail.view.dataParams.set("name_id", keyID);
								detail.view.refresh();
							},
							OnCreateMasterDetail: function(detail, keyID) {
								return new ContactsView({
									nameID: keyID,
									container: detail.tab.container,
									masterDataset: detail.master.view.dataset
								});
							},
							OnCreate: function(tab) {
								tab.detail.update();
							},
							OnActivate: function(tab) {
								tab.detail.sync();
							}
						});
					}
				});
			});
		}
	}));
};

function ProvidersList(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "accounts",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			BrokerEdit({
				id: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {	
            var exportName = "";		
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/providers";
				
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				// grid.options.editNewPage = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				switch(params.requestParams.providerType) {
					case "H":
						exportName = "Hospitals";
						break;
					case "D":
						exportName = "Doctors";
						break;
					case "K":
						exportName = "Clinics";
						break;
					case "A":
						exportName = "Airlines";
						break;
				};
				
				grid.exportData.allow = true;
				grid.exportData.name = exportName;
				grid.exportData.source = "DBMedics.GetProviders";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "name")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						.addColumn("type", params.requestParams.accountType)
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key:true})
						// .setprops("pa_id", {labelnumeric:true})
						// .setprops("pin", {label:"PIN"})
						.setprops("name", {label:"Name"})
						// .setprops("pa_name", {label:"PA Name"})
						.setprops("country", {label:"Country"})
						.setprops("country_code", {label:"Country"})
						// .setprops("currency", {label:"Currency"})
						// .setprops("currency_code", {label:"Currency"})
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {title: "Delete Provider", message: ("Please confirm to delete provider <b>{0}</b>.").format(grid.dataset.get("name"))};
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "name", width: 300, aloowSort: true, fixedWidth:true});
					// grid.NewColumn({fname: "currency", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "country", width: 200, allowSort: true, fixedWidth:true});
				});
				
			});
		}
	}));
};
