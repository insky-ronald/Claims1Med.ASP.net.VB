// ****************************************************************************************************
// Last modified on
// 23-Apr-2018
// ****************************************************************************************************
//==================================================================================================
// File name: travel-providers.js
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
					ProviderAirlinesView({container:tab.container})
				}
			});
			pg.addTab({caption:"Credit Cards",
				icon: {
					name: "credit-card",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					ProviderCreditCardsView({container:tab.container})
				}
			});
		}
	});
};
