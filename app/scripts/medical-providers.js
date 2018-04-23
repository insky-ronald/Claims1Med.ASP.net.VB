// ****************************************************************************************************
// Last modified on
// 23-Apr-2018
// ****************************************************************************************************
//==================================================================================================
// File name: medical-providers.js
//==================================================================================================
function MedicalProvidersView(viewParams){
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
			pg.addTab({caption:"Doctors",
				icon: {
					name: "doctor",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					// new UpdateBreakdownView({container:tab.container, serviceID:viewParams.requestParams.service_id, section:1});
				}
			});
			pg.addTab({caption:"Clinics",
				icon: {
					name: "prescription",
					color: "red"
				},
				OnCreate: function(tab) {
					// new UpdateBreakdownView({container:tab.container, serviceID:viewParams.requestParams.service_id, section:1});
				}
			});
			pg.addTab({caption:"Hospitals",
				icon: {
					name: "hospitals",
					color: "dodgerblue"
				},
				OnCreate: function(tab) {
					// ClaimDocumentsInView({container:tab.container, requestParams:$.extend(viewParams.requestParams, {source:"I"})});
					// ClaimDocumentsInView($.extend(viewParams, {container:tab.container}))
				}
			});
			pg.addTab({caption:"Pharmacies",
				icon: {
					name: "pill",
					color: "red"
				},
				OnCreate: function(tab) {
					// new UpdateBreakdownView({container:tab.container, serviceID:viewParams.requestParams.service_id, section:1});
				}
			});
		}
	});
};
