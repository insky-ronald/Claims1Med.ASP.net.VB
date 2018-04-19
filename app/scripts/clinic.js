// ****************************************************************************************************
// Last modified on
// 7-JUL-2017 - ronald
// ****************************************************************************************************
//==================================================================================================
// File name: clinic.js
//==================================================================================================
function ClinicView(params) {
	params.container.addClass("clinic");
	params.dataset = new Dataset(desktop.customData.data, "Clinic");
	desktop.dbCountries = desktop.LoadCacheData(desktop.customData.countries, "countries", "code");
	//desktop.dbDoctorSpecialisation = desktop.LoadCacheData(desktop.customData.specialisation, "specialisation", "specialisation_code");
	
	var clinic_id = params.requestParams.clinic_id;

	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnInitContent.add(function(view, container) {
			var a_container = CreateElement("div", container).attr("x-sec", "content");
				ClinicEdit({
					dataset: params.dataset,
					url: ("?id={0}").format(clinic_id),
					container: a_container,
					containerPadding: 0,
					showToolbar: false,
					pageControlTheme: "data-entry",
					fillContainer: false
				});
		});
	});
};
