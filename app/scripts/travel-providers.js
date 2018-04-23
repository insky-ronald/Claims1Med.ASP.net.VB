// ****************************************************************************************************
// Last modified on
// 23-Apr-2018
// ****************************************************************************************************
//==================================================================================================
// File name: medical-providers.js
//==================================================================================================
function TravelProvidersView(viewParams){
	new jPageControl({
		paintParams: {
			theme: "default",
			icon: {
				size: 22,
				position: "left"
			}
		},
		container: viewParams.container,
		init: function(pg) {
			pg.addTab({caption:"Air Lines",
				icon: {
					name: "airplane",
					color: "dodgerblue"
				},
				OnCreate: function(tab) {
					// ClaimDocumentsInView({container:tab.container, requestParams:$.extend(viewParams.requestParams, {source:"I"})});
					// ClaimDocumentsInView($.extend(viewParams, {container:tab.container}))
				}
			});
			pg.addTab({caption:"Credit Cards",
				icon: {
					name: "credit-card",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					// new UpdateBreakdownView({container:tab.container, serviceID:viewParams.requestParams.service_id, section:1});
				}
			});
		}
	});
};
