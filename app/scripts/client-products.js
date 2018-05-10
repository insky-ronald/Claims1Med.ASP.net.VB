// ****************************************************************************************************
// Last modified on
// 17-AUG-2017
// ****************************************************************************************************
//==================================================================================================
// File name: client-products.js
//==================================================================================================
function ClientProductsView(params) {
	var productsMasterView;
	
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
				productsMasterView = ClientProductsGrid({container: container, clientID: params.requestParams.name_id});
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
					masterView: productsMasterView,
					init: function(pg) {
						pg.addTab({caption:"Plans",
							icon: {
								name: "table-edit"
							},
							OnSetKey: function(detail, keyID) {
								detail.view.dataParams.set("product_code", params.requestParams.name_id);
								detail.view.refresh();
							},
							OnCreateMasterDetail: function(detail, keyID) {
								return new PlansView({
									getMasterID: function() {
										return params.requestParams.name_id
									},
									container: detail.tab.container
								});
							},
							OnActivate: function(tab) {
								tab.detail.sync();
							}
						});
					}
				})
			})
		}
	}))
};
